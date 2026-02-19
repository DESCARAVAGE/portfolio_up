import { useNavigate } from "react-router-dom";
import { paths } from "../../paths";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

export function BtnPortfolio() {
  const navigate = useNavigate();

  return (
    <div className="landingCard" onClick={() => navigate(paths.home)}>
      <h3>Découvrez mon portfolio</h3>
      <MeetingRoomIcon />
    </div>
  );
}
