import { Box, Button, Divider } from "@mui/material";
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
    </Box>
  );
}


// import { Box, Button, Divider } from "@mui/material";
// import React from "react";
// import "../../styles/Navbar.css";

// export function Navbar(): React.JSX.Element {
// //   const API_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL;
//   //TODO: Ajouter mes réseaux sociaux
//   //TODO: Ajouter un bouton pour télécharger le CV
//   return (
//     <Box component="header" className="navbar">
//       Chef de projet & CDA full stack
//       <Divider
//         sx={{
//           borderRightWidth: 1,
//           marginX: 2,
//           borderColor: "rgba(255, 255, 255, 0.3)",
//         }}
//         orientation="vertical"
//         flexItem
//       />
//       <Button
//         variant="contained"
//         component="a"
//         href={`http://localhost:3001/api/cv/download`}
//       >
//         Télécharger mon CV
//       </Button>
//     </Box>
//   );
// }
