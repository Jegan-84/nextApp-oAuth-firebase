import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../lib/firebase-admin";
import { logAction } from "../../../lib/auditLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    if (req.method === "PUT") {
      return await updateCustomer(req, res, id, userId);
    } else if (req.method === "DELETE") {
      return await deleteCustomer(req, res, id, userId);
    } else {
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function updateCustomer(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
  userId: string
) {
  try {
    const { name, email, status } = req.body;
    const customerRef = admin.firestore().collection("customers").doc(id);

    // Get the current state of the customer
    const customerSnapshot = await customerRef.get();
    const beforeState = customerSnapshot.data();

    // Update the customer
    await customerRef.update({ name, email, status });

    // Get the updated state of the customer
    const updatedSnapshot = await customerRef.get();
    const afterState = updatedSnapshot.data();

    await logAction(
      userId,
      "UPDATE_CUSTOMER",
      { customerId: id },
      beforeState,
      afterState
    );

    res.status(200).json({ id, ...afterState });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Failed to update customer" });
  }
}

async function deleteCustomer(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
  userId: string
) {
  try {
    const customerRef = admin.firestore().collection("customers").doc(id);

    // Get the current state of the customer before deletion
    const customerSnapshot = await customerRef.get();
    const beforeState = customerSnapshot.data();

    // Delete the customer
    await customerRef.delete();

    await logAction(
      userId,
      "DELETE_CUSTOMER",
      { customerId: id },
      beforeState,
      null
    );

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Failed to delete customer" });
  }
}
