import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterDesig, setFilterDesig] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const [photo, setPhoto] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    gender: "",
  });

  useEffect(() => {
    if (!token) navigate("/");
    else fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEmployees(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return alert("Invalid email format");

    if (!/^\d{10}$/.test(formData.phone))
      return alert("Phone must be 10 digits");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) =>
        data.append(key, formData[key])
      );
      if (photo) data.append("photo", photo);

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/employees/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Employee updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/employees",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Employee added successfully!");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        fullName: "",
        dob: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        gender: "",
      });
      fetchEmployees();
    } catch (err) {
      alert("Error saving employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    await axios.delete(`http://localhost:5000/api/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Employee deleted");
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({
      fullName: emp.fullName,
      dob: emp.dob.split("T")[0],
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      gender: emp.gender,
    });
    setShowModal(true);
  };

  const filteredEmployees = employees.filter((emp) => {
    return (
      (emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())) &&
      (filterDept === "" || emp.department === filterDept) &&
      (filterDesig === "" || emp.designation === filterDesig) &&
      (filterGender === "" || emp.gender === filterGender)
    );
  });

  return (
    <div style={{ padding: "30px", background: "#f4f6ff", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Employee Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{ background: "#dc3545", color: "#fff", padding: "8px 16px" }}
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div style={{ margin: "20px 0", display: "flex", gap: "10px" }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">Department</option>
          <option>HR</option>
          <option>IT</option>
          <option>Finance</option>
          <option>Marketing</option>
        </select>

        <select onChange={(e) => setFilterDesig(e.target.value)}>
          <option value="">Designation</option>
          <option>Manager</option>
          <option>Developer</option>
          <option>Analyst</option>
          <option>Executive</option>
        </select>

        <select onChange={(e) => setFilterGender(e.target.value)}>
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              fullName: "",
              dob: "",
              email: "",
              phone: "",
              department: "",
              designation: "",
              gender: "",
            });
            setShowModal(true);
          }}
          style={{ background: "#4CAF50", color: "#fff" }}
        >
          Create Employee
        </button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ width: "100%", background: "#fff" }}>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Dept</th>
            <th>Desig</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp._id}>
              <td>
                {emp.photo && (
                  <img
                    src={`http://localhost:5000/${emp.photo}`}
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%" }}
                    alt=""
                  />
                )}
              </td>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>{emp.gender}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  style={{ background: "red", color: "#fff", marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: "30px", width: "400px" }}>
            <h3>{editingId ? "Edit Employee" : "Create Employee"}</h3>

            <form onSubmit={handleAddOrUpdate} style={{ display: "grid", gap: "10px" }}>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required />
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              <input name="email" value={formData.email} onChange={handleChange} required />
              <input name="phone" value={formData.phone} onChange={handleChange} required />

              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Department</option>
                <option>HR</option>
                <option>IT</option>
                <option>Finance</option>
                <option>Marketing</option>
              </select>

              <select name="designation" value={formData.designation} onChange={handleChange} required>
                <option value="">Designation</option>
                <option>Manager</option>
                <option>Developer</option>
                <option>Analyst</option>
                <option>Executive</option>
              </select>

              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

              <button type="submit" style={{ background: "#4CAF50", color: "#fff" }}>
                {editingId ? "Update" : "Submit"}
              </button>

              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;