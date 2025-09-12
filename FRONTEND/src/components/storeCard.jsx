import Rating from "./Ratings";
export default function StoreCard({ store, userRating, setRating }) {
  return (
    <div className="p-6 bg-white rounded shadow mb-4">
      <h3 className="text-lg font-bold">Store Name</h3>
      <div className="flex items-center gap-3">
        <span className="font-bold text-blue-600">Avg: 4.5</span>
        <Rating value={userRating} onChange={setRating} />
      </div>
      <button className="bg-blue-500 px-4 py-1 rounded text-white mt-2">Submit Rating</button>
    </div>
  );
}
