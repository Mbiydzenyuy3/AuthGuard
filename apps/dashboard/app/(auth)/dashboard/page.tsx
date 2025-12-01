export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total API Keys</h2>
          <p className="text-3xl font-bold text-accent mt-2">0</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">Monthly Requests</h2>
          <p className="text-3xl font-bold text-accent mt-2">0</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">Active Sessions</h2>
          <p className="text-3xl font-bold text-accent mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
