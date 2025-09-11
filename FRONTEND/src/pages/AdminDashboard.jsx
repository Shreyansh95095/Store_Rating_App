import UserList from "../components/UserList";
export default function AdminDashboard() {
  // fetch users, stores, ratings
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {/* Dashboard stats here */}
      <UserList /> {/* Display/filter/sort users */}
      {/* Add stores/users forms with validation */}
    </div>
  );
}
