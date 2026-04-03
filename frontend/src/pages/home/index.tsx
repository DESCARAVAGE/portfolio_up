import type { JSX } from "react";
import "./../../styles/App.css";
import "./../../styles/Cards.scss";
import { Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { paths } from "../../paths";

export function Page(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        marginTop: "50px",
        marginBottom: "20px",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src="/assets/moi.jpeg" className="profile-image" alt="Profile" />
      </div>
      <div className="textAbout">
        Ce projet vient finaliser mon cursur d'apprentissage en tant que Manager de Solution Digital & Data. 
      </div>
      <div className="textAbout">
        Je vous mets à disposition mon Curiculum Vitae pour plus de d'information sur mes compétences aquisent et en cours d'acquisiont.
      </div>
      <Divider />
      <div className="xpCards">
        <div className="titleCards">Découvrez on parcours et expériences</div>
        <div className="content">
          <button
            className="card"
            onClick={() => navigate(paths.xpDetails("1"))}
          >
            <div className="icon">
              <i className="material-icons md-36">school</i>
            </div>
            <p className="title">DWWM | RNCP 5</p>
            <p className="text">Mon entrée dans l'IT (Bootcamp)</p>
          </button>
          <button
            className="card"
            onClick={() => navigate(paths.xpDetails("2"))}
          >
            <div className="icon">
              <i className="material-icons md-36">psychology</i>
            </div>
            <p className="title">CDA | RNCP 6</p>
            <p className="text">
              Approfondissement des connaissances (Alternance)
            </p>
          </button>
          <button
            className="card"
            onClick={() => navigate(paths.xpDetails("3"))}
          >
            <div className="icon">
              <i className="material-icons md-36">work</i>
            </div>
            <p className="title">MS2D | RNCP 7</p>
            <p className="text">Optimisation & Professionnelle (Alternance)</p>
          </button>
        </div>
      </div>
    </div>
  );
}
