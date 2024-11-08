import React from "react";
import { NextPage } from "next";
import AuditLogs from "../components/AuditLogs";
import { withAuth } from "@/components/withAuth";
import { withRoleAccess } from "@/components/withRoleAccess";

const AuditLogsPage: NextPage = () => {
  return <AuditLogs />;
};

export default withAuth(withRoleAccess(AuditLogsPage, ["admin"]));
