import "./profile-menu.css"
import instagram from "../../images/Instagram.png";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";

async function logout() {
    await signOut(auth);
    window.location.href = "/"
}
export default function ProfileMenu() {
  return (
      <div className="profile">
          <img src={instagram} onClick={logout} className="profile-photo" ></img>
    </div>
  )
}
