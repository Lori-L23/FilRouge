import React from "react";
import { FiUser, FiPhone, FiCalendar } from "react-icons/fi";

const RecentActivityTable = ({ users = [] }) => {
  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Utilisateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Rôle
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">
              Inscription
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                Aucun utilisateur récent
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center bg-gray-200 rounded-full">
                    <FiUser className="text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.prenom ?? "Prénom"} {user.nom ?? "Nom"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email ?? "Email non renseigné"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiPhone className="mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {user.telephone ?? "Non renseigné"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full 
                    ${
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "repetiteur"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role ?? "Inconnu"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" />
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Date inconnue"}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
