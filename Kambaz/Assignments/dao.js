import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {
  async function findAssignmentsForCourse(courseId) {
    return await model.find({ course: courseId });
  }
  async function findAssignmentById(assignmentId) {
    return await model.findById(assignmentId);
  }
  async function createAssignment(courseId, assignment) {
    const newAssignment = { title: assignment.title ?? "Untitled", course: courseId };
    return await model.create(newAssignment);
  }
  async function updateAssignment(assignmentId, updates) {
    return await model.findByIdAndUpdate(
      assignmentId,
      { $set: updates },
      { new: true, runValidators: true }
    );
  }
  async function deleteAssignment(assignmentId) {
    return await model.deleteOne({ _id: assignmentId });
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
