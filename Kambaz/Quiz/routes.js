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

    const publishQuiz = async (req, res) => {
        const { quizId } = req.params;
        const status = await quizDao.publishOrUnpublishQuiz(quizId, true);
        res.send(status);
    };

    const unpublishQuiz = async (req, res) => {
        const { quizId } = req.params;
        const status = await quizDao.publishOrUnpublishQuiz(quizId, false);
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
        try {
            const { quizId, userId } = req.params;
            const result = await quizDao.findQuizResultForUser(userId, quizId);
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

    // Quiz routes
    app.get("/api/quizzes/course/:courseId", getQuizzesForCourse);
    app.post("/api/quizzes/course/:courseId", createQuiz);
    app.get("/api/quizzes/:quizId", getQuizById);
    app.put("/api/quizzes/:quizId", updateQuiz);
    app.delete("/api/quizzes/:quizId", deleteQuiz);
    app.post("/api/quizzes/:quizId/publish", publishQuiz);
    app.post("/api/quizzes/:quizId/unpublish", unpublishQuiz);

    // Question routes
    app.get("/api/quizzes/:quizId/questions", findQuizQuestions);
    app.post("/api/quizzes/:quizId/questions", createQuizQuestion);
    app.get("/api/questions/:questionId", findQuizQuestionById);
    app.put("/api/questions/:questionId", updateQuizQuestion);
    app.delete("/api/questions/:questionId", deleteQuizQuestion);

    // Quiz results/attempts routes
    app.post("/api/quiz-results", saveQuizResult);
    app.get("/api/quiz-results/:quizId/:userId", findQuizResultForUser);
    app.post("/api/admin/cleanup-quiz-results", cleanupDuplicateResults);

    // Attempts API (alternate endpoints for quiz results)
    app.get("/api/attempts/user/:userId/quiz/:quizId", async (req, res) => {
        try {
            const { userId, quizId } = req.params;
            const result = await quizDao.findQuizResultForUser(userId, quizId);
            if (!result) {
                return res.status(404).json({ error: "No attempts found" });
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.post("/api/attempts/quiz/:quizId/start", async (req, res) => {
        try {
            const { quizId } = req.params;
            const userId = req.session?.currentUser?._id;
            if (!userId) {
                return res.status(401).json({ error: "Not authenticated" });
            }
            // Return empty attempt for now - can be enhanced later
            res.json({ quizId, userId, startedAt: new Date().toISOString() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.post("/api/attempts/:attemptId/submit", async (req, res) => {
        try {
            const { attemptId } = req.params;
            const { answers } = req.body;
            // For now, just acknowledge the submission
            res.json({ attemptId, answers, submittedAt: new Date().toISOString() });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    app.get("/api/attempts/:attemptId", async (req, res) => {
        try {
            const { attemptId } = req.params;
            // Return attempt details
            res.json({ _id: attemptId, status: "completed" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}