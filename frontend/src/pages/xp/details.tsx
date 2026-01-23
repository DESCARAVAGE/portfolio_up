import React from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./../../styles/detail.css";
import type { JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Link, Tab, Tooltip, Typography } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { paths } from "../../paths";
import Grid from "@mui/material/Grid";
import { FirstData } from "../../components/detail/FirstData";
import { SecondData } from "../../components/detail/SecondData";
import { ThirdData } from "../../components/detail/ThirdData";

//TODO: fix the white square around the btn

const commonNotions1 = [
  {
    title: "Les basses du Dev",
    underTitle: "Transmission de savoir",
    school: "Wild Code School",
    schoolPicture: "/assets/LogoWild.png",
    duration: "Février - Mars 2022",
    description:
      "Durant cette période, j'ai appris les BA-BA du développement web. Comprendre et découvrir ses fondements, son histoire ainsi que ses principes à connaitre. Cette période c'est articulée autour d'un projet de cv d'un personnage fictif en html et css. De diverses travaux individuels pour découvrir la programmation orienté objet en javascript. Ça à été pour moi également l'occasion de participer à des hackathons pour dépasser mes limites",
    picture1: "/assets/IMG_20220530_143628.jpg",
    picture2: "/assets/Image d’iOS (1).jpg",
    skills: "HTML, CSS, Javascript, Algorithmie, POO, Git, GitHub, Frontend",
  },
  {
    title: "Collaboration et php/symfony",
    underTitle: "Projet : Tissu Jaures",
    school: "Wild Code School",
    schoolPicture: "assets/LogoWild.png",
    duration: "Mars - Mai 2022",
    description:
      "Ces 2 mois et demi ont été consacrés à l'apprentissage du php et du framework symfony. J'ai pu découvrir le développement backend, les bases de données relationnelles ainsi que le travail en équipe avec la méthodologie agile scrum. Cette période c'est articulée autour de divers projets en binôme ou en groupe de 4 pour mettre en pratique les notions apprises",
    picture1: "/assets/Capture d’écran du 2023-01-09 15-59-46.png",
    picture2: "/assets/Capture d’écran de 2022-10-19 10-05-29.png",
    skills: "Team work, PHP, Symfony, MySQL, Agile Scrum, Frontend & Backend, MVC",
  },
  {
    title: "Mission Client",
    underTitle:"Projet : Split Screen",
    school: "Wild Code School",
    schoolPicture: "assets/LogoWild.png",
    duration: "Mai - juillet 2022",
    description:
      "Cette phase de ma formation a été dédiée à une mission client réelle pour l'association Orléanaise, Split Screen. Souhaitant promouvoir à la culture du jeu vidéo. Nous avons travaillé sur le développement d'une application web répondant aux besoins spécifiques du client. J'ai pu mettre en pratique toutes les compétences acquises lors des phases précédentes, tout en apprenant à gérer les attentes du client, les échanges internes et à livrer un produit de qualité dans les délais impartis",
    picture1: "/assets/testé.png",
    picture2: "/assets/LogoSplitScreen.d0fa0658-removebg-preview.png",
    skills:
      "Échange client, gestion de projet, développement web fullstack, React, Node.js, Express, MongoDB, REST API, déploiement",
  },
];

