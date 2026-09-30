const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const router = express.Router();


// ======================================
// USER REGISTRATION
// ======================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            department
        } = req.body;


        // Check required fields

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });

        }


        // Check password length

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters."
            });

        }


        // Check whether email already exists

        const [existingUser] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );


        if (existingUser.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });

        }


        // Hash password

        const passwordHash = await bcrypt.hash(
            password,
            10
        );


        // Insert user into database

        const [result] = await db.execute(

            `INSERT INTO users
            (name, email, password_hash, department)
            VALUES (?, ?, ?, ?)`,

            [
                name,
                email,
                passwordHash,
                department || null
            ]

        );


        // Registration successful

        res.status(201).json({

            success: true,

            message: "Registration successful.",

            userId: result.insertId

        });


    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({

            success: false,

            message: "Server error during registration."

        });

    }

});


// ======================================
// USER LOGIN
// ======================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check required fields

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required."

            });

        }


        // Find user

        const [users] = await db.execute(

            "SELECT * FROM users WHERE email = ?",

            [email]

        );


        // User not found

        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }


        const user = users[0];


        // Compare password with stored hash

        const passwordMatch = await bcrypt.compare(

            password,

            user.password_hash

        );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }


        // Create JWT token

        const token = jwt.sign(

            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "2h"
            }

        );


        // Send response

        res.json({

            success: true,

            message: "Login successful.",

            token: token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role,

                department: user.department

            }

        });


    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({

            success: false,

            message: "Server error during login."

        });

    }

});


// ======================================
// EXPORT ROUTER
// ======================================

module.exports = router;