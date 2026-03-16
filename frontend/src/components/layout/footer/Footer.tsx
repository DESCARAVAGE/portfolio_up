import { Box, Grid } from "@mui/material";
import type React from "react";
import "../../../styles/Footer.css";
import { Network } from "./Network";

export function Footer(): React.JSX.Element {
  return (
    <Box component="footer" className="footer">
      <Grid container>
        <Grid size={12}>
          <Network />
        </Grid>
      </Grid>
    </Box>
  );
}
