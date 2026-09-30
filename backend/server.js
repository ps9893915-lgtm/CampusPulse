const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();


// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json());


// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

    res.json({
        message: "CampusPulse backend is running successfully!"
    });

});


// ======================================
// DATABASE TEST ROUTE
// ======================================

app.get("/api/db-test", async (req, res) => {

    try {

        const [rows] = await db.execute(
            "SELECT 1 AS database_connection"
        );

        res.json({

            success: true,

            message: "CampusPulse database connected successfully!",

            result: rows

        });

    } catch (error) {

        console.error("Database error:", error);

        res.status(500).json({

            success: false,

            message: "Database connection failed."

        });

    }

});


// ======================================
// AUTHENTICATION ROUTES
// ======================================

app.use("/api/auth", authRoutes);


// ======================================
// START SERVER
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `CampusPulse backend running on port ${PORT}`
    );

});