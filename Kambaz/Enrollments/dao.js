import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function EnrollmentsDao(db) {

    function enrollUserInCourse(userId, courseId) {
        // const { enrollments } = db;
        // enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
        return model.create({
            user: userId,
            course: courseId,
            _id: `${userId}-${courseId}`,
        });

    }
    function unenrollUserFromCourse(userId, courseId) {
        // const { enrollments } = db;
        // const index = enrollments.findIndex(
        //     (e) => e.user === userId && e.course === courseId
        // );
        // if (index !== -1) {
        //     enrollments.splice(index, 1);
        // }
        return model.deleteOne({ user: userId, course: courseId });
        //   return model.deleteOne({ user, course });

    }
    function findMyEnrollments(userId) {
        return model.find({ user: userId });
        // return db.enrollments.filter((e) => e.user === userId);
    }
    function findAllEnrollments() {
        return model.find();
        // return db.enrollments;
    }

    async function findCoursesForUser(userId) {
        const enrollments = await model.find({ user: userId }).populate("course");
        return enrollments.map((enrollment) => enrollment.course);
    }
    async function findUsersForCourse(courseId) {
        const enrollments = await model.find({ course: courseId }).populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    }

    function unenrollAllUsersFromCourse(courseId) {
        return model.deleteMany({ course: courseId });
    }


    return {
        enrollUserInCourse, unenrollUserFromCourse, unenrollAllUsersFromCourse,
        findCoursesForUser, findUsersForCourse, findMyEnrollments, findAllEnrollments
    };
}
