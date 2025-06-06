import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const [userType, setUserType] = useState("eleve");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [date_naissance, setDate_naissance] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  // Champs spécifiques aux répétiteurs
  const [matieres, setMatieres] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [biographie, setBiographie] = useState("");
  const { register } = useAuth();
  const [rayonIntervention, setRayonIntervention] = useState(10);
  const [photo, setPhoto] = useState(null);
  const [tarifHoraire, setTarifHoraire] = useState(""); // Ajoutez ce state

  // Convertir les tableaux en strings si nécessaire
  const matieresString = matieres.join(",");
  const niveauxString = niveaux.join(",");

  // Champs spécifiques aux élèves
  const [niveau_scolaire, setNiveau_scolaire] = useState("");

  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Créez l'objet de base commun à tous les utilisateurs
    const userData = {
      nom,
      prenom,
      date_naissance,
      telephone,
      email,
      password,
      password_confirmation,
      role: userType,
    };

    // Ajoutez les champs spécifiques selon le type d'utilisateur
    if (userType === "repetiteur") {
      userData.matieres = matieres.join(",");
      userData.niveaux = niveaux.join(",");
      userData.biographie = biographie;
      userData.tarif_horaire = tarifHoraire;
      userData.rayon_intervention = rayonIntervention;
      // userData.photo = photo; // À décommenter quand vous gérerez les fichiers
    } else if (userType === "eleve") {
      userData.niveau_scolaire = niveau_scolaire;
    }

    try {
      const result = await register(userData);
      console.log("res: ", result);

      if (result.success) {
        navigate("/", { state: { IsLoggedIn: true } });
      } else {
        console.log("No success");
        setError(result.error || "Échec de l'inscription");
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      console.log("error founded");
      const responseError = err.response?.data?.errors;
      if (responseError) {
        setFieldErrors(responseError);
        const firstError = Object.values(responseError)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || "Échec de l'inscription");
      }
    }
  };

  
  const handleMatiereChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMatieres([...matieres, value]);
    } else {
      setMatieres(matieres.filter((matiere) => matiere !== value));
    }
  };

  const handleNiveauChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNiveaux([...niveaux, value]);
    } else {
      setNiveaux(niveaux.filter((niveau) => niveau !== value));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#7ED321]">
        Créer un compte
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {typeof error === "object" ? error.message : error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        {/* Sélection du type */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <label className="block mb-2 font-medium">Je suis :</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="eleve"
                checked={userType === "eleve"}
                onChange={() => setUserType("eleve")}
                className="form-radio text-[#4A90E2]"
              />
              <span className="ml-2">Élève</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="repetiteur"
                checked={userType === "repetiteur"}
                onChange={() => setUserType("repetiteur")}
                className="form-radio text-[#4A90E2]"
              />
              <span className="ml-2">Répétiteur</span>
            </label>
          </div>
        </div>

        {/* Champs communs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Nom*</label>
            <input
              type="text"
              name="nom"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            {fieldErrors.nom && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.nom[0]}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Prénom*</label>
            <input
              type="text"
              name="prenom"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            {fieldErrors.prenom && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.prenom[0]}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email*</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Téléphone*</label>
          <input
            type="tel"
            name="telephone"
            required
            pattern="[0-9]{9}"
            title="09 chiffres requis"
            className="w-full px-3 py-2 border rounded-md"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
          {fieldErrors.telephone && (
            <p className="text-red-600 text-sm mt-1">
              {fieldErrors.telephone[0]}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Date de naissance*</label>
          <input
            type="date"
            name="date_naissance"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={date_naissance}
            onChange={(e) => setDate_naissance(e.target.value)}
          />
          {fieldErrors.date_naissance && (
            <p className="text-red-600 text-sm mt-1">
              {fieldErrors.date_naissance[0]}
            </p>
          )}
        </div>

        {/* Champs spécifiques aux élèves */}
        {userType === "eleve" && (
          <div className="mb-4">
            <label className="block mb-2">Niveau scolaire*</label>
            <select
              name="niveau_scolaire"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={niveau_scolaire}
              onChange={(e) => setNiveau_scolaire(e.target.value)}
            >
              <option value="">Sélectionnez un niveau</option>
              <option value="6eme">6ème</option>
              <option value="5eme">5ème</option>
              <option value="4eme">4ème</option>
              <option value="3eme">3ème</option>
              <option value="2nde">2nde</option>
              <option value="1ere">1ere</option>
              <option value="terminale">Tle</option>
            </select>
          </div>
        )}

        {/* Champs spécifiques aux répétiteurs */}
        {userType === "repetiteur" && (
          <>
            <div className="mb-4">
              <label className="block mb-2">Matières enseignées*</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Mathématiques",
                  "Physique",
                  "Chimie",
                  "Français",
                  "Anglais",
                  "Philosophie",
                  "Histoire",
                  "SVT",
                ].map((matiere) => (
                  <label key={matiere} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={matiere}
                      checked={matieres.includes(matiere)}
                      onChange={handleMatiereChange}
                      className="form-checkbox text-[#4A90E2]"
                    />
                    <span className="ml-2">{matiere}</span>
                  </label>
                ))}
              </div>
            </div>
  

            <div className="mb-4">
              <label className="block mb-2">Niveaux enseignés*</label>
              <div className="grid grid-cols-2 gap-2">
                {["primaire", "College/lycee"].map((niveau) => (
                  <label key={niveau} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={niveau}
                      checked={niveaux.includes(niveau)}
                      onChange={handleNiveauChange}
                      className="form-checkbox text-[#4A90E2]"
                    />
                    <span className="ml-2">
                      {niveau === "primaire" ? "Primaire" : "Collège/Lycée"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Biographie</label>
              <textarea
                name="biographie"
                rows="4"
                className="w-full px-3 py-2 border rounded-md"
                value={biographie}
                onChange={(e) => setBiographie(e.target.value)}
                placeholder="Décrivez votre parcours et votre méthode d'enseignement..."
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Tarif horaire (FCFA)*</label>
              <input
                type="number"
                name="tarif_horaire"
                min="1000"
                required
                className="w-full px-3 py-2 border rounded-md"
                value={tarifHoraire}
                onChange={(e) => setTarifHoraire(e.target.value)}
              />
              {fieldErrors.tarif_horaire && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.tarif_horaire[0]}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Rayon d'intervention (km)</label>
              <input
                type="number"
                name="rayon_intervention"
                min="1"
                max="50"
                className="w-full px-3 py-2 border rounded-md"
                value={rayonIntervention}
                onChange={(e) => setRayonIntervention(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Photo de profil</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border rounded-md"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block mb-2">Mot de passe*</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className="text-red-600 text-sm mt-1">
              {fieldErrors.password[0]}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Confirmer le mot de passe*</label>
          <input
            type="password"
            name="password_confirmation"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={password_confirmation}
            onChange={(e) => setPassword_confirmation(e.target.value)}
          />
          {fieldErrors.password_confirmation && (
            <p className="text-red-600 text-sm mt-1">
              {fieldErrors.password_confirmation[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#7ED321] text-white py-2 px-4 rounded-md hover:bg-[#6EC11C] transition-colors"
        >
          S'inscrire
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          to="/login"
          className="text-indigo-600 font-medium hover:text-indigo-500"
        >
          Déjà inscrit ? Connectez-vous
        </Link>
      </div>
    </div>
  );
}

export default Register;
