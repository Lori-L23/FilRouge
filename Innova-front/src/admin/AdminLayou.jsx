// src/layouts/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import {
  ChartBarIcon,
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { key: "1", icon: <ChartBarIcon className="h-5 w-5" />, label: "Tableau de bord", path: "/DashboardAdmin" },
  { key: "2", icon: <UsersIcon className="h-5 w-5" />, label: "Utilisateurs", path: "/admin/utilisateurs" },
  { key: "3", icon: <UserGroupIcon className="h-5 w-5" />, label: "Répétiteurs", path: "/admin/repetiteurs" },
  { key: "4", icon: <AcademicCapIcon className="h-5 w-5" />, label: "Élèves", path: "/admin/eleves" },
  { key: "5", icon: <BookOpenIcon className="h-5 w-5" />, label: "Cours", path: "/admin/cours" },
  { key: "6", icon: <CurrencyDollarIcon className="h-5 w-5" />, label: "Paiements", path: "/admin/paiements" },
  { key: "7", icon: <CalendarIcon className="h-5 w-5" />, label: "Réservations", path: "/admin/reservations" },
  { key: "8", icon: <CogIcon className="h-5 w-5" />, label: "Paramètres", path: "/admin/parametres" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen ">
      <aside className="w-64 bg-blue-700 text-white p-4">
        <h2 className="text-xl font-bold mb-6 mt-20">Admin</h2>
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-2 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
