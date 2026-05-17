import { useState, useEffect } from "react";
import { Search, LayoutGrid, List, ArrowUpDown, Car } from "lucide-react";
import axiosInstance from "../../api/axios";
import CarCard from "../../components/common/CarCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCars();
  }, [debouncedSearch, sort]);

  const fetchCars = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { sort };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await axiosInstance.get("/cars", { params });
      setCars(res.data.cars);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Available Cars</h1>
        <p className="text-gray-500 mt-1">Find the perfect car for your journey</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8 p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by model or location..."
              className="input input-bordered w-full pl-10 bg-[var(--background)] text-[var(--foreground)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-gray-400" />
            <select
              className="select select-bordered bg-[var(--background)] text-[var(--foreground)]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-[var(--background)] rounded-lg p-1 border border-[var(--border)]">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded ${view === "grid" ? "bg-[var(--primary)] text-white" : "text-gray-400 hover:text-[var(--foreground)]"}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${view === "list" ? "bg-[var(--primary)] text-white" : "text-gray-400 hover:text-[var(--foreground)]"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchCars} className="btn btn-sm mt-4 bg-[var(--primary)] text-white border-none">
            Try Again
          </button>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-16">
          <Car size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-[var(--foreground)]">No cars found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {cars.map((car) =>
            view === "grid" ? (
              <CarCard key={car._id} car={car} />
            ) : (
              <div
                key={car._id}
                className="flex flex-col sm:flex-row gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={car.imageURL || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400"}
                  alt={car.model}
                  className="w-full sm:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--foreground)]">{car.model}</h3>
                    <p className="text-sm text-gray-500 mt-1">{car.location || "N/A"}</p>
                    <p className="text-sm text-gray-500">{car.features?.slice(0, 3).join(", ")}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[var(--primary)] font-bold text-xl">${car.dailyPrice}/day</span>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          car.availability ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {car.availability ? "Available" : "Unavailable"}
                      </span>
                      <a
                        href={`/cars/${car._id}`}
                        className="btn btn-sm bg-[var(--primary)] text-white hover:opacity-90 border-none"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AvailableCars;
