
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    phone: ""
  });

  async function fetchStudents() {
    try {
      setError("");
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Unable to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function clearForm() {
    setForm({ name: "", email: "", course: "", phone: "" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    const namePattern = /^[A-Za-z ]+$/;

if (!namePattern.test(form.name.trim())) {
  alert("Name should contain only letters and spaces.");
  return;
}
    e.preventDefault();
    if (!form.course.trim()) {
  alert("Please enter a valid course name.");
  return;
}
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(form.email)) {
  alert("Please enter a valid email address.");
  return;
}

if (!phonePattern.test(form.phone)) {
  alert("Please enter a valid 10-digit phone number.");
  return;
}

    try {
      const response = await fetch("/api/students", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...form } : form
        )
      });

      const data = await response.json();

if (!response.ok) {
  if (data.error?.includes("Unique constraint")) {
    throw new Error("This email address is already registered!");
  }

  throw new Error(data.message || "Operation failed");
}

      alert(editingId
        ? "Student updated successfully!"
        : "Student added successfully!"
      );

      clearForm();
      await fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleEdit(student) {
    setEditingId(student.id);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      phone: student.phone
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete");

      alert("Student deleted successfully!");
      await fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  }

  const uniqueCourses = new Set(
  students.map(student => student.course)
).size;
  const filteredStudents = students.filter(student =>
  student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  student.course.toLowerCase().includes(searchTerm.toLowerCase())
);
const sortedStudents = [...filteredStudents].sort((a, b) => {
  if (sortOrder === "az") {
    return a.name.localeCompare(b.name);
  }

  if (sortOrder === "za") {
    return b.name.localeCompare(a.name);
  }

  if (sortOrder === "oldest") {
    return new Date(a.createdAt) - new Date(b.createdAt);
  }

  return new Date(b.createdAt) - new Date(a.createdAt);
});

  return (
    <div className="dashboard-layout" style={styles.layout}>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>SMS.</h2>
        <p style={styles.sideLabel}>MAIN MENU</p>

        <div style={styles.activeMenu}>▦ &nbsp; Dashboard</div>
        <div style={styles.menuItem}>♙ &nbsp; Students</div>
        <div style={styles.menuItem}>▤ &nbsp; Courses</div>
        </aside>

        <aside className="dashboard-sidebar" style={styles.sidebar}>
          <p style={styles.sideLabel}>MANAGEMENT</p>
          <div style={styles.menuItem}>⚙ &nbsp; Settings</div>
          <p style={styles.admin}>Administrator</p>
          <small style={{ color: "#94a3b8" }}>Student Management System</small>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={styles.main}>

        <header style={styles.header}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.subtitle}>
              Welcome back! Manage your student records here.
            </p>
          </div>
          <div style={styles.profile}>Admin</div>
        </header>

        {/* Summary Cards */}
        <section style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>♙</div>
            <p style={styles.cardLabel}>Total Students</p>
            <h2 style={styles.cardNumber}>{students.length}</h2>
            <small style={styles.cardNote}>Registered students</small>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>▤</div>
            <p style={styles.cardLabel}>Total Courses</p>
            <h2 style={styles.cardNumber}>{uniqueCourses}</h2>
            <small style={styles.cardNote}>Available courses</small>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>▣</div>
            <p style={styles.cardLabel}>Student Records</p>
            <h2 style={styles.cardNumber}>{students.length}</h2>
            <small style={styles.cardNote}>Saved in database</small>
          </div>
        </section>

        {/* Add Student Form */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {editingId ? "Edit Student Details" : "Add New Student"}
          </h2>

          <p style={styles.subtitle}>
            Enter the student information below.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              name="name"
              placeholder="Student Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              name="course"
              placeholder="Course"
              value={form.course}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <div style={styles.formActions}>
              <button type="submit" style={styles.primaryButton}>
                {editingId ? "Update Student" : "+ Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Student Table */}
        <section style={{ ...styles.section, overflowX: "auto" }}>
          <h2 style={styles.sectionTitle}>Student Details</h2>
          <select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
  style={{
    ...styles.input,
    marginTop: "10px",
    marginBottom: "15px",
    maxWidth: "250px"
  }}
>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
  <option value="az">Name (A-Z)</option>
  <option value="za">Name (Z-A)</option>
</select>
          <p style={styles.subtitle}>View and manage registered students.</p>
<input
  type="text"
  placeholder="Search by name, email or course..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    ...styles.input,
    marginTop: "15px",
    marginBottom: "15px",
    maxWidth: "400px"
  }}
/>
          {loading ? (
            <p>Loading students...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : students.length === 0 ? (
            <p>No students found. Add your first student!</p>
            ): (
            <div className="table-wrapper">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedStudents.map(student => (
                  <tr key={student.id}>
                    <td style={styles.td}>{student.id}</td>
                    <td style={styles.td}>
                      <strong>{student.name}</strong>
                    </td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>{student.course}</td>
                    <td style={styles.td}>{student.phone}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEdit(student)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(student.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          Student Management System © 2026
        </footer>
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f7fc",
    fontFamily: "Arial, sans-serif",
    color: "#1e293b"
  },

  sidebar: {
    width: "230px",
    background: "#172554",
    color: "white",
    padding: "28px 18px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0
  },

  logo: {
    fontSize: "30px",
    margin: "0 0 45px",
    color: "#93c5fd"
  },

  sideLabel: {
    color: "#94a3b8",
    fontSize: "11px",
    letterSpacing: "1px",
    marginBottom: "18px"
  },

  activeMenu: {
    background: "#2563eb",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "12px"
  },

  menuItem: {
    padding: "14px",
    color: "#cbd5e1",
    marginBottom: "8px"
  },

  sidebarBottom: {
    marginTop: "auto",
    paddingTop: "30px"
  },

  admin: {
    marginTop: "30px",
    fontWeight: "bold"
  },

  main: {
    flex: 1,
    padding: "30px",
    minWidth: 0
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },

  heading: {
    fontSize: "28px",
    margin: "0 0 8px"
  },

  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    marginTop: "6px"
  },

  profile: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "12px 20px",
    borderRadius: "25px",
    fontWeight: "bold"
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "20px",
    marginBottom: "28px"
  },

  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.04)"
  },

  cardIcon: {
    background: "#dbeafe",
    color: "#2563eb",
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "grid",
    placeItems: "center",
    fontSize: "21px"
  },

  cardLabel: {
    color: "#64748b",
    marginBottom: "8px",
    fontSize: "14px"
  },

  cardNumber: {
    fontSize: "30px",
    margin: "5px 0"
  },

  cardNote: {
    color: "#94a3b8"
  },

  section: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.04)"
  },

  sectionTitle: {
    fontSize: "19px",
    margin: "0 0 8px"
  },

  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "22px"
  },

  input: {
    padding: "13px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    width: "100%",
    minWidth: 0
  },

  formActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap"
  },

  primaryButton: {
    padding: "13px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  cancelButton: {
    padding: "13px 20px",
    background: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    marginTop: "20px",
    minWidth: "750px"
  },

  th: {
    padding: "15px",
    background: "#eff6ff",
    color: "#1e40af",
    fontSize: "13px",
    borderBottom: "1px solid #dbeafe"
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "13px"
  },

  editButton: {
    padding: "8px 12px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "7px"
  },

  deleteButton: {
    padding: "8px 12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "12px",
    padding: "15px"
  }
};
