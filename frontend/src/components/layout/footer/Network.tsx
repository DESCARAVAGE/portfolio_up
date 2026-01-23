import { Box, Link } from "@mui/material";
import type React from "react";

export function Network(): React.JSX.Element {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: 2 }}>
      <Box>
        <p style={{ textAlign: "center" }}>Me suivre sur linkdin</p>
      </Box>
      <Link
        href="www.linkedin.com/in/escaravage-daniel"
        color="inherit"
        underline="hover"
      >
        <Box
          sx={{
            backgroundColor: "royalblue",
            padding: 2,
            borderRadius: 2,
            color: "white",
            width: "fit-content",
            marginX: "auto",
          }}
        >
          LinkedIn Profile
        </Box>
      </Link>
    </Box>
  );
}
