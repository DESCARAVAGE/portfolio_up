import type React from "react";
import { Navbar } from "./Navbar";
import { Box } from "@mui/material";
import { Footer } from "./footer/Footer";

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

export function AppLayout({ children }: Readonly<AppLayoutProps>): React.JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: "center" }}>
        <Navbar />
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "50px",
          overflowX: "hidden", // Empêche le scroll horizontal
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
