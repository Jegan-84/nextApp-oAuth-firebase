import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../lib/firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    await admin.auth().verifyIdToken(token);

    const auditLogsRef = admin.firestore().collection("auditLogs");
    const snapshot = await auditLogsRef
      .orderBy("timestamp", "desc")
      .limit(100)
      .get();
    const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
}
