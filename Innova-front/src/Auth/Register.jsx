import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TutorQuestionnaire from "../components/TutorQuestionnaire";

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
    niveau_scolaire: "",
    matieres: [],
    niveau_principal: "",
    classes_college: [],
    biographie: "",
    tarif_horaire: "",
    rayon_intervention: 10,
    questionnaire: {},
    currentQuestion: 0,
    showQuestionnaire: false,
    validation_score: 0,
    is_profile_validated: false,
  });

  const { register } = useAuth();
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const navigate = useNavigate();

  const CLASSES_COLLEGE = [
    "6eme",
    "5eme",
    "4eme",
    "3eme",
    "seconde",
    "premiere",
    "terminale",
  ];

  const analyzeWithAI = async (tutorData) => {
    try {
      const prompt = `
      Analyse ce profil de tuteur scolaire et attribue un score sur 10 selon ces critères:
      1. Adéquation matières/niveaux (20%)
      2. Expérience pédagogique (20%)
      3. Méthodologie (30%) - basée sur le questionnaire
      4. Engagement (15%)
      5. Tarif raisonnable (15%)

      Matières: ${tutorData.matieres.join(", ")}
      Niveau: ${tutorData.niveau_principal}
      Biographie: ${tutorData.biographie.substring(0, 500)}
      Tarif: ${tutorData.tarif_horaire} FCFA
      Score questionnaire: ${tutorData.questionnaire_score}/10

      Réponds au format JSON: {score: number, feedback: string[], is_valid: boolean}
    `;

      // Implémentation factice - à remplacer par un appel API réel
      const score = Math.min(
        10,
        Math.max(
          5,
          tutorData.questionnaire_score * 0.3 + Math.random() * 5 + 2
        )
      );

      return {
        score: Math.round(score * 10) / 10,
        feedback: generateFeedback(tutorData, score),
        is_valid: score >= 7,
      };
    } catch (error) {
      console.error("Erreur AI:", error);
      return {
        score: 5,
        feedback: ["Erreur d'analyse. Veuillez vérifier manuellement."],
        is_valid: false,
      };
    }
  };

  const generateFeedback = (tutorData, score) => {
    const feedbacks = [];

    if (tutorData.questionnaire_score < 6) {
      feedbacks.push(
        "Vos réponses au questionnaire suggèrent que vous pourriez améliorer vos méthodes pédagogiques."
      );
    }

    if (tutorData.biographie.length < 200) {
      feedbacks.push(
        "Votre biographie est trop courte. Détaillez votre expérience et vos qualifications."
      );
    }

    if (feedbacks.length === 0) {
      feedbacks.push("Votre profil est bien complet. Bon travail!");
    }

    return feedbacks;
  };

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

  const handleQuestionAnswer = (questionId, answer) => {
    setFormData((prev) => ({
      ...prev,
      questionnaire: {
        ...prev.questionnaire,
        [questionId]: answer,
      },
    }));
  };

  const handleNavigateQuestion = (step) => {
    setFormData((prev) => ({
      ...prev,
      currentQuestion: prev.currentQuestion + step,
    }));
  };

  const getRelevantQuestions = (matieres, niveauPrincipal) => {
    const selectedMatieres = matieres
      .map((id) => TutorQuestionnaire.MATIERES.find((m) => m.id === id)?.nom)
      .filter(Boolean);

    let questions = [...TutorQuestionnaire.GENERAL_QUESTIONS];

    selectedMatieres.forEach((matiere) => {
      if (TutorQuestionnaire.QUESTIONS_BY_SUBJECT[matiere]?.[niveauPrincipal]) {
        questions = [
          ...questions,
          ...TutorQuestionnaire.QUESTIONS_BY_SUBJECT[matiere][niveauPrincipal],
        ];
      }
    });

    return questions.sort(() => 0.5 - Math.random()).slice(0, 10);
  };

  const calculateScore = (questions, answers) => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach((question) => {
      const answer = answers[question.id];
      const selectedOption = question.options.find(
        (opt) => opt.value === answer
      );
      if (selectedOption) {
        totalScore += selectedOption.score;
      }
      maxPossibleScore += Math.max(...question.options.map((opt) => opt.score));
    });

    return Math.round((totalScore / maxPossibleScore) * 10);
  };

  const validateBasicForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.nom.trim()) {
      errors.nom = ["Le nom est obligatoire"];
      isValid = false;
    }
    if (!formData.prenom.trim()) {
      errors.prenom = ["Le prénom est obligatoire"];
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = ["L'email est obligatoire"];
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = ["L'email n'est pas valide"];
      isValid = false;
    }
    if (!formData.telephone.trim()) {
      errors.telephone = ["Le téléphone est obligatoire"];
      isValid = false;
    } else if (!/^\d{9}$/.test(formData.telephone)) {
      errors.telephone = ["Le téléphone doit contenir 9 chiffres"];
      isValid = false;
    }
    if (!formData.date_naissance) {
      errors.date_naissance = ["La date de naissance est obligatoire"];
      isValid = false;
    }
    if (!formData.password) {
      errors.password = ["Le mot de passe est obligatoire"];
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = ["Le mot de passe doit contenir au moins 8 caractères"];
      isValid = false;
    }
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = ["Les mots de passe ne correspondent pas"];
      isValid = false;
    }

    if (userType === "repetiteur") {
      if (!formData.niveau_principal) {
        errors.niveau_principal = ["Le niveau principal est obligatoire"];
        isValid = false;
      }
      if (formData.matieres.length === 0) {
        errors.matieres = ["Au moins une matière est requise"];
        isValid = false;
      }
      if (!formData.biographie.trim()) {
        errors.biographie = ["La biographie est obligatoire"];
        isValid = false;
      }
      if (!formData.tarif_horaire) {
        errors.tarif_horaire = ["Le tarif horaire est obligatoire"];
        isValid = false;
      }
    } else {
      if (!formData.niveau_scolaire) {
        errors.niveau_scolaire = ["Le niveau scolaire est obligatoire"];
        isValid = false;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Veuillez corriger les erreurs dans le formulaire");
      return false;
    }

    return true;
  };

  const performFinalRegistration = async (data) => {
    try {
      let userData = {
        ...data,
        role: userType,
      };

      if (userType === "repetiteur") {
        userData.matieres = data.matieres;
        userData.classes_college = data.classes_college;
        userData.validation_score = data.validation_score;
        userData.is_profile_validated = data.is_profile_validated;
        userData.questionnaire_responses = JSON.stringify(data.questionnaire);
      } else {
        delete userData.matieres;
        delete userData.niveau_principal;
        delete userData.classes_college;
        delete userData.biographie;
        delete userData.tarif_horaire;
        delete userData.rayon_intervention;
        delete userData.questionnaire;
      }

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateBasicForm()) return;

    if (userType === "repetiteur") {
      setFormData((prev) => ({
        ...prev,
        showQuestionnaire: true,
        currentQuestion: 0,
      }));
      return;
    }

    await performFinalRegistration(formData);
  };

  const handleQuestionnaireSubmit = async () => {
    setIsAnalyzing(true);

    try {
      const questions = getRelevantQuestions(
        formData.matieres,
        formData.niveau_principal
      );
      const questionnaireScore = calculateScore(questions, formData.questionnaire);

      // Analyse avec IA
      const aiAnalysis = await analyzeWithAI({
        ...formData,
        matieres: TutorQuestionnaire.MATIERES.filter((m) =>
          formData.matieres.includes(m.id)
        ).map((m) => m.nom),
        questionnaire_score: questionnaireScore,
      });

      setFormData((prev) => ({
        ...prev,
        validation_score: aiAnalysis.score,
        is_profile_validated: aiAnalysis.is_valid,
        showQuestionnaire: false,
      }));

      if (!aiAnalysis.is_valid) {
        setAnalysisResult({
          score: aiAnalysis.score,
          required_score: 7,
          feedback: aiAnalysis.feedback,
        });
        setShowValidationModal(true);
      } else {
        await performFinalRegistration({
          ...formData,
          validation_score: aiAnalysis.score,
          is_profile_validated: true,
        });
      }
    } catch (error) {
      setError("Erreur lors de l'analyse par l'IA");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptAnalysis = async () => {
    setShowValidationModal(false);
    await performFinalRegistration({
      ...formData,
      is_profile_validated: false,
    });
  };

  const handleRetryQuestionnaire = () => {
    setShowValidationModal(false);
    setFormData((prev) => ({
      ...prev,
      showQuestionnaire: true,
      currentQuestion: 0,
      questionnaire: {},
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-green-500 to-green-600 flex items-center justify-center px-4">
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
                <p className="text-red-600 text-sm mt-1">
                  {fieldErrors.nom[0]}
                </p>
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
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.email[0]}
              </p>
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
                  {TutorQuestionnaire.MATIERES.map(({ id, nom }) => (
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
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#7ED321] text-white py-2 px-4 rounded-md hover:bg-[#6EC11C] transition-colors flex items-center justify-center"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyse en cours...
              </>
            ) : (
              "S'inscrire"
            )}
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

        {/* Questionnaire modal */}
        {formData.showQuestionnaire && (
          <TutorQuestionnaire
            matieres={formData.matieres}
            niveauPrincipal={formData.niveau_principal}
            currentQuestion={formData.currentQuestion}
            answers={formData.questionnaire}
            onAnswer={handleQuestionAnswer}
            onNavigate={handleNavigateQuestion}
            onSubmit={handleQuestionnaireSubmit}
          />
        )}

        {/* Modal de validation */}
        {showValidationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">
                Validation de votre profil
              </h3>

              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Score obtenu:</span>
                  <span>
                    {analysisResult.score}/{analysisResult.required_score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      analysisResult.score >= analysisResult.required_score
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${
                        (analysisResult.score / analysisResult.required_score) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Points à améliorer:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResult.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleAcceptAnalysis}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Continuer quand même
                </button>
                <button
                  onClick={handleRetryQuestionnaire}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Réessayer le questionnaire
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;