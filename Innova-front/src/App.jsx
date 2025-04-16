import React from 'react';
import './App.css';
import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from './Pages/Accueil';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Contact from './Pages/Contact';
import Apropos from './Pages/Apropos';
import Cours from './Pages/Cours';
import Profil from './Eleve/profil';
import Profile from './Repetiteur/Profile';
// import Reservation from './Eleve/Reservation';
// import confirmation from './Eleve/confirmation';
// import Recherche  from './components/Recherche';
// import Details from './Repetiteur/Details';



function App() {
  return (
    <div>
      {/* <h1>Innova</h1>
      <p>Bienvenue sur notre application !</p> */}
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apropos" element={<Apropos />} />
          <Route path="/cours" element={<Cours />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/reservation" element={<Reservation />} />
          <Route path="/confirmation" element={<confirmation />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/details/:id" element={<Details />} />
           */}
          {/* <Route path="/rechercher" element={<Rechercher />} /> */}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;