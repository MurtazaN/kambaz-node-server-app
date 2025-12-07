import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String },
        course: { type: String, ref: "CourseModel", required: true },
        availableFrom: { type: String },
        dueDate: { type: String },
        editorAvailableFrom: { type: Date },
        editorDueDate: { type: Date },
        points: { type: Number },
    },
    { collection: "assignments" }
);

export default assignmentSchema;