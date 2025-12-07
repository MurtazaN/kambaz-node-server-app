import mongoose from "mongoose";
import MetaDataschema from "./metaDataSchema.js";
import quizQuestionSchema from "./quizQuestionSchema.js";
import quizResultSchema from "./quizResultSchema.js";

const model = mongoose.model("MetaDataschema", MetaDataschema);
const quizQuestionModel = mongoose.model("QuizQuestion", quizQuestionSchema);
const quizResultModel = mongoose.model("QuizResult", quizResultSchema);
export { model, quizQuestionModel, quizResultModel };
