import * as userService from "../services/user.service.js";
import * as clientService from "../services/client.service.js";
import { isValidEmail } from "../utils/emailValidation.js";
import bcrypt from "bcrypt";
import { generateJWT } from "../utils/generateJWT.js";

export const signUp = async (req, res) => {
  try {
    const { email, password, full_name, client_name, client_email } = req.body;

    /* 1. Required fields */
    if (!email || !password || !full_name || !client_name || !client_email) {
      return res.status(400).json({
        message: "Email, password, full name, client name, and client email are required",
      });
    }

    /* 2. Minimal email validation */
    if (!isValidEmail(email) || !isValidEmail(client_email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    /* 3. Normalize email */
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedClientEmail = client_email.toLowerCase().trim();

    /* 4. Check existing user */
    const existingUser = await userService.getUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const existingClient = await clientService.getClientByEmail(
      normalizedClientEmail
    );

    let client_id;

    if (existingClient) {
      client_id = existingClient.id;
    } else {
      const newClient = await clientService.createClient({
        name: client_name,
        email: normalizedClientEmail,
      });

      client_id = newClient.id;
    }

    /* 5. Create user */
    const user = await userService.createUser({
      client_id: client_id,
      email: normalizedEmail,
      password_hash: password,
      full_name,
    });

    /* 6. Response */
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        client_id: user.client_id,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* 1. Required fields */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    /* 2. Normalize email */
    const normalizedEmail = email.toLowerCase().trim();
    /* 3. Find user */
    const user = await userService.getUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    /* 4. Check password */
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    /* 5. Generate JWT */
    const token = generateJWT(user.id, user.role);

    /* 6. Set cookie */
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    /* 7. Response */
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    console.log(req.user);

    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};