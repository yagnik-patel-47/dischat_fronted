import { Box, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const RedirectPage = () => {
  const router = useHistory();
  useEffect(() => {
    router.replace("/");
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography color="darkgrey" variant="h6">
        You are already signed in.
      </Typography>
    </Box>
  );
};

export default RedirectPage;
