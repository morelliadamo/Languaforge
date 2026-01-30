from fastapi import FastAPI, UploadFile, File
import whisper
import tempfile
import shutil

app = FastAPI()

sttModel = whisper.load_model("base")


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    result = sttModel.transcribe(tmp_path)

    return {
        "text": result["text"]
    }

@app.get("/")
def test():
    return "ASDASDASD"