import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findAssignmentsForCourse(courseId));
  };

  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const a = dao.findAssignmentById(assignmentId);
    if (!a) return res.sendStatus(404);
    res.json(a);
  };

  const createAssignment = (req, res) => {
    const { courseId } = req.params;
    const newA = dao.createAssignment(courseId, req.body || {});
    res.json(newA);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body || {});
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  };

  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    res.json(status);
  };

  app.get(   "/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get(   "/api/assignments/:assignmentId",     findAssignmentById);
  app.post(  "/api/courses/:courseId/assignments", createAssignment);
  app.put(   "/api/assignments/:assignmentId",     updateAssignment);
  app.delete("/api/assignments/:assignmentId",     deleteAssignment);
}
