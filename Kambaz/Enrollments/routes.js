import EnrollmentsDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);
    const coursesDao = CoursesDao(db);

    const enrollMe = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        const { courseId } = req.params;
        dao.enrollUserInCourse(currentUser._id, courseId);
        res.json({ status: "ok" });
    };

    const unenrollMe = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        const { courseId } = req.params;
        dao.unenrollUserFromCourse(currentUser._id, courseId);
        res.json({ status: "ok" });
    };

    const findMyCourses = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) return res.sendStatus(401);
        const courses = coursesDao.findCoursesForEnrolledUser(currentUser._id);
        res.json(courses);
    };

    const findAllEnrollments = (req, res) => {
        const enrollments = dao.findAllEnrollments();
        res.json(enrollments);
    };

    const findCoursesForEnrolledUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        // const courses = await dao.findCoursesForEnrolledUser(userId);
        const courses = await enrollmentsDao.findCoursesForUser(userId);
        res.json(courses);
    };

    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

    app.post("/api/users/current/enrollments/:courseId", enrollMe);
    app.delete("/api/users/current/enrollments/:courseId", unenrollMe);
    app.get("/api/users/current/courses", findMyCourses);
    app.get("/api/enrollments", findAllEnrollments);
}
