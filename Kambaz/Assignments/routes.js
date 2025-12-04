import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    res.json(await dao.findAssignmentsForCourse(courseId));
  };

  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const a = await dao.findAssignmentById(assignmentId);
    if (!a) return res.sendStatus(404);
    res.json(a);
  };

  const createAssignment = async (req, res) => {
    const { courseId } = req.params;
    const newA = await dao.createAssignment(courseId, req.body || {});
    res.json(newA);
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const updated = await dao.updateAssignment(assignmentId, req.body || {});
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.json(status);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
