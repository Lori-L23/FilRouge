import React from "react";
import "./App.css";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./Pages/Accueil";
import Contact from "./Pages/Contact";
import Apropos from "./Pages/Apropos";
import Ressources from "./Pages/Ressources";
import DevenirContributeur from "./components/DevenirContributeur";
import Cours from "./Pages/Cours";
import Profil from "./Eleve/profil";
import Profile from "./Repetiteur/Profile";
import Layout from "./components/Layout";
import TeamPage from "./components/TeamPage";
import { AuthProvider } from "./contexts/AuthContext"; // adapte si le dossier s'appelle "context" ou "contexts"
import TrouverProfesseur from "./Pages/TrouverProfesseur";
import DevenirProfesseur from "./Pages/DevenirProfesseur";
// import Reservation from './Eleve/Reservation';
// import confirmation from './Eleve/confirmation';
import Recherche  from './components/Recherche';
// import Details from './Repetiteur/Details';

function App() {
  return (
    <div>
      {/* <h1>Innova</h1>
      <p>Bienvenue sur notre application !</p> */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Accueil />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apropos" element={<Apropos />} />
              <Route path="/cours" element={<Cours />} />
              <Route path="/ressources" element={<Ressources />} />
              <Route
                path="/devenir-contributeur"
                element={<DevenirContributeur />}
              
              />
              <Route path="/trouverprofesseur" element={<TrouverProfesseur />} />
              <Route path="/devenirprofesseur" element={<DevenirProfesseur />} />

              {/* <Route path="/details/:id" element={<Details />} /> */}

              <Route path="/equipe" element={<TeamPage />} />
              {/* <Route path="/temoignages" element={<Temoignages />} /> */}
              {/* <Route path="/faq" element={<FAQ />} /> */}
              {/* <Route path="/blog" element={<Blog />} /> */}
              {/* <Route path="/valeurs" element={<Valeurs />} /> */}

              <Route path="/Recherche" element={<Recherche />} />

              <Route path="/profil" element={<Profil />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* <Route path="/reservation" element={<Reservation />} />
          <Route path="/confirmation" element={<confirmation />} />
          <Route path="/recherche" element={<Recherche />} />
           */}
            {/* <Route path="/rechercher" element={<Rechercher />} /> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
