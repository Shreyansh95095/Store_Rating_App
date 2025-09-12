import { Link } from 'react-router-dom';
import { logoutApi } from '../services/auth';
import { useState } from 'react';

export default function OwnerDashboard() {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutApi();
      window.location.href = '/';
    } catch (e) {
      // no-op visual, could add toast
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  // Sample user data with ratings
  const userRatings = [
    {
      id: 1,
      userName: "John Doe",
      rating: 5,
      comment: "Excellent service and great products!",
      date: "2024-01-15"
    },
    {
      id: 2,
      userName: "Jane Smith",
      rating: 4,
      comment: "Good quality items, fast delivery",
      date: "2024-01-14"
    },
    {
      id: 3,
      userName: "Mike Johnson",
      rating: 3,
      comment: "Average experience, could be better",
      date: "2024-01-13"
    },
    {
      id: 4,
      userName: "Sarah Wilson",
      rating: 5,
      comment: "Amazing customer service!",
      date: "2024-01-12"
    },
    {
      id: 5,
      userName: "David Brown",
      rating: 2,
      comment: "Product quality needs improvement",
      date: "2024-01-11"
    }
  ];

  // Calculate average rating
  const averageRating = userRatings.reduce((sum, user) => sum + user.rating, 0) / userRatings.length;

  // Function to render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-orange-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Store Owner Dashboard</h2>
          <div className="flex gap-3">
            <Link
              to="/profile"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>View Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className={`px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${loggingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
            >
              {loggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                  </svg>
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Average Rating Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Rating Summary</h3>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-orange-600">{averageRating.toFixed(1)}</div>
            <div className="flex items-center">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-gray-600">
              Based on {userRatings.length} reviews
            </div>
          </div>
        </div>

        {/* User Ratings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h3 className="text-xl font-semibold p-6 pb-4 text-gray-700">Customer Reviews</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userRatings.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center">
                            <span className="text-orange-600 font-semibold text-sm">
                              {user.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.userName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(user.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          ({user.rating}/5)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {user.comment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
