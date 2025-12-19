import * as clientService from '../services/client.service.js';
import { isValidEmail } from '../utils/emailValidation.js';

export const createClient = async (req, res) => {
  try {
    const { name, email } = req.body;

    /* 1. Required fields validation */
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    /* 2. Email format validation */
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    /* 3. Normalize email */
    const normalizedEmail = email.toLowerCase().trim();

    /* 4. Check if client already exists */
    const existingClient = await clientService.getClientByEmail(
      normalizedEmail
    );

    if (existingClient) {
      return res.status(409).json({
        message: "Client with this email already exists"
      });
    }

    /* 5. Create client */
    const client = await clientService.createClient({
      name: name.trim(),
      email: normalizedEmail
    });

    /* 6. Success response */
    return res.status(201).json({
      message: "Client created successfully",
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        createdAt: client.createdAt
      }
    });
  } catch (error) {
    console.error("Create client error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClient = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
