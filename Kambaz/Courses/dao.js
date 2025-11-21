import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
    function findAllCourses() {
        return db.courses;
    }
    function findCoursesForEnrolledUser(userId) {
        const { courses, enrollments } = db;
        console.log("--- DAO: Find Courses For User ---");
        console.log("Target User ID:", userId);
        console.log("Total Enrollments:", enrollments.length);
        console.log("Total Courses:", courses.length);
        const enrolledCourses = courses.filter((course) =>
            enrollments.some(
                (enrollment) =>
                    enrollment.user === userId && enrollment.course === course._id
            )
        );
        console.log("Found Courses:", enrolledCourses.length);
        return enrolledCourses;
    }
    function createCourse(course) {
        const newCourse = { ...course, _id: uuidv4() };
        db.courses.push(newCourse);
        return newCourse;
    }
    function deleteCourse(courseId) {
        const { courses, enrollments } = db;
        const index = courses.findIndex((c) => c._id === courseId);
        if (index !== -1) {
            courses.splice(index, 1);
        }
        for (let i = enrollments.length - 1; i >= 0; i--) {
            if (enrollments[i].course === courseId) {
                enrollments.splice(i, 1);
            }
        }
    }
    function updateCourse(courseId, courseUpdates) {
        const { courses } = db;
        const course = courses.find((course) => course._id === courseId);
        Object.assign(course, courseUpdates);
        return course;
    }
    return {
        findAllCourses,
        findCoursesForEnrolledUser,
        createCourse,
        deleteCourse,
        updateCourse,
    };
}