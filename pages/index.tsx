import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Box, Typography } from "@mui/material";
import { withAuth } from "../components/withAuth";

function Home() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.displayName}!
      </Typography>
      <Typography variant="body1">
        This is your dashboard. You can navigate to your todos using the
        sidebar.
      </Typography>
    </Box>
  );
}

export default withAuth(Home);
