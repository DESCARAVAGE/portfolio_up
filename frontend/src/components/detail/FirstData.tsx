import type { JSX } from "react";
import type { Notion } from "../../types/notion";
import { Chip, Typography } from "@mui/material";

export interface FirstDataProps {
  notion: Notion;
}

export function FirstData({ notion }: FirstDataProps): JSX.Element {
  const skillsArray = notion.skills.split(",").map((skill) => (
    <Chip
      key={skill.trim()}
      label={skill.trim()}
      size="medium"
      sx={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.2)",
        },
      }}
    />
  ));

  return (
    <>
      <div>
        <h3>{notion.underTitle}</h3>
        {/* <div className="container">
                <div><img src={notion.picture2} alt={notion.title} className="xpImage"/></div>
                <div><img src={notion.picture1} alt={notion.title} className="xpImage"/></div>
            </div>
            <p>{notion.description}.</p> */}
      </div>
      <div className="boxTest">
        <img className="miniBox" src={notion.picture1} alt={notion.title} />
        <img className="miniBox" src={notion.picture2} alt={notion.title} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBlock: 16,
          justifyContent: "center",
        }}
      >
        {skillsArray}
      </div>

      <div className="bgCard">
        <Typography sx={{ textAlign: 'justify' }}  variant="h6">{notion.description}.</Typography>
      </div>
    </>
  );
}

// {
//     title: "Mission Client",
//     school: "Cefim",
//     schoolPicture: "assets/LogoWild.png",
//     duration: "Mai - juillet 2022",
//     description: "Cette phase de ma formation a été dédiée à une mission client réelle pour l'association Orléanaise, Split Screen. Souhaitant promouvoir à la culture du jeu vidéo. nous avons travaillé sur le développement d'une application web répondant aux besoins spécifiques du client. J'ai pu mettre en pratique toutes les compétences acquises lors des phases précédentes, tout en apprenant à gérer les attentes du client et à livrer un produit de qualité dans les délais impartis.",
//     picture1: "assets/testé.png",
//     picture2: "assets/LogoSplitScreen.d0fa0658-removebg-preview.png",
//     skills: "Échange client, gestion de projet, développement web fullstack, React, Node.js, Express, MongoDB, REST API, déploiement",
//   },
