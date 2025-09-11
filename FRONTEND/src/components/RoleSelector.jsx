export default function RoleSelector({ role, onChange }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
                className="w-full border rounded px-3 py-2"
                value={role}
                onChange={e => onChange(e.target.value)}
            >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
            </select>
        </div>
    );
}


