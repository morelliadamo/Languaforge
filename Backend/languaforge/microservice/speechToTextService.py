from fastapi import FastAPI, UploadFile, File, Form
import whisper
import tempfile
import shutil
import re
from typing import Optional, List, Dict

app = FastAPI()

sttModel = whisper.load_model("base")
_WORD_RE = re.compile(r"[a-zA-Z0-9]+(?:'[a-zA-Z0-9]+)?", re.IGNORECASE)

def tokenize(text: str) -> List[str]:
    """Extract words from text, removing punctuation and converting to lowercase."""
    if not text:
        return []
    cleaned = re.sub(r"[^\w\s']", " ", text, flags=re.UNICODE)
    tokens = _WORD_RE.findall(cleaned.lower())
    return tokens


def alignSequences(expected: List[str], actual: List[str]) -> Dict:
    m, n = len(expected), len(actual)
    dp = [[0] * (n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        dp[i][0] = i
    for j in range(1, n+1):
        dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            cost = 0 if expected[i-1] == actual[j-1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            )
    i, j = m, n
    ops = []
    matches = 0
    while i > 0 or j > 0:
        if i > 0 and j > 0 and dp[i][j] == dp[i-1][j-1] and expected[i-1] == actual[j-1]:
            ops.append({"op": "match", "expected": expected[i-1], "actual": actual[j-1]})
            matches += 1
            i -= 1
            j -= 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i-1][j-1]+1:
            ops.append({"op": "sub", "expected": expected[i - 1], "actual": actual[j - 1]})
            i -= 1
            j -= 1
        elif i > 0 and dp[i][j] == dp[i - 1][j] + 1:
            ops.append({"op": "del", "expected": expected[i - 1], "actual": None})
            i -= 1
        else:
            ops.append({"op": "ins", "expected": None, "actual": actual[j - 1]})
            j -= 1
    ops.reverse()
    accuracy = matches / m if m > 0 else 0.0
    return {"ops": ops, "matches": matches, "expected_count": m, "accuracy": accuracy}

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...), expected: Optional[str] = Form(None)):
    print(tokenize("i like pizza"))
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        result = sttModel.transcribe(tmp_path)
        segments = result.get("segments", [])
        words = []

        for seg in segments:
            seg_text = seg.get("text", "").strip()
            start = float(seg.get("start", 0.0))
            end = float(seg.get("end", 0.0))
            toks = tokenize(seg_text)
            if not toks:
                continue
            seg_dur = max(1e-6, end - start)
            per_word = seg_dur / len(toks)
            for idx, w in enumerate(toks):
                w_start = start + idx * per_word
                w_end = start + (idx + 1) * per_word
                words.append({
                    "text": w,
                    "start": round(w_start, 3),
                    "end": round(w_end, 3),
                    "confidence": None
                })

        full_text = result.get("text", "").strip()
        response = {
            "text": full_text,
            "normalized": " ".join(tokenize(full_text)),
            "segments": [
                {"text": seg.get("text", "").strip(), "start": seg.get("start"), "end": seg.get("end")}
                for seg in segments
            ],
            "words": words,
            "language": result.get("language"),
            "language_probability": result.get("language_probability"),
        }
        if expected:
            expected_tokens = tokenize(expected)
            actual_tokens = [w["text"] for w in words]
            alignment = alignSequences(expected_tokens, actual_tokens)
            response["pronunciation_analysis"] = {
                "expected": expected,
                "expected_tokens": expected_tokens,
                "actual_tokens": actual_tokens,
                "accuracy": round(alignment["accuracy"], 3),
                "matches": alignment["matches"],
                "expected_count": alignment["expected_count"],
                "ops": alignment["ops"]
            }

        return response
    except Exception as e:
        print(e)
        raise







