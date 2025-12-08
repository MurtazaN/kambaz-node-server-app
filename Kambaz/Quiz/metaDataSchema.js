import mongoose from "mongoose";

const MetaDataschema = new mongoose.Schema(
    {
        _id: String,
        title: { type: String, required: true },
        description: { type: String, default: "" },
        availableDate: Date,
        dueDate: Date,
        untilDate: Date,
        courseCode: { type: String, ref: "CourseModel", required: true },
        quizType: {
            type: String,
            enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
            default: "Graded Quiz",
        },
        assignmentGroup: {
            type: String,
            enum: ["Quizzes", "Exams", "Assignments", "Project"],
            default: "Quizzes",
        },
        shuffleAnswers: { type: Boolean, default: true },
        timeLimit: { type: Number, min: 0, default: 20 },
        multipleAttempts: { type: Boolean, default: false },
        howManyAttempts: { type: Number, min: 1, default: 1 },
        showCorrectAnswers: { type: String, default: "" },
        accessCode: { type: String, default: "" },
        oneQuestionAtATime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },
        totalPoints: { type: Number, min: 0, default: 0 },
        published: { type: Boolean, default: false },
    },
    { collection: "quizzes", timestamps: true }
);

export default MetaDataschema;