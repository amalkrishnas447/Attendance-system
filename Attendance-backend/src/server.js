const express = require("express");
const cors = require("cors");
const prisma = require("./prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = "attendance_secret_key";

const app = express();

app.use(express.json());
app.use(cors());


// =========================
// AUTHENTICATION MIDDLEWARE
// =========================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, JWT_SECRET);

    req.user = user;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
}


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.send("Server Running");
});


// =========================
// STUDENTS
// =========================

// ADD STUDENT
app.post("/students", authenticateToken, async (req, res) => {
  const {
    name,
    email,
    rollNumber,
    course,
    batch,
    joinDate,
  } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        name,
        email,
        rollNumber,
        course,
        batch,
        joinDate: joinDate
          ? new Date(joinDate)
          : null,
      },
    });

    res.json(student);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create student",
    });
  }
});


// GET ALL STUDENTS
app.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany();

    res.json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
});


// UPDATE STUDENT
app.put("/students/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const {
    name,
    email,
    rollNumber,
    course,
    batch,
    joinDate,
  } = req.body;

  try {
    const student = await prisma.student.update({
      where: {
        id,
      },

      data: {
        name,
        email,
        rollNumber,
        course,
        batch,
        joinDate: joinDate
          ? joinDate
          : null,
      },
    });

    res.json(student);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update student",
    });
  }
});


// DELETE STUDENT
app.delete(
  "/students/:id",
  authenticateToken,
  async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      // Delete attendance records first
      await prisma.attendance.deleteMany({
        where: {
          studentId: id,
        },
      });

      // Delete result records
      await prisma.result.deleteMany({
        where: {
          studentId: id,
        },
      });

      // Then delete student
      await prisma.student.delete({
        where: {
          id,
        },
      });

      res.json({
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to delete student",
      });
    }
  }
);


// =========================
// ATTENDANCE
// =========================

// MARK ATTENDANCE
app.post(
  "/attendance",
  authenticateToken,
  async (req, res) => {
    try {
      const { studentId, status } = req.body;

      // Check if attendance already exists for today
      const today = new Date();

      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const existingAttendance =
        await prisma.attendance.findFirst({
          where: {
            studentId: Number(studentId),
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

      // If already marked
      if (existingAttendance) {
        return res.status(400).json({
          message: "Attendance already marked for today",
        });
      }

      // Create attendance
      const attendance =
        await prisma.attendance.create({
          data: {
            studentId: Number(studentId),
            status: status,
          },
        });

      res.json(attendance);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to mark attendance",
      });
    }
  }
);


// =========================
// REPORTS
// =========================

app.get("/reports", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        attendances: true,
      },
    });

    const reports = students.map((student) => {
      const totalClasses =
        student.attendances.length;

      const presentClasses =
        student.attendances.filter(
          (a) => a.status === "Present"
        ).length;

      const percentage =
        totalClasses === 0
          ? 0
          : (
              (presentClasses / totalClasses) *
              100
            ).toFixed(2);

      return {
        id: student.id,
        name: student.name,
        totalClasses,
        presentClasses,
        percentage,
      };
    });

    res.json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to generate reports",
    });
  }
});


// =========================
// DASHBOARD
// =========================

app.get("/dashboard", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        attendances: true,
      },
    });

    const totalStudents = students.length;

    let presentToday = 0;
    let absentToday = 0;

    const today = new Date();

    for (const student of students) {
      for (const attendance of student.attendances) {
        const attendanceDate = new Date(
          attendance.date
        );

        const sameDay =
          attendanceDate.getDate() === today.getDate() &&
          attendanceDate.getMonth() === today.getMonth() &&
          attendanceDate.getFullYear() === today.getFullYear();

        if (sameDay) {
          if (attendance.status === "Present") {
            presentToday++;
          }

          if (attendance.status === "Absent") {
            absentToday++;
          }
        }
      }
    }

    res.json({
      totalStudents,
      presentToday,
      absentToday,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
});


// =========================
// TIMETABLE
// =========================

app.post("/timetable", async (req, res) => {
  const {
    subject,
    startTime,
    endTime,
    day,
  } = req.body;

  try {
    const timetable =
      await prisma.timetable.create({
        data: {
          subject,
          startTime,
          endTime,
          day,
        },
      });

    res.json(timetable);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create timetable",
    });
  }
});


app.get("/timetable", async (req, res) => {
  try {
    const timetable =
      await prisma.timetable.findMany();

    res.json(timetable);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch timetable",
    });
  }
});


// =========================
// RESULTS
// =========================

app.post("/results", async (req, res) => {
  const {
    studentId,
    subject,
    marks,
  } = req.body;

  try {
    const result =
      await prisma.result.create({
        data: {
          studentId,
          subject,
          marks,
        },
      });

    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create result",
    });
  }
});


app.get("/results", async (req, res) => {
  try {
    const results =
      await prisma.result.findMany({
        include: {
          student: true,
        },
      });

    res.json(results);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch results",
    });
  }
});


// =========================
// TEACHER
// =========================

async function createTeacher() {
  try {
    const hashedPassword =
      await bcrypt.hash(
        "admin123",
        10
      );

    await prisma.teacher.create({
      data: {
        name: "Amal Krishna",
        email: "admin@gmail.com",
        password: hashedPassword,
      },
    });

    console.log("Teacher Created");
  } catch (error) {
    console.log(error);
  }
}


// =========================
// TEACHER LOGIN
// =========================

app.post("/login", async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const teacher =
      await prisma.teacher.findUnique({
        where: {
          email,
        },
      });

    if (!teacher) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        teacher.password
      );

    if (!validPassword) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: teacher.id,
        email: teacher.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,

      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =========================
// STUDENT LOGIN
// =========================

app.post("/student/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Find student
    const student =
      await prisma.student.findUnique({
        where: {
          email,
        },
      });

    // Student doesn't exist
    if (!student) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // Check password
    const passwordMatch =
      await bcrypt.compare(
        password,
        student.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        role: "student",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send response
    res.json({
      message:
        "Student login successful",

      token,

      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =========================
// START SERVER
// =========================

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});