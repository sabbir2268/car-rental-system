import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Car, Plus, Edit2, Trash2, SortAsc, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [editingCar, setEditingCar] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCars();
  }, [sort]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/cars/my/list?sort=${sort}`);
      setCars(res.data.cars);
    } catch {
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (car) => {
    setEditingCar(car._id);
    setEditForm({
      model: car.model,
      dailyPrice: car.dailyPrice,
      availability: car.availability,
      registrationNumber: car.registrationNumber,
      features: car.features?.join(", ") || "",
      description: car.description || "",
      imageURL: car.imageURL || "",
      location: car.location || "",
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const payload = {
        ...editForm,
        dailyPrice: Number(editForm.dailyPrice),
        features: editForm.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };
      const res = await axiosInstance.put(`/cars/${editingCar}`, payload);
      setCars((prev) => prev.map((c) => (c._id === editingCar ? res.data.car : c)));
      toast.success("Car updated!");
      setEditingCar(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((c) => c._id !== id));
      toast.success("Car deleted!");
      setDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">My Cars</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your listed cars</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-gray-400" />
            <select
              className="select select-bordered select-sm bg-[var(--background)] text-[var(--foreground)]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low</option>
              <option value="price_desc">Price: High</option>
            </select>
          </div>
          <Link
            to="/add-car"
            className="btn bg-[var(--primary)] text-white hover:opacity-90 border-none btn-sm"
          >
            <Plus size={18} /> Add Car
          </Link>
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-16 bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <Car size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-[var(--foreground)]">No cars listed yet</h3>
          <p className="text-gray-500 mt-2 mb-6">Start by adding your first car</p>
          <Link
            to="/add-car"
            className="btn bg-[var(--primary)] text-white hover:opacity-90 border-none"
          >
            <Plus size={18} /> Add Your First Car
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-[var(--border)] text-gray-500">
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Bookings</th>
                <th className="p-4 text-left">Availability</th>
                <th className="p-4 text-left">Date Added</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id} className="border-b border-[var(--border)] hover:bg-[var(--secondary)]">
                  <td className="p-4">
                    <img
                      src={car.imageURL || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100"}
                      alt={car.model}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium text-[var(--foreground)]">{car.model}</td>
                  <td className="p-4 text-[var(--primary)] font-semibold">${car.dailyPrice}/day</td>
                  <td className="p-4 text-gray-500">{car.bookingCount}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        car.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.availability ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(car.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(car)}
                        className="btn btn-ghost btn-sm text-blue-500"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(car._id)}
                        className="btn btn-ghost btn-sm text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Edit Car</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Model</label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                    value={editForm.model}
                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Price</label>
                  <input
                    type="number"
                    className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                    value={editForm.dailyPrice}
                    onChange={(e) => setEditForm({ ...editForm, dailyPrice: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Image URL</label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                  value={editForm.imageURL}
                  onChange={(e) => setEditForm({ ...editForm, imageURL: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Features</label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                  value={editForm.features}
                  onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">Location</label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm border-[var(--primary)]"
                  checked={editForm.availability}
                  onChange={(e) => setEditForm({ ...editForm, availability: e.target.checked })}
                  id="edit-availability"
                />
                <label htmlFor="edit-availability" className="text-sm text-[var(--foreground)]">
                  Available
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCar(null)}
                  className="btn flex-1 btn-outline border-gray-300 text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="btn flex-1 bg-[var(--primary)] text-white border-none"
                >
                  {editLoading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-2xl max-w-sm w-full p-8 shadow-2xl border border-[var(--border)] text-center">
            <Trash2 size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Delete Car?</h2>
            <p className="text-gray-500 mb-6">This action cannot be undone. All related bookings will also be removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn flex-1 btn-outline border-gray-300 text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleteLoading}
                className="btn flex-1 bg-red-500 text-white hover:bg-red-600 border-none"
              >
                {deleteLoading ? <span className="loading loading-spinner"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCars;
