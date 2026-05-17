import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, HeadphonesIcon, Car, ArrowRight } from "lucide-react";
import axiosInstance from "../../api/axios";
import CarCard from "../../components/common/CarCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Safe & Secure",
    desc: "All vehicles are thoroughly inspected and insured for your safety.",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Support",
    desc: "Round-the-clock customer service to assist you anytime, anywhere.",
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Best Prices",
    desc: "Competitive daily rates with no hidden charges or surprise fees.",
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: "Easy Booking",
    desc: "Simple online booking process with instant confirmation.",
  },
];

const Home = () => {
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/cars?sort=newest&limit=8")
      .then((res) => setRecentCars(res.data.cars.slice(0, 8)))
      .catch(() => setRecentCars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Drive Your{" "}
              <span className="text-[var(--primary)]">Dream Car</span> Today
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mt-6 leading-relaxed">
              Choose from our premium fleet of vehicles. Flexible rental plans,
              competitive prices, and exceptional service guaranteed.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/cars"
                className="btn bg-[var(--primary)] text-white hover:opacity-90 border-none px-8 py-3 text-lg h-auto"
              >
                Browse Cars <ArrowRight size={20} />
              </Link>
              <Link
                to="/register"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg h-auto"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
            Why Choose Us
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            We provide the best car rental experience with quality service and
            affordable prices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card bg-[var(--card)] border border-[var(--border)] p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-[var(--secondary)] text-[var(--primary)] p-4 rounded-full w-fit mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-20 px-4 bg-[var(--secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
                Recent Listings
              </h2>
              <p className="text-gray-500 mt-2">Check out our latest additions</p>
            </div>
            <Link
              to="/cars"
              className="text-[var(--primary)] font-medium flex items-center gap-1 hover:underline mt-4 md:mt-0"
            >
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          {loading ? (
            <LoadingSpinner />
          ) : recentCars.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Car size={48} className="mx-auto mb-4 opacity-40" />
              <p>No cars available yet. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentCars.map((car, index) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
            Special Offers
          </h2>
          <p className="text-gray-500 mt-3">Exclusive deals for our valued customers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Weekend Special",
              desc: "Get 20% off on weekend rentals. Perfect for a quick getaway!",
              color: "from-orange-500 to-red-500",
            },
            {
              title: "Weekly Saver",
              desc: "Book for 7+ days and enjoy 30% discount on total price.",
              color: "from-blue-500 to-purple-500",
            },
            {
              title: "First Ride",
              desc: "New users get 15% off on their first booking. Welcome aboard!",
              color: "from-green-500 to-teal-500",
            },
          ].map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${offer.color} rounded-xl p-8 text-white shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-3">{offer.title}</h3>
              <p className="text-white/90">{offer.desc}</p>
              <Link
                to="/cars"
                className="inline-flex items-center gap-1 mt-4 text-white font-medium hover:underline"
              >
                Book Now <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
