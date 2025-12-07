import { model, quizQuestionModel, quizResultModel } from "./model.js";
import { v4 as uuidv4 } from 'uuid';

export async function getQuizzesForCourse(courseId) {
    return await model.find({ courseCode: courseId });
}
export async function createQuiz(quiz) {
    console.log("Creating quiz:", quiz);
    return await model.create(quiz);
}

export async function searchById(quizId) {
    return await model.findById(quizId);
}

export async function deleteQuiz(quizId) {
    return await model.deleteOne({ _id: quizId });
}

export async function publishOrUnpublishQuiz(quizId, quizStatus) {
    return await model.updateOne({ _id: quizId }, { status: quizStatus });
}

export async function updateQuizData(quizId, quizData) {
    return await model.updateOne({ _id: quizId }, { $set: quizData });
}

export async function getQuizQuestion(quizId) {
    return await quizQuestionModel.find({ quizId: quizId });
}


export async function updateQuizQuestion(questionId, quizId, quizQuestion, totalPoints) {
    try {
        const { _id, __v, ...questionDataToUpdate } = quizQuestion;
        const questionUpdatePromise = quizQuestionModel.updateOne(
            { _id: questionId },
            { $set: questionDataToUpdate }
        );
        const quizUpdatePromise = updateQuizData(quizId, totalPoints);

        const [questionUpdate, quizUpdate] = await Promise.all([
            questionUpdatePromise,
            quizUpdatePromise
        ]);

        console.log("Question Update:", questionUpdate);

        return {
            questionUpdate,
            quizUpdate,
            success: true,
            message: "Question and quiz total points updated successfully"
        };

    } catch (error) {
        console.error("Error updating quiz and question:", error);
        return {
            success: false,
            error: error.message,
            message: "Failed to update question and quiz total points"
        };
    }
}

export async function deleteQuizQuestion(questionId) {
    return await quizQuestionModel.deleteOne({ _id: questionId });
}

export async function createQuizQuestion(quizData) {
    const results = [];
    const quizQuestions = quizData.questions;
    console.log("Quiz Questions:", quizQuestions);
    for (const question of quizQuestions) {
        try {
            const saved = await quizQuestionModel.create(question);
            results.push(saved);
        } catch (err) {
            console.error(`Failed to save question: ${question.question}`, err);
            results.push({ error: err.message, question });
        }
    }
    return results;
}

export async function findQuizQuestions(quizId) {
    try {
        return await quizQuestionModel.find({ quizId });
    } catch (error) {
        console.error("Error finding quiz questions:", error.message);
        throw error;
    }
}

export async function findQuizQuestionById(questionId) {
    try {
        return await QuizQuestionModel.findById(questionId);
    } catch (error) {
        console.error("Error finding quiz question:", error.message);
        throw error;
    }
}

export async function saveQuizResult(quizResult) {
    try {
        if (!quizResult._id) {
            quizResult._id = uuidv4();
        }

        const quizData = await searchById(quizResult.quizId);
        const maxAttempts = quizData.multipleAttempts || 1;

        const existingResult = await quizResultModel.findOne({
            userId: quizResult.userId,
            quizId: quizResult.quizId
        });

        const isFinalAttempt = (quizResult.attemptNumber >= maxAttempts);
        const submittedStatus = isFinalAttempt;

        if (existingResult) {
            return await quizResultModel.findByIdAndUpdate(
                existingResult._id,
                {
                    ...quizResult,
                    _id: existingResult._id,
                    submittedAt: new Date(),
                    submitted: submittedStatus,
                    attemptNumber: existingResult.attemptNumber + 1
                },
                { new: true }
            );
        } else {
            return await quizResultModel.create({
                ...quizResult,
                _id: uuidv4(),
                submittedAt: new Date(),
                submitted: submittedStatus,
                attemptNumber: 1
            });
        }
    } catch (error) {
        console.error("Error saving quiz result:", error.message);
        throw error;
    }
}

export async function findQuizResultForUser(userID, quizID) {
    try {
        console.log("Finding quiz id:", quizID);
        console.log("Finding user id :", userID);
        return await quizResultModel.findOne({ userId: userID, quizId: quizID });
    } catch (error) {
        console.error("Error finding quiz result:", error.message);
        throw error;
    }
}

export async function cleanupDuplicateResults() {
    try {
        const allResults = await quizResultModel.find({});
        const groups = {};

        allResults.forEach(result => {
            const key = `${result.quizId}_${result.userId}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(result);
        });

        let removed = 0;
        for (const key in groups) {
            const results = groups[key];

            if (results.length > 1) {
                results.sort((a, b) => {
                    const aAnswers = Object.values(a.userAnswers).filter(ans => ans && ans !== "").length;
                    const bAnswers = Object.values(b.userAnswers).filter(ans => ans && ans !== "").length;
                    return bAnswers - aAnswers;
                });

                const toKeep = results[0];

                for (let i = 1; i < results.length; i++) {
                    await quizResultModel.findByIdAndDelete(results[i]._id);
                    removed++;
                }
            }
        }

        return { removed };
    } catch (error) {
        console.error("Error cleaning up duplicate results:", error.message);
        throw error;
    }
}