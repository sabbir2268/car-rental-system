import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { UserPlus, Mail, Lock, User, Camera, Car } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", photoURL: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", form);
      setUser(res.data.user);
      toast.success("Registration successful!");
      navigate("/", { replace: true });
    } catch (err) {
      if (!err.response) {
        toast.error("Cannot reach the server. Is the backend running on port 5000?");
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md bg-[var(--card)] shadow-xl border border-[var(--border)] p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-[var(--primary)] p-3 rounded-full">
              <Car className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter your name"
                className={`input input-bordered w-full pl-10 bg-[var(--background)] text-[var(--foreground)] ${
                  errors.name ? "input-error" : ""
                }`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                className={`input input-bordered w-full pl-10 bg-[var(--background)] text-[var(--foreground)] ${
                  errors.email ? "input-error" : ""
                }`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="At least 6 characters"
                className={`input input-bordered w-full pl-10 bg-[var(--background)] text-[var(--foreground)] ${
                  errors.password ? "input-error" : ""
                }`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Photo URL <span className="text-gray-400">(optional)</span>
            </label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Paste your photo URL"
                className="input input-bordered w-full pl-10 bg-[var(--background)] text-[var(--foreground)]"
                value={form.photoURL}
                onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-[var(--primary)] text-white hover:opacity-90 border-none"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <UserPlus size={18} />
            )}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary)] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
