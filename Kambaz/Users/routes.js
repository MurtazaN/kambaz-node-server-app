import UsersDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app, db) {
    const dao = UsersDao(db);
    const enrollmentsDao = EnrollmentsDao(db);
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = (req, res) => { };
    const findUserById = (req, res) => { };
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signin = (req, res) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);

        if (currentUser) {
            req.session["currentUser"] = currentUser;
            req.session.save((err) => {
                if (err) {
                    res.status(500).json({ message: "Session error" });
                } else {
                    res.json(currentUser);
                }
            });
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    const enrollUserInCourse = (req, res) => {
        const { userId, courseId } = req.params;
        enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json({ status: "ok" });
    };
    const unenrollUserFromCourse = (req, res) => {
        const { userId, courseId } = req.params;
        enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.json({ status: "ok" });
    };
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
    app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}
