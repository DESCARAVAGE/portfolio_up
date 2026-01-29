import { Box, Button, Divider } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from "react";
import "../../styles/Navbar.css";

export function Navbar(): React.JSX.Element {
  const handleDownloadCv = () => {
    window.open("/api/cv/download");
  };

  return (
    <Box component="header" className="navbar">
      Chef de projet & CDA full stack

      <Divider
        sx={{
          borderRightWidth: 1,
          marginX: 2,
          borderColor: "rgba(255, 255, 255, 0.3)",
        }}
        orientation="vertical"
        flexItem
      />

      <Button
        variant="contained"
        onClick={handleDownloadCv}
      >
        Télécharger mon CV
      </Button>
       <Button
       sx={{ margin: 1 }}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    > Upload cv</Button>
    </Box>
  );
}
