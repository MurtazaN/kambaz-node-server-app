import mongoose from "mongoose";

const MetaDataschema = new mongoose.Schema(
    {
        _id: String,//
        title: String,//
        description: String,//
        availableDate: Date,
        dueDate: Date,
        untilDate: Date,
        courseCode: { type: String, ref: "CourseModel" },//
        quizType: {
            type: String,
            enum: ["Practice Quiz", "Ungraded Survey", "Graded Quiz", "Graded Survey"],
            default: "Graded Quiz",
        }, //
        assignmentGroup: String, //
        shuffleAnswers: { type: Boolean, default: false }, //
        timeLimit: { type: Number, min: 0 },
        multipleAttempts: { type: Number },
        showCorrectAnswers: String,
        accessCode: { type: String, default: "" }, //
        oneQuestionAtATime: { type: Boolean, default: false }, //
        webcamRequired: { type: Boolean, default: false }, //
        lockQuestionsAfterAnswering: { type: Boolean, default: false }, //
        totalPoints: { type: Number, min: 0 },
        status: {
            type: String,
            enum: ["publish", "unpublish"],
            default: "unpublish",
        },//
    },
    { collection: "quizzes" }
);



export default MetaDataschema;