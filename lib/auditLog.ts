import admin from "./firebase-admin";

export async function logAction(
  userId: string,
  action: string,
  details: any,
  before?: any,
  after?: any
) {
  try {
    const auditLogRef = admin.firestore().collection("auditLogs");
    await auditLogRef.add({
      userId,
      action,
      details,
      before,
      after,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
}
