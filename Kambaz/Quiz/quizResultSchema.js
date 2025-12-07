import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
    _id: String,
    quizId: String,
    userId: String,
    userAnswers: Object,
    score: Number,
    maxScore: Number,
    percentage: Number,
    submitted: {
        type: Boolean,
        default: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    attemptNumber: {
        type: Number,
        default: 1
    },
},
    { collection: "quizresults" });

export default quizResultSchema;

