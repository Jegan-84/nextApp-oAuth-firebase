import { Box, Typography } from "@mui/material";
import { withAuth } from "../components/withAuth";
import UserManagement from "../components/userManagement";
import { withRoleAccess } from "../components/withRoleAccess";

function UserManagementPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      <UserManagement />
    </Box>
  );
}

export default withAuth(withRoleAccess(UserManagementPage, ["admin"]));
