import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
    {
        quizId: {
            type: String,
            ref: "quizzes",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Multiple Choice", "True/False", "Fill in the Blank"],
            default: "Multiple Choice",
            required: true,
        },
        points: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        question: {
            type: String,
            required: true,
        },
        // For Multiple Choice: array of choice objects
        choices: [
            {
                text: { type: String, required: true },
                isCorrect: { type: Boolean, default: false },
            },
        ],
        // For True/False: single boolean
        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
        },
        // For Fill in the Blank: array of possible correct answers
        possibleAnswers: [
            {
                text: { type: String },
                caseSensitive: { type: Boolean, default: false },
            },
        ],
    },
    { collection: "quizquestions", timestamps: true }
);

export default quizQuestionSchema;