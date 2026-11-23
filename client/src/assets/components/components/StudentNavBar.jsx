import React from "react";

function StudentNavbar() {
  // Get logged-in student information
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const studentName =
    user.name || user.full_name || user.username || "Student User";

  const role = user.role || "Student";

  // Get first letter for avatar
  const avatarLetter = studentName.charAt(0).toUpperCase();

  return <header className="navbar"></header>;
}

export default StudentNavbar;
