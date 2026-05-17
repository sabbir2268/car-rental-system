import { Link } from "react-router-dom";
import { Home, Car } from "lucide-react";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <Car className="text-[var(--primary)]" size={120} />
      </div>
      <h1 className="text-8xl font-bold text-[var(--primary)]">404</h1>
      <h2 className="text-2xl font-semibold text-[var(--foreground)] mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn bg-[var(--primary)] text-white hover:opacity-90 border-none mt-8 px-8 py-3 h-auto"
      >
        <Home size={20} />
        Back to Home
      </Link>
    </div>
  );
};

export default Error;
