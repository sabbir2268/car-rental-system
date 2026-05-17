import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Car, X } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";

const AddCar = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    model: "",
    dailyPrice: "",
    availability: true,
    registrationNumber: "",
    features: "",
    description: "",
    imageURL: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.model.trim()) errs.model = "Model is required";
    if (!form.dailyPrice || Number(form.dailyPrice) <= 0)
      errs.dailyPrice = "Valid daily price is required";
    if (!form.registrationNumber.trim()) errs.registrationNumber = "Registration number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        dailyPrice: Number(form.dailyPrice),
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      };
      await axiosInstance.post("/cars", payload);
      toast.success("Car added successfully!");
      navigate("/my-cars");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[var(--primary)] p-2 rounded-lg">
          <PlusCircle className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Add New Car</h1>
          <p className="text-gray-500 text-sm">List your car for rent</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 md:p-8 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Car Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Toyota Camry"
              className={`input input-bordered w-full bg-[var(--background)] text-[var(--foreground)] ${errors.model ? "input-error" : ""}`}
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Daily Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 50"
              className={`input input-bordered w-full bg-[var(--background)] text-[var(--foreground)] ${errors.dailyPrice ? "input-error" : ""}`}
              value={form.dailyPrice}
              onChange={(e) => setForm({ ...form, dailyPrice: e.target.value })}
            />
            {errors.dailyPrice && <p className="text-red-500 text-xs mt-1">{errors.dailyPrice}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ABC-1234"
              className={`input input-bordered w-full bg-[var(--background)] text-[var(--foreground)] ${errors.registrationNumber ? "input-error" : ""}`}
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. New York, NY"
              className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Features</label>
          <input
            type="text"
            placeholder="e.g. GPS, Bluetooth, AC (comma separated)"
            className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Description</label>
          <textarea
            placeholder="Describe your car..."
            className="textarea textarea-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/car-image.jpg"
            className="input input-bordered w-full bg-[var(--background)] text-[var(--foreground)]"
            value={form.imageURL}
            onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-sm border-[var(--primary)]"
            checked={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.checked })}
            id="availability"
          />
          <label htmlFor="availability" className="text-sm text-[var(--foreground)]">
            Available for booking
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline border-gray-300 text-[var(--foreground)] flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn bg-[var(--primary)] text-white hover:opacity-90 border-none flex-1"
          >
            {loading ? <span className="loading loading-spinner"></span> : <Car size={18} />}
            {loading ? "Adding..." : "Add Car"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;
