const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// CREATE Employee
router.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      const newEmployee = new Employee({
        ...req.body,
        photo: req.file ? `uploads/${req.file.filename}` : "",
      });

      await newEmployee.save();
      res.status(201).json(newEmployee);
    } catch (err) {
      res.status(500).json({ message: "Error creating employee" });
    }
  }
);

// GET All Employees
router.get("/", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// UPDATE Employee
router.put(
  "/:id",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      if (req.file) {
        updateData.photo = `uploads/${req.file.filename}`;
      }

      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(updatedEmployee);
    } catch (err) {
      res.status(500).json({ message: "Error updating employee" });
    }
  }
);

// DELETE Employee
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee" });
  }
});

module.exports = router;