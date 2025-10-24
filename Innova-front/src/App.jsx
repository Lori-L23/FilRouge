import React from "react";
import { ToastContainer } from "react-toastify";

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

import { AuthProvider } from './contexts/AuthContext';

import TrouverProfesseur from "./Pages/TrouverProfesseur";
import DevenirProfesseur from "./Pages/DevenirProfesseur";
import Reservation from "./Eleve/Reservation";
// import confirmation from './Eleve/confirmation';
import Recherche from "./components/Recherche";
import Details from "./Repetiteur/Details";
import DashboardAdmin from "./admin/DashboardAdmin";
import FeedbackForm from "./Pages/FeedbackForm";
import MesCours from "./components/MesCours";
import ProfileSwitcher from "./components/ProfileSwitcher";
import Profilad from "./admin/profil";
import Acc2 from "./Pages/Acc2";
import Blog from "./Pages/Blog";
import FAQ from "./Pages/Faq";
import Temoignages from "./Pages/Temoignages";
import ArticleDetail from "./components/ArticleDetail";
// import TableauDonnees from "./components/TableauDonnees";
import DashboardStats from "./components/DashboardStats";
import AdminLayout from "./admin/AdminLayou";
import Utilisateurs from "./admin/Utilisateurs";
import Repetiteurs from "./admin/Repetiteurs";
import Eleves from "./admin/Eleves";
import CoursAd from "./admin/Cours";
import Paiements from "./admin/Paiements";
import Reservations from "./admin/Reservations";
import Parametres from "./admin/Parametres";
import Confidentialite from "./legal/Confidentialite";
import MentionsLegales from "./legal/MentionsLegales";
import CGU from "./legal/CGU";
import Detailscours from "./Pages/details";
function App() {
  return (
    <>
      <div>

        <AuthProvider>
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
              <Route path="/trouverprofesseur" element={<TrouverProfesseur />}
              />
              <Route
                path="/devenirprofesseur"
                element={<DevenirProfesseur />}
              />
              <Route path="/acc2" element={<Acc2 />} />
              <Route path="/repetiteurs/:id" element={<Details />} />

              <Route path="/equipe" element={<TeamPage />} />
              <Route path="/temoignages" element={<Temoignages />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<ArticleDetail />} />
              <Route path="/mentions" element={<MentionsLegales />} />
              <Route path="/confidentialite" element={<Confidentialite />} />
              <Route path="/cgu" element={<CGU />} />
              {/* <Route path="/details/:id" element={<Details />} /> */}
              <Route path="/detailscours/:id" element={<Detailscours />} />
              <Route path="/repetiteur/:id" element={<Profile />} />

              {/* <Route path="/valeurs" element={<Valeurs />} /> */}

              <Route path="/Recherche" element={<Recherche />} />

              <Route path="/profil" element={<Profil />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profilad" element={<Profilad />} />
              <Route path="/MesCours" element={<MesCours />} />
              <Route path="/ProfileSwitcher" element={<ProfileSwitcher />} />
              <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
              <Route path="/FeedbackForm" element={<FeedbackForm />} />
              <Route path="/reservation/:id" element={<Reservation />} />
              <Route path="/dashboard-stats" element={<DashboardStats />} />
              {/* <Route element={<AdminLayout />}> */}
                <Route
                  path="/admin/utilisateurs"
                  element={<Utilisateurs />}
                />
                <Route path="/admin/repetiteurs" element={<Repetiteurs />} />
                <Route path="/admin/eleves" element={<Eleves />} />
                <Route path="/admin/cours" element={<CoursAd />} />
                <Route path="/admin/paiements" element={<Paiements />} />
                <Route
                  path="/admin/reservations"
                  element={<Reservations />}
                />
                <Route path="/admin/parametres" element={<Parametres />} />
              {/* </Route> */}
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
