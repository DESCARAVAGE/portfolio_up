import type { Notion } from "../../types/notion";
import { Chip, Typography } from "@mui/material";

export interface SecondDataProps {
    readonly notion: Notion;
}

export function SecondData({notion}: Readonly<SecondDataProps>): React.JSX.Element {
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