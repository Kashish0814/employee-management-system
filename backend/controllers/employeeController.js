const Employee = require("../models/Employee");

exports.createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      dob,
      email,
      phone,
      department,
      designation,
      gender,
    } = req.body;

    // Backend validations
    if (
      !fullName ||
      !dob ||
      !email ||
      !phone ||
      !department ||
      !designation ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    const photo = req.file ? req.file.path : "";

    const employee = new Employee({
      fullName,
      dob,
      email,
      phone,
      department,
      designation,
      gender,
      photo,
    });

    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const { search, department, designation, gender } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    if (department) query.department = department;
    if (designation) query.designation = designation;
    if (gender) query.gender = gender;

    const employees = await Employee.find(query);

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};