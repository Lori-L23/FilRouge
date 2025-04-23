// src/components/ProfileSwitcher.jsx
import { useAuth } from "../contexts/AuthContext";
import Profil from "../Eleve/profil";
import Profile from "../Repetiteur/Profile";
import Profilad from "../admin/profil";
import { Navigate } from "react-router-dom";

export default function ProfileSwitcher() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;

  switch(user.role) {
    case 'eleve':
      return <Profil user={user} eleve={profile} />;
    case 'repetiteur':
      return <Profile user={user} repetiteur={profile} />;
    case 'admin':
      return <Profilad user={user} admin={profile} />;
    default:
      return <Navigate to="/" />;
  }
}