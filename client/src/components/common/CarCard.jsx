import { Link } from "react-router-dom";
import { Car, MapPin, Calendar } from "lucide-react";

const CarCard = ({ car }) => {
  return (
    <div className="card bg-[var(--card)] shadow-md border border-[var(--border)] rounded-xl overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <figure className="relative h-48 overflow-hidden">
        <img
          src={car.imageURL || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400"}
          alt={car.model}
          className="w-full h-full object-cover"
        />
        {!car.availability && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-500 px-4 py-1 rounded">Unavailable</span>
          </div>
        )}
      </figure>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-[var(--foreground)] truncate">{car.model}</h3>
          <span className="text-[var(--primary)] font-bold text-lg">${car.dailyPrice}/day</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{car.location || "N/A"}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(car.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Car size={14} />
            {car.bookingCount || 0} bookings
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              car.availability
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {car.availability ? "Available" : "Unavailable"}
          </span>
          <Link
            to={`/cars/${car._id}`}
            className="btn btn-sm bg-[var(--primary)] text-white hover:opacity-90 border-none"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
