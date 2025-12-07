import * as quizDao from "./dao.js";

export default function QuizzesRoutes(app) {

    const getQuizzesForCourse = async (req, res) => {
        const { courseId } = req.params;
        const quizzes = await quizDao.getQuizzesForCourse(courseId);
        res.send(quizzes);
    };

    const createQuiz = async (req, res) => {
        const quizzes = await quizDao.createQuiz(req.body);
        res.send(quizzes);
    };

    const deleteQuiz = async (req, res) => {
        const { quizId } = req.params;
        const status = await quizDao.deleteQuiz(quizId);
        res.send(status);
    };

    const updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        const status = await quizDao.updateQuizData(quizId, req.body);
        res.send(status);
    };

    const publishOrUnpublishQuiz = async (req, res) => {
        const { quizId } = req.params;
        const quizStatus = req.body.status;
        const status = await quizDao.publishOrUnpublishQuiz(quizId, quizStatus);
        res.send(status);
    };

    const getQuizById = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await quizDao.searchById(quizId);
        res.send(quiz);
    };

    const getQuizQuestions = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await quizDao.getQuizQuestion(quizId);
        res.send(quiz);
    };

    const createQuizQuestion = async (req, res) => {
        const quizQuestions = req.body;
        const quiz = await quizDao.createQuizQuestion(quizQuestions);
        res.send(quiz);
    };

    const updateQuizQuestion = async (req, res) => {
        const { questionId, quizId } = req.params;
        const quizQuestion = req.body.quizData;
        const totalPoints = req.body.points;
        console.log(req.body);
        console.log("quizQuestion", quizQuestion);
        const status = await quizDao.updateQuizQuestion(questionId, quizId, quizQuestion, totalPoints);
        res.send(status);
    };

    const deleteQuizQuestion = async (req, res) => {
        const { questionId } = req.params;
        const status = await quizDao.deleteQuizQuestion(questionId);
        res.send(status);
    };

    const findQuizQuestions = async (req, res) => {
        try {
            const { quizId } = req.params;
            const questions = await quizDao.findQuizQuestions(quizId);
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const findQuizQuestionById = async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await quizDao.findQuizQuestionById(questionId);
            if (!question) {
                return res.status(404).json({ error: "Question not found" });
            }
            res.json(question);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const saveQuizResult = async (req, res) => {
        try {
            const quizResult = req.body;
            const savedResult = await quizDao.saveQuizResult(quizResult);
            res.status(201).json(savedResult);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const findQuizResultForUser = async (req, res) => {
        console.log("quizId", req.params.quizId);
        console.log("userId", req.params.userId);
        try {
            const { quizId, userId } = req.params;
            console.log("quizId in routes", quizId);
            console.log("userId in routes", userId);
            const result = await quizDao.findQuizResultForUser(userId, quizId);
            console.log("result", result);
            if (!result) {
                return res.status(404).json({ error: "Result not found" });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const cleanupDuplicateResults = async (req, res) => {
        try {
            const result = await quizDao.cleanupDuplicateResults();
            res.json({ message: `Cleanup complete. Removed ${result.removed} duplicate results.` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    app.get("/api/courses/:courseId/quizzes", getQuizzesForCourse);
    app.post("/api/courses/:courseId/quizzes/create", createQuiz);
    app.delete("/api/quizzes/:quizId/delete", deleteQuiz);
    app.put("/api/quizzes/:quizId/update", updateQuiz);
    app.put("/api/quizzes/:quizId/status", publishOrUnpublishQuiz);
    app.get("/api/quizzes/:quizId", getQuizById);
    app.get("/api/quizzes/:quizId/questions", getQuizQuestions);
    app.post("/api/quizzes/:quizId/questions/create", createQuizQuestion);
    app.put("/api/quizzes/:quizId/questions/:questionId/update", updateQuizQuestion);
    app.delete("/api/quizzes/:quizId/questions/:questionId/delete", deleteQuizQuestion);
    app.get("/api/quizzes/:quizId/questions", findQuizQuestions);
    app.get("/api/quiz-questions/:questionId", findQuizQuestionById);
    app.post("/api/quiz-results", saveQuizResult);
    app.get("/api/quiz-results/:quizId/:userId", findQuizResultForUser);
    app.post("/api/admin/cleanup-quiz-results", cleanupDuplicateResults);
}