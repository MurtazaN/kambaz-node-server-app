import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            auto: true,
        },
        quizId: {
            type: String,
            ref: "quizzes",
            required: true,
        },
        quizType: {
            type: String,
            enum: ["Multiple Choice Question", "Fill in the Blank", "True or False"],
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        point: {
            type: Number,
            required: true,
            min: 0,
        },
        quizLevel: {
            type: String,
            enum: ["Easy Level", "Medium Level", "Hard Level"],
        },
    },
    { collection: "quizquestions" }
);

export default quizQuestionSchema;