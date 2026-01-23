// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import type { JSX } from "react";
import "./../../styles/App.css";
import "./../../styles/Cards.scss";
import { Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { paths } from "../../paths";

export function Page(): JSX.Element {
  // const [count, setCount] = useState(0)
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        marginTop: "50px",
        
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="public/assets/moi.jpeg"
          className="profile-image"
          alt="Profile"
        />
        Dany SK
      </div>
      <div className="textAbout">
        À propos | Bjr je suis moi, vous êtes vous, nous sommes nous, je veux
        être recruter pour créer de beaux sites qui ne cassent pas :)
      </div>
      <div className="textAbout">
        Compétences | HTML, CSS, JavaScript, TypeScript, React, Node.js,
        Express, MongoDB, SQL, Git, Docker, CI/CD
      </div>
      <Divider />
      <div className="xpCards">
        <div className="titleCards">Mon parcours et expériences</div>
        <div className="content">
          {/* <!-- card --> */}
          <div className="card" onClick={() => navigate(paths.xpDetails("1"))}>
            <div className="icon">
              <i className="material-icons md-36">school</i>
            </div>
            <p className="title">DWWM | RNCP 5</p>
            <p className="text">Mon entrée dans l'IT (Bootcamp)</p>
          </div>
          {/* <!-- end card -->
      <!-- card --> */}
          <div className="card" onClick={() => navigate(paths.xpDetails("2"))}>
            <div className="icon">
              <i className="material-icons md-36">psychology</i>
            </div>
            <p className="title">CDA | RNCP 6</p>
            <p className="text">Approfondissement des connaissances (Alternance)</p>
          </div>
          {/* <!-- end card -->
      <!-- card --> */}
          <div className="card" onClick={() => navigate(paths.xpDetails("3"))}>
            <div className="icon">
              <i className="material-icons md-36">work</i>
            </div>
            <p className="title">MS2D | RNCP 7</p>
            <p className="text">Optimisation & Professionnelle (Alternance)</p>
          </div>
          {/* <!-- end card --> */}
        </div>
      </div>
      <Button onClick={() => navigate(paths.goals("horizon-26"))}>
        btn horizon 2026
      </Button>
    </div>
  );
}

{
  /* <div className="xpCard" onClick={() => navigate(paths.xpDetails("1"))}>
          <div className="xpUnderCard"></div>
          <p>DWWM | RNCP 5 </p>
        </div>
        <div className="xpCard" onClick={() => navigate(paths.xpDetails("2"))}>
          <div className="xpUnderCard"></div>
          <p>CDA | RNCP 6 </p>
        </div>
        <div className="xpCard" onClick={() => navigate(paths.xpDetails("3"))}>
          <div className="xpUnderCard"></div>
          <p>MS2D | RNCP 7 </p>
        </div> */
}
{/* <div className="about">
          <a
            className="bg_links social portfolio"
            href="https://www.rafaelalucas.com"
            target="_blank"
          >
            <span className="icon"></span>
          </a>
          <a
            className="bg_links social dribbble"
            href="https://dribbble.com/rafaelalucas"
            target="_blank"
          >
            <span className="icon"></span>
          </a>
          <a
            className="bg_links social linkedin"
            href="https://www.linkedin.com/in/rafaelalucas/"
            target="_blank"
          >
            <span className="icon"></span>
          </a>
          <a className="bg_links logo"></a>
        </div> */}
        {/* <!-- end about --> */}
