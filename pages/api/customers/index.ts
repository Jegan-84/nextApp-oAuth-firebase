import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../lib/firebase-admin";
import { logAction } from "../../../lib/auditLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await getAllCustomers(req, res);
  } else if (req.method === "POST") {
    return await createCustomer(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getAllCustomers(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const customersRef = admin.firestore().collection("customers");
    const snapshot = await customersRef.get();
    const customers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await logAction(userId, "GET_ALL_CUSTOMERS", { count: customers.length });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
}

async function createCustomer(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { name, email, status } = req.body;
    const customersRef = admin.firestore().collection("customers");
    const docRef = await customersRef.add({ name, email, status });

    const newCustomer = { id: docRef.id, name, email, status };

    await logAction(
      userId,
      "CREATE_CUSTOMER",
      { customerId: docRef.id },
      null,
      newCustomer
    );

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Failed to create customer" });
  }
}
