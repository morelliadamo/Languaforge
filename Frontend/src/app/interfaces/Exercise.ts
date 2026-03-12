// note: Soma needs to be skinned alive. Wtf is this? {
//     "id": 213,
//     "lessonId": 64,
//     "exerciseContent": {
//         "answers": null,
//         "description": "Which type-conversion function is missing?",
//         "correctAnswer": "int"
//     },
//     "exerciseType": "fill_in",
//     "isDeleted": false,
//     "deletedAt": null,
//     "createdAt": "2026-02-25T10:00:00.000Z"
// }

export interface MatchPair {
  left: string;
  right: string;
}

export interface Exercise {
  id: number;
  lessonId: number;
  exerciseContent: {
    answers?: string[];
    description: string;
    correctAnswer?: string;
    sentence?: string;
    pairs?: MatchPair[];
  };
  exerciseType: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
}
