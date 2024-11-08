import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AuditLogs.module.scss";
import { auth } from "../lib/firebase";

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: any;
  before: any;
  after: any;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios.get("/api/audit-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to fetch audit logs");
      setLoading(false);
    }
  };

  const renderDiff = (before: any, after: any) => {
    if (!before && !after) return null;
    if (!before)
      return (
        <pre className={styles.added}>{JSON.stringify(after, null, 2)}</pre>
      );
    if (!after)
      return (
        <pre className={styles.removed}>{JSON.stringify(before, null, 2)}</pre>
      );

    const beforeKeys = Object.keys(before);
    const afterKeys = Object.keys(after);
    const allKeys = Array.from(new Set([...beforeKeys, ...afterKeys]));

    return (
      <pre>
        {allKeys.map((key) => {
          if (before[key] !== after[key]) {
            return (
              <React.Fragment key={key}>
                <span className={styles.removed}>
                  - {key}: {JSON.stringify(before[key])}
                </span>
                <br />
                <span className={styles.added}>
                  + {key}: {JSON.stringify(after[key])}
                </span>
                <br />
              </React.Fragment>
            );
          }
          return null;
        })}
      </pre>
    );
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Audit Logs</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User ID</th>
            <th>Action</th>
            <th>Details</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp.seconds * 1000).toLocaleString()}</td>
              <td>{log.userId}</td>
              <td>{log.action}</td>
              <td>{JSON.stringify(log.details)}</td>
              <td>{renderDiff(log.before, log.after)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
