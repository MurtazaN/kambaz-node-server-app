import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter((a) => a.course === courseId);
  }
  function findAssignmentById(assignmentId) {
    return db.assignments.find((a) => a._id === assignmentId);
  }
  function createAssignment(courseId, assignment) {
    const newAssignment = { _id: uuidv4(), title: assignment.title ?? "Untitled", course: courseId };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }
  function updateAssignment(assignmentId, updates) {
    const a = db.assignments.find((x) => x._id === assignmentId);
    if (!a) return null;
    Object.assign(a, { title: updates.title ?? a.title }); // only fields we persist
    return a;
  }
  function deleteAssignment(assignmentId) {
    const { assignments } = db;
    db.assignments = assignments.filter((a) => a._id !== assignmentId);
    return { status: "ok" };
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
