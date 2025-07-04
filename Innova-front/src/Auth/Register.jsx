import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const [userType, setUserType] = useState("eleve");
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    date_naissance: "",
    password: "",
    password_confirmation: "",
    niveau_scolaire: "",      // Pour élève
    matieres: [],            // IDs numériques pour répétiteur
    niveau_principal: "",    // "primaire" ou "college/lycee"
    classes_college: [],     // tableau de classes
    biographie: "",
    tarif_horaire: "",
    rayon_intervention: 10,
  });

  const { register } = useAuth();
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMatiereChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value);
    setFormData((prev) => ({
      ...prev,
      matieres: checked
        ? [...prev.matieres, id]
        : prev.matieres.filter((m) => m !== id),
    }));
  };

  const handleNiveauChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      niveau_principal: value,
      classes_college: value === "primaire" ? [] : prev.classes_college,
    }));
  };

  const handleClasseChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      classes_college: checked
        ? [...prev.classes_college, value]
        : prev.classes_college.filter((c) => c !== value),
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    let userData = {
      ...formData,
      role: userType,
      matieres: formData.matieres,
      classes_college: formData.classes_college,
    };

    // Nettoyage selon rôle
    if (userType === "eleve") {
      delete userData.matieres;
      delete userData.niveau_principal;
      delete userData.classes_college;
      delete userData.biographie;
      delete userData.tarif_horaire;
      delete userData.rayon_intervention;
    } else {
      delete userData.niveau_scolaire;
    }

    try {
      const result = await register(userData);
      if (result.success) {
        navigate("/", { state: { IsLoggedIn: true } });
      } else {
        setError(result.message || "Échec de l'inscription");
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      const responseError = err.response?.data?.errors;
      if (responseError) {
        setFieldErrors(responseError);
        const firstError = Object.values(responseError)[0]?.[0];
        setError(firstError || "Erreur de validation");
      } else {
        setError(err.response?.data?.message || "Échec de l'inscription");
      }
    }
  };

  const MATIERES = [
    { id: 1, nom: "Mathématiques" },
    { id: 2, nom: "Physique" },
    { id: 3, nom: "Chimie" },
    { id: 4, nom: "Français" },
    { id: 5, nom: "Anglais" },
    { id: 6, nom: "Philosophie" },
    { id: 7, nom: "Histoire" },
    { id: 8, nom: "SVT" },
  ];

  const CLASSES_COLLEGE = [
    "6eme",
    "5eme",
    "4eme",
    "3eme",
    "seconde",
    "premiere",
    "terminale",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2E7D32]">
          Créer un compte
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Type utilisateur */}
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
                value={formData.nom}
                onChange={handleChange}
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
                value={formData.prenom}
                onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              title="9 chiffres requis"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.telephone}
              onChange={handleChange}
            />
            {fieldErrors.telephone && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.telephone[0]}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Date de naissance*</label>
            <input
              type="date"
              name="date_naissance"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.date_naissance}
              onChange={handleChange}
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
                value={formData.niveau_scolaire}
                onChange={handleChange}
              >
                <option value="">Sélectionnez un niveau</option>
                {["primaire", "college", "lycee"].map((niveau) => (
                  <option key={niveau} value={niveau}>
                    {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
                  </option>
                ))}
              </select>
              {fieldErrors.niveau_scolaire && (
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.niveau_scolaire[0]}
                </p>
              )}
            </div>
          )}

          {/* Champs spécifiques aux répétiteurs */}
          {userType === "repetiteur" && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Matières enseignées*</label>
                <div className="grid grid-cols-2 gap-2">
                  {MATIERES.map(({ id, nom }) => (
                    <label key={id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={id}
                        checked={formData.matieres.includes(id)}
                        onChange={handleMatiereChange}
                        className="form-checkbox text-[#4A90E2]"
                      />
                      <span className="ml-2">{nom}</span>
                    </label>
                  ))}
                </div>
                {fieldErrors.matieres && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.matieres[0]}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2">Niveau principal*</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="niveau_principal"
                      value="primaire"
                      checked={formData.niveau_principal === "primaire"}
                      onChange={handleNiveauChange}
                      className="form-radio text-[#4A90E2]"
                    />
                    <span className="ml-2">Primaire</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="niveau_principal"
                      value="college/lycee"
                      checked={formData.niveau_principal === "college/lycee"}
                      onChange={handleNiveauChange}
                      className="form-radio text-[#4A90E2]"
                    />
                    <span className="ml-2">Collège/Lycée</span>
                  </label>
                </div>
                {fieldErrors.niveau_principal && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.niveau_principal[0]}
                  </p>
                )}
              </div>

              {formData.niveau_principal === "college/lycee" && (
                <div className="mb-4">
                  <label className="block mb-2">Classes spécifiques*</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CLASSES_COLLEGE.map((classe) => (
                      <label key={classe} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={classe}
                          checked={formData.classes_college.includes(classe)}
                          onChange={handleClasseChange}
                          className="form-checkbox text-[#4A90E2]"
                        />
                        <span className="ml-2">{classe}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.classes_college && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.classes_college[0]}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2">Biographie*</label>
                <textarea
                  name="biographie"
                  rows="4"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.biographie}
                  onChange={handleChange}
                  placeholder="Décrivez votre parcours et votre méthode d'enseignement..."
                />
                {fieldErrors.biographie && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.biographie[0]}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2">Tarif horaire (FCFA)*</label>
                <input
                  type="number"
                  name="tarif_horaire"
                  min="1000"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.tarif_horaire}
                  onChange={handleChange}
                />
                {fieldErrors.tarif_horaire && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.tarif_horaire[0]}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2">Rayon d'intervention (km)*</label>
                <input
                  type="number"
                  name="rayon_intervention"
                  min="1"
                  max="50"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.rayon_intervention}
                  onChange={handleChange}
                />
                {fieldErrors.rayon_intervention && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.rayon_intervention[0]}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block mb-2">Mot de passe*</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full px-3 py-2 border rounded-md"
              value={formData.password}
              onChange={handleChange}
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.password[0]}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2">Confirmer le mot de passe*</label>
            <input
              type="password"
              name="password_confirmation"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#7ED321] text-white py-2 px-4 rounded-md hover:bg-[#6EC11C] transition-colors"
          >
            S'inscrire
          </button>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:text-indigo-500"
            >
              Déjà inscrit ? Connectez-vous
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
