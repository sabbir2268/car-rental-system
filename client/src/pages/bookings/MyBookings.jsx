import { useState, useEffect } from "react";
import { Calendar, XCircle, Edit3, Car } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [modifyBooking, setModifyBooking] = useState(null);
  const [modifyForm, setModifyForm] = useState({ startDate: "", endDate: "" });
  const [modifyLoading, setModifyLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/bookings/my");
      setBookings(res.data.bookings);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    setCancelLoading(true);
    try {
      const res = await axiosInstance.patch(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data.booking : b))
      );
      toast.success("Booking cancelled!");
      setCancelId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancelLoading(false);
    }
  };

  const openModifyModal = (booking) => {
    setModifyBooking(booking._id);
    setModifyForm({
      startDate: new Date(booking.startDate).toISOString().split("T")[0],
      endDate: new Date(booking.endDate).toISOString().split("T")[0],
    });
  };

  const handleModify = async (e) => {
    e.preventDefault();
    setModifyLoading(true);
    try {
      const res = await axiosInstance.patch(`/bookings/${modifyBooking}/modify`, modifyForm);
      setBookings((prev) =>
        prev.map((b) => (b._id === modifyBooking ? res.data.booking : b))
      );
      toast.success("Booking modified!");
      setModifyBooking(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Modify failed");
    } finally {
      setModifyLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage your car bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-[var(--foreground)]">No bookings yet</h3>
          <p className="text-gray-500 mt-2">Browse available cars and make your first booking</p>
          <a
            href="/cars"
            className="btn mt-6 bg-[var(--primary)] text-white hover:opacity-90 border-none"
          >
            Browse Cars
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-[var(--border)] text-gray-500">
                <th className="p-4 text-left">Car</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Dates</th>
                <th className="p-4 text-left">Total Price</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-[var(--border)] hover:bg-[var(--secondary)]">
                  <td className="p-4">
                    <img
                      src={
                        booking.car?.imageURL ||
                        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100"
                      }
                      alt={booking.car?.model}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium text-[var(--foreground)]">
                    {booking.car?.model || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                    <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 text-[var(--primary)] font-semibold">
                    ${booking.totalPrice}
                  </td>
                  <td className="p-4">
                    <span className={getStatusBadge(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <>
                          <button
                            onClick={() => openModifyModal(booking)}
                            className="btn btn-ghost btn-sm text-blue-500"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => setCancelId(booking._id)}
                            className="btn btn-ghost btn-sm text-red-500"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-sm w-full p-8 shadow-2xl border border-[var(--border)] text-center">
            <XCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Cancel Booking?</h2>
            <p className="text-gray-500 mb-6">Are you sure you want to cancel this booking?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="btn flex-1 btn-outline border-gray-300 text-[var(--foreground)]"
              >
                Keep
              </button>
              <button
                onClick={() => handleCancel(cancelId)}
                disabled={cancelLoading}
                className="btn flex-1 bg-red-500 text-white hover:bg-red-600 border-none"
              >
                {cancelLoading ? <span className="loading loading-spinner"></span> : "Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Dates Modal */}
      {modifyBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-md w-full p-8 shadow-2xl border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Modify Dates</h2>
            <form onSubmit={handleModify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                  value={modifyForm.startDate}
                  onChange={(e) => setModifyForm({ ...modifyForm, startDate: e.target.value })}
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
                  value={modifyForm.endDate}
                  min={modifyForm.startDate}
                  onChange={(e) => setModifyForm({ ...modifyForm, endDate: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModifyBooking(null)}
                  className="btn flex-1 btn-outline border-gray-300 text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modifyLoading}
                  className="btn flex-1 bg-[var(--primary)] text-white border-none"
                >
                  {modifyLoading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