const commonNotions2 = [
  {
    title: "Conception et Développement",
    underTitle: "Traduction d'une idée en un projet concret",
    school: "Wild Code School",
    schoolPicture: "/assets/LogoWild.png",
    duration: "Septembre - Novembre 2023",
    description:
      "Apprendre à concevoir des applications web sécurisées et bien organisées. Analyser les besoins, créer des maquettes, définir l’architecture logicielle et gérer des bases de données relationnelles ou NoSQL. Développer des composants pour accéder efficacement aux données",
    picture1: "/assets/mvp(1).png",
    picture2: "/assets/Cas _d'usage.png",
    skills: "Figma, UI/UX, Diagrammes d'interactions, Wireframe, Maquette, Prototypage, React, Typescript, Express, Full Remote",
  },
  {
    title: "CI/CD with Docker Github action",
    underTitle: "Projet : Green Step",
    school: "Wild Code School",
    schoolPicture: "assets/LogoWild.png",
    duration: "Décembre - Juillet 2023",
    description:
      "Après s'être familliarisé avec nos technologies, nous avions à charge le projet de notre choix pour le présenter à notre certification. Nous sommes parti d'un MVP où nous avions traduit les features à concevoir et à développer : De la BDD aux interfaces. Nous avons fait le choix de la conteneriser avec Docker pour y integrer notre CI/CD, nous l'avons déployé sur un serveur vitruel avec ses déclencheur (Webhook) et routing avec Ngix",
    picture1: "/assets/Capture_decran_de_2024-09-11_11-15-18.png",
    picture2: "/assets/Schema_Application_Transparent.png",
    skills: "Docker, GraphQL, Appolo Server, CI/CD, Tests, Github Action, Ngix, Configuration serveur, Déployement",
  },
  {
    title: "Expérience chez Enedis",
    underTitle: "De DWWM à CDA",
    school: "Cefim",
    schoolPicture: "assets/LogoWild.png",
    duration: "Aout 2023- Septembre 2024",
    description:
      "J'ai occupé les fonctions de Chef de projet et Concepteur (Frontend/Backend) Développeur (Frontend) durant ma première année chez Enedis, pour le projet e-Agora. J'avais à charge les échanges avec les utilisateurs et porteur de projet pour traduire leurs besoins. L'objectif de cette Web App est de fournir à l'organisation son mini réseau social et d'inclure une fonctionnalité de diffusion d'informations sur des écrans distants tout en minimisant la dette technique",
    picture1: "/assets/logo-enedis (1).png",
    picture2: "/assets/2583506_979720bff97617f98323ca334b5929b6d5c9fee5.png",
    skills:
      "Échanges clients, Gestion de projet, Résilience, Agilité, Sécurité, Choix technologiques, Conception, Développement",
  },
];

const commonNotions3 = [
  {
    title: "Compréhension client & structuration projet",
    underTitle: "De la théorie sur la pratique",
    school: "Cefim Skolae",
    schoolPicture:
      "/assets/Capture_d_écran_du_2026-01-14_09-41-04-removebg-preview.png",
    duration: "Février - Mars 2022",
    description:
      "Avec ma première année d'expéirence chez Enedis, j'ai dû apprendre sur le terrain. La théorie que m'a apporté ma formation en Management de Solution Digital et Data a drastiquement réduit mon syndrome de l'imposteur en me rendant légitime sur mon rôle occupé en entreprise. Au travers des études de cas concret et de masterclass donnée j'ai pu expérimenter et apprendre les essentiels pour mener un projet à bien",
    picture1: "/assets/1762277451599.jpeg",
    picture2: "/assets/Classe.jpg",
    skills: "Leadership, Postionnement technologiques, Art oratoire, gestion d'équipe, Sprint planning, Méthode Scrum, Masterclass",
  },
  {
    title: "Conception et Développement avec l'IA",
    underTitle: "Autopilotage par l'Intelligence Artificielle",
    school: "Wild Code School",
    schoolPicture: "assets/LogoWild.png",
    duration: "Mars - Mai 2022",
    description:
      "L'Intelligence Artificielle est partout, et savoir s'en servir est capital ! Ce fut pour nous l'occasion d'effectuer une veille intensive sur le sujet tout en expérimentant pour connaitre les effets de bords. Nous avons conçu des interfaces avec Relume.io et développer avec Cursor.ia",
    picture1: "/assets/Relume-logo.jpg",
    picture2: "/assets/Cursor_ai.webp",
    skills: "Prompt ingenerie, Optimisation de contextuel, Veille techno, Agilité, Expérimentation",
  },
  {
    title: "Expérience chez Enedis(2)",
    underTitle: "CDA à Manager de Solution Digital et Data",
    school: "Cefim",
    schoolPicture: "assets/LogoWild.png",
    duration: "Mai - juillet 2022",
    description:
      "Disposant des connaissance en gestion de projet, j'ai entamé ma deuxième année en tant que Chef de projet et CDA avec une idée simple : Aller à l'essentiel. En réduisant nos cas d'usage, en analysant le marché de notre entreprise et ses technologies, j'en conclue que Viva Engage(solution Microsft) allait remplir les fonctionnalité de réseau social. Mon équipe et moi-même avons pivoté pour se consacrer exclusivement à la réalisation du partage d'information sur des écrans disants",
    picture1: "/assets/logo-enedis (1).png",
    picture2: "/assets/ecran flix board.webp",
    skills:
      "Communication, Gestion de projet, Développement Frontend, React, Node.js, Express, PostgreSQL, REST API, Transmission de savoir",
  },
];

