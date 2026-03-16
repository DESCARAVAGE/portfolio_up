import { useNavigate } from "react-router-dom";
import { paths } from "../../paths";
import SchoolIcon from '@mui/icons-material/School';

export function BtnPortfolio() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="landingCard"
      onClick={() => navigate(paths.home)}
    >
      <h3>Projet de fin d'étude</h3>
      <SchoolIcon />
    </button>
  );
}
