import { Box, Divider, Grid } from "@mui/material";
import type React from "react";
import "../../../styles/Footer.css";
import { Network } from "./Network";
//TODO: Arranger le footer
export function Footer(): React.JSX.Element {
  return (
    <Box component="footer" className="footer">
      <Grid container>
        <Grid size={6}>
          <Network />
        </Grid>
          {/* <Divider sx={{ background: 'rgba(255, 255, 255, 0.3);' }} orientation="vertical" flexItem variant="fullWidth" /> */}
        <Grid size={6}>
          <p style={{ textAlign: "center", padding: "16px", color: "white" }}>
            Me contacter
          </p>
        </Grid>
      </Grid>
    </Box>
  );
}
