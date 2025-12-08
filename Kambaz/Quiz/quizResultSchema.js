import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
    {
        _id: String,
        quizId: {
            type: String,
            ref: "quizzes",
            required: true,
        },
        userId: {
            type: String,
            ref: "users",
            required: true,
        },
        attemptNumber: {
            type: Number,
            default: 1,
            min: 1,
        },
        answers: [
            {
                questionId: { type: String, required: true },
                answer: { type: mongoose.Schema.Types.Mixed },
                isCorrect: { type: Boolean },
                pointsEarned: { type: Number, default: 0 },
            },
        ],
        score: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalPoints: {
            type: Number,
            required: true,
        },
        percentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        submitted: {
            type: Boolean,
            default: false,
        },
        submittedAt: Date,
        startedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "quizresults", timestamps: true }
);

export default quizResultSchema;

