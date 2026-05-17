import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign, Car, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CarDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState({ startDate: "", endDate: "" });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/cars/${id}`)
      .then((res) => setCar(res.data.car))
      .catch((err) => setError(err.response?.data?.message || "Failed to load car details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book a car");
      return;
    }
    if (!booking.startDate || !booking.endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    setBookingLoading(true);
    try {
      const res = await axiosInstance.post("/bookings", {
        carId: id,
        startDate: booking.startDate,
        endDate: booking.endDate,
      });
      toast.success("Booking confirmed!");
      setShowModal(false);
      setCar(res.data.booking.car);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullHeight />;
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/cars" className="btn btn-sm mt-4 bg-[var(--primary)] text-white border-none">
          Back to Cars
        </Link>
      </div>
    );
  }
  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 text-lg">Car not found</p>
        <Link to="/cars" className="btn btn-sm mt-4 bg-[var(--primary)] text-white border-none">
          Back to Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Link
        to="/cars"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--primary)] mb-6"
      >
        <ArrowLeft size={20} />
        Back to Cars
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={car.imageURL || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"}
            alt={car.model}
            className="w-full h-[400px] object-cover"
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">{car.model}</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-1">
              <MapPin size={16} />
              {car.location || "Location not specified"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-[var(--primary)]">${car.dailyPrice}</span>
            <span className="text-gray-500">/ per day</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                car.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {car.availability ? "Available" : "Unavailable"}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              Added {new Date(car.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Car size={16} />
              {car.bookingCount} booking{car.bookingCount !== 1 ? "s" : ""}
            </span>
          </div>

          {car.features?.length > 0 && (
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[var(--secondary)] text-[var(--foreground)] rounded-full text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {car.description && (
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{car.description}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <DollarSign size={16} />
            Registration: {car.registrationNumber}
          </div>

          <button
            onClick={() => {
              if (!user) {
                toast.error("Please login to book");
                return;
              }
              setShowModal(true);
            }}
            disabled={!car.availability}
            className="btn w-full bg-[var(--primary)] text-white hover:opacity-90 border-none py-3 h-auto text-lg"
          >
            {car.availability ? "Book Now" : "Not Available"}
          </button>
        </motion.div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-md w-full p-8 shadow-2xl border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Book {car.model}</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                  value={booking.startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                  value={booking.endDate}
                  min={booking.startDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                  required
                />
              </div>
              {booking.startDate && booking.endDate && (
                <div className="bg-[var(--secondary)] p-3 rounded-lg">
                  <p className="text-sm text-[var(--foreground)]">
                    Total:{" "}
                    <span className="font-bold text-[var(--primary)]">
                      $
                      {Math.max(
                        1,
                        Math.ceil(
                          (new Date(booking.endDate) - new Date(booking.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )
                      ) * car.dailyPrice}
                    </span>
                  </p>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn flex-1 btn-outline border-gray-300 text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn flex-1 bg-[var(--primary)] text-white hover:opacity-90 border-none"
                >
                  {bookingLoading ? <span className="loading loading-spinner"></span> : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
