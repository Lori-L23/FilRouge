export default function RecentUsers({ users }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Inscrit le</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.prenom} {user.nom}</td>
                        <td>{user.email}</td>
                        <td>
                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                {user.role}
                            </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}