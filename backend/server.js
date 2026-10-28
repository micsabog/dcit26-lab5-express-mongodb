require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware to read JSON request bodies
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Records API is running",
  });
});

// Validate MongoDB document IDs
function isValidId(id) {
  return mongoose.isObjectIdOrHexString(id);
}

// GET all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve students",
    });
  }
});

// GET one student by ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student",
    });
  }
});

// POST create a student
app.post("/api/students", async (req, res) => {
  try {
    const { fullName, course, yearLevel, section } = req.body;

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof course !== "string" ||
      !course.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name and course are required",
      });
    }

    if (
      yearLevel === undefined ||
      yearLevel === null ||
      yearLevel === "" ||
      (typeof yearLevel !== "number" &&
        typeof yearLevel !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Year level must be a number from 1 to 4",
      });
    }

    const parsedYearLevel = Number(yearLevel);

    if (
      !Number.isInteger(parsedYearLevel) ||
      parsedYearLevel < 1 ||
      parsedYearLevel > 4
    ) {
      return res.status(400).json({
        success: false,
        message: "Year level must be a whole number from 1 to 4",
      });
    }

    if (
      section !== undefined &&
      typeof section !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Section must be a string",
      });
    }

    const student = await Student.create({
      fullName,
      course,
      yearLevel: parsedYearLevel,
      ...(section !== undefined ? { section } : {}),
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    if (error.name === "ValidationError" ||
        error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student data",
      });
    }

    console.error("Error creating student:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create student",
    });
  }
});

// PUT update a student
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, course, yearLevel, section } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const updates = {};

    if (fullName !== undefined) {
      if (
        typeof fullName !== "string" ||
        !fullName.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Full name must be a non-empty string",
        });
      }

      updates.fullName = fullName;
    }

    if (course !== undefined) {
      if (
        typeof course !== "string" ||
        !course.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Course must be a non-empty string",
        });
      }

      updates.course = course;
    }

    if (yearLevel !== undefined) {
      if (
        yearLevel === null ||
        yearLevel === "" ||
        (typeof yearLevel !== "number" &&
          typeof yearLevel !== "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Year level must be a number from 1 to 4",
        });
      }

      const parsedYearLevel = Number(yearLevel);

      if (
        !Number.isInteger(parsedYearLevel) ||
        parsedYearLevel < 1 ||
        parsedYearLevel > 4
      ) {
        return res.status(400).json({
          success: false,
          message: "Year level must be a whole number from 1 to 4",
        });
      }

      updates.yearLevel = parsedYearLevel;
    }

    if (section !== undefined) {
      if (typeof section !== "string") {
        return res.status(400).json({
          success: false,
          message: "Section must be a string",
        });
      }

      updates.section = section;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update",
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
        strict: "throw",
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.name === "StrictModeError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student data",
      });
    }

    console.error("Error updating student:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
});

// DELETE a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
});

// Handle malformed JSON request bodies
app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON request body",
    });
  }

  return next(error);
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();