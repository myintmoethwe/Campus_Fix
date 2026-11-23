import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./assets/components/pages/Login";
import SubmitIssue from "./assets/components/pages/SubmitIssue";
import StudentDashboard from "./assets/components/pages/StudentDashboard";
import Register from "./assets/components/pages/Register";
import StudentIssue from "./assets/components/pages/StudentIssue";
import AdminDashboard from "./assets/components/pages/admin/AdminDashboard";
import ManageIssue from "./assets/components/pages/admin/AdminIssues";

function App() {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/issues" element={<ManageIssue />} />

      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/submit-issue" element={<SubmitIssue />} />
      <Route path="/student/my-issue" element={<StudentIssue />} />
      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
