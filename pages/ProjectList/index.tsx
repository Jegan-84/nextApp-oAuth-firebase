import { Box, Typography } from "@mui/material";
import { withAuth } from "../../components/withAuth";
import ProjectList from "../../components/ProjectList";
import { useAuth } from "../../contexts/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.email}! (Role: {user?.role})
      </Typography>
      <ProjectList />
    </Box>
  );
}

export default withAuth(Home);
