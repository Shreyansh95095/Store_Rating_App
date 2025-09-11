import StoreCard from '../components/storeCard';
import { useState } from 'react';

export default function Dashboard() {
  // Example data and state
  const stores = [ {name: 'Best Mart', address: 'Main St, City', averageRating: 4.3} ];
  const [userRating, setUserRating] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Stores</h1>
      {stores.map(store => (
        <StoreCard
          key={store.name}
          store={store}
          userRating={userRating}
          setRating={setUserRating}
        />
      ))}
    </div>
  );
}
