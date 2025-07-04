# FilRouge - Plateforme de Mise en Relation Élèves-Répétiteurs

## 📌 Table des Matières

- [Description](#-description)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation et Configuration](#-installation, #-configuration)
- [Démarrage](#-démarrage)
- [Déploiement](#-déploiement)
- [Auteurs](#-auteurs)

## Description

InnovaLearn est une plateforme web qui connecte les élèves ayant besoin de soutien scolaire avec des répétiteurs qualifiés. L'application permet:

- Aux élèves de trouver des répétiteurs selon leurs besoins (matière, niveau, nom)
- Aux répétiteurs de proposer leurs services et gérer leurs disponibilités
- Un système de réservation et de paiement sécurisé(en perspective)

## Fonctionnalités Principales

### Pour les Élèves

- Recherche de répétiteurs par matière, niveau et nom
- Consultation des profils
- Réservation de séances en ligne
- Système de paiement intégré(en perspective)

### Pour les Répétiteurs

- Création de profil détaillé avec compétences et disponibilités
- Gestion des réservations et calendrier
- Système de notation et avis(en perspective)

### Admin

- 👥 Gestion des utilisateurs
- 📝 Modération des contenus
- 📊 Analytics globales

## Technologies Utilisées

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Laravel
- **Base de données**: MySQL
- **Authentification**: Sanctum
- **Paiements**: Stripe API

## Installation et Configuration

### Prérequis

- **Node.js** (v16 ou supérieure)
- **npm** ou **yarn** (gestionnaire de paquets)
- **MySQL** (local ou cluster Atlas)
- **Stripe CLI** (si vous utilisez le système de paiement)
- **GitHub** (pour cloner le dépôt)

### 1. Clonage du dépôt

bash
git clone https://github.com/Lori-L23/FilRouge.git
cd FilRouge

## Backend (serveur)

# dans le fichier .env, configurer

- DB_CONNECTION=mysql // nom de votre base de donee
- DB_HOST=127.0.0.1
- DB_PORT=3306
- DB_DATABASE=innova_api // nom de votre base de donee
- DB_USERNAME=root
- DB_PASSWORD=

# Installez les dépendances

- php artisan serve
- npm install

## Frontend

## creer un fichier .env

- VITE_API_BASE_URL=http://localhost:8000
- VITE_APP_URL=http://localhost:5173 // mettez la route de votre frontend

## installez les dependances

- npm install

## Démarrage des applications

## Backend (dans un terminal)

- php artisan serve

## Frontend (dans un autre terminal)

- nom run dev

## lancer votre base de donne

## Deploiement

- Au lieu de npm run dev , vous ecrivez npm run build

## Auteurs

- TEZEMBONG ATEFA LORI WENDY https://github.com/Lori-L23
