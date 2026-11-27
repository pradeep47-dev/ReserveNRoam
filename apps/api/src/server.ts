import "dotenv/config";
import cors from "cors";
import express from "express";
import {
  initializeDatabase,
  getUser,
  getUserById,
  createUser,
  updateUser,
} from "./db.js";
import {
  generateToken,
  hashPassword,
  comparePasswords,
  authMiddleware,
  AuthRequest,
} from "./auth.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";
const allowedOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Initialize database
await initializeDatabase();

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "reservenroam-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (_request, response) => {
  response.json({
    name: "ReserveNRoam API",
    version: "0.1.0",
    message: "Outdoor discovery and reservation API",
  });
});

// Registration endpoint
app.post("/api/auth/register", async (request, response) => {
  try {
    const { email, password, firstName, lastName } = request.body;

    // Validation
    if (!email || !password) {
      response.status(400).json({ error: "Email and password are required" });
      return;
    }

    if (password.length < 6) {
      response
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
      return;
    }

    // Check if user exists
    const existingUser = await getUser(email);
    if (existingUser) {
      response.status(409).json({ error: "User already exists" });
      return;
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const userId = await createUser(email, hashedPassword, firstName, lastName);

    // Generate token
    const token = generateToken(userId, email);

    response.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: userId, email, firstName, lastName },
    });
  } catch (error) {
    console.error("Registration error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/api/auth/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    // Validation
    if (!email || !password) {
      response.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Get user
    const user = await getUser(email);
    if (!user) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Compare passwords
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      response.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    response.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile (protected route)
app.get("/api/auth/profile", authMiddleware, async (request: AuthRequest, response) => {
  try {
    if (!request.user) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await getUserById(request.user.userId);
    if (!user) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    response.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile (protected route)
app.patch("/api/auth/profile", authMiddleware, async (request: AuthRequest, response) => {
  try {
    if (!request.user) {
      response.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { firstName, lastName } = request.body;

    await updateUser(request.user.userId, firstName, lastName);

    const user = await getUserById(request.user.userId);
    if (!user) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    response.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, host, () => {
  console.log(`ReserveNRoam API listening on http://${host}:${port}`);
});