const experiences = {
  "1": {
    title: "Développeur Web et Web Mobile",
    rncp: "Titre RNCP de niveau 5",
    duration: "Bootcamp de 6 mois",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    link: "https://www.wildcodeschool.com/formation-developpeur-web",
    pictures: "/assets/Capture d’écran du 2026-01-13 09-07-20.png",
    notions: commonNotions1,
  },
  "2": {
    title: "Concepteur et Développeur d'Application",
    rncp: "Titre RNCP de niveau 6",
    duration: "2023 - 2024",
    skills: ["TypeScript", "Express", "MongoDB", "SQL", "Docker"],
    link: "https://www.wildcodeschool.com/formation-concepteur-developpeur-application",
    pictures: "/assets/Capture d’écran du 2026-01-14 09-56-58.png",
    notions: commonNotions2,
  },
  "3": {
    title: "MS2D | RNCP 7",
    rncp: "Titre RNCP de niveau 7",
    duration: "2024 - 2025",
    skills: ["Python", "Machine Learning", "AWS", "Agile", "Data Analysis"],
    link: "no link available",
    pictures: "/assets/Capture d’écran du 2026-01-14 12-00-42.png",
    notions: commonNotions3,
  },
};

export function Page(): JSX.Element {
  const { xpId } = useParams<{ xpId: string }>();
  const navigate = useNavigate();
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const experience = xpId
    ? experiences[xpId as keyof typeof experiences]
    : null;

  if (!experience) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <Button
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => navigate(paths.home)}
        >
          <i className="material-icons md-36">west</i>
          <Typography variant="caption" sx={{ display: "block" }}>
            Retour
          </Typography>
        </Button>
        <p>Expérience non trouvée ou l'expérience n'existe pas </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <div style={{ height: "fit-content", marginTop: "20px" }}>
        <Grid container spacing={1}>
          <Grid size={1} sx={{ display: "flex", alignItems: "center" }}>
            <Button
              style={{
                display: "flex",
                flexDirection: "column",
                color: "inherit",
              }}
              onClick={() => navigate(paths.home)}
            >
              <i className="material-icons md-36">west</i>
              <Typography variant="caption" sx={{ display: "block" }}>
                Retour
              </Typography>
            </Button>
          </Grid>
          <Grid
            size={10}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip title={experience.notions[0].school} placement="left">
              <img
                className="logo"
                src={experience.notions[0].schoolPicture}
                alt="picture of the school"
              />
            </Tooltip>
            <Link
              href={experience.link}
              underline="hover"
              target="not_blank"
              color="inherit"
            >
              <Tooltip title={experience.rncp} placement="right">
                <Typography variant="h4">{experience.title}</Typography>
              </Tooltip>
            </Link>
          </Grid>
          <Grid size={1} sx={{ display: "flex", alignItems: "center" }}>
            {/* Empty grid for spacing */}
          </Grid>
        </Grid>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1200px" }}>
          <p>
            <strong>Durée :</strong> {experience.duration}
          </p>
          <img
            src={experience.pictures}
            className="xpImage"
            alt="photo de l'expérience "
          />
        </div>
      </div>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{ "& .MuiTab-root:not(.Mui-selected)": { color: "white" } }}
            >
              <Tab label={experience.notions[0].title} value="1" />
              <Tab label={experience.notions[1].title} value="2" />
              <Tab label={experience.notions[2].title} value="3" />
            </TabList>
          </Box>

          <TabPanel value="1">
            <FirstData notion={experience.notions[0]} />
          </TabPanel>
          <TabPanel value="2">
            <SecondData notion={experience.notions[1]} />
          </TabPanel>
          <TabPanel value="3">
            <ThirdData notion={experience.notions[2]} />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

{
  /* <p>
            <strong>Compétences acquises :</strong>
          </p>
          <ul>
            {experience.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul> */
}
{
  /* <DevBase/>
<CollabPhp/>
<CusomerMission/> */
}
