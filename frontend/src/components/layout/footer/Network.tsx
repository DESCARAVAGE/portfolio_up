import { Box, Link } from "@mui/material";
import type React from "react";
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export function Network(): React.JSX.Element {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center",  padding: 2 }}>
      <Link
        href="https://www.linkedin.com/in/escaravage-daniel"
        color="inherit"
        underline="hover"
        target="_blank"
        rel="noopener noreferrer"
      >
      <Box>
        <p style={{ textAlign: "center" }}>Rejoindre mon réseau</p>
      </Box>
          <LinkedInIcon />
      </Link>
    </Box>
  );
}
