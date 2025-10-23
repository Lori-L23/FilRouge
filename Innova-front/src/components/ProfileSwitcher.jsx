import { useAuth } from "../contexts/AuthContext";
import ProfileEleve from "../Eleve/profil";
import ProfileRepetiteur from "../Repetiteur/Profile";
import AdminDashboard from "../admin/profil";

export default function ProfilePage() {
  const { user, profile, profileType } = useAuth();

  if (!user) return <div>Veuillez vous connecter</div>;

  const RenderProfile = () => {

    switch (profileType) {
      case "eleve":
        return <ProfileEleve profile={profileType} />;
      case "repetiteur":
        return <ProfileRepetiteur profile={profileType} />;
      case "admin":
        return <AdminDashboard profile={profileType} />;
      default:
        return <div>Profil non reconnu</div>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {/* Informations de base */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Informations Personnelles
            </h2>
            <p>
              {user.prenom} {user.nom}
            </p>
            <p>{user.email}</p>
            <p>{user.telephone}</p>
          </div>
        </div>
        <div className="md:col-span-2">
          {/* Profil spécifique */}
          {<RenderProfile />}
        </div>
      </div>
    </div>
  );
}
