import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Car, Menu, Sun, Moon, LayoutDashboard, PlusCircle, CalendarDays, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("light");

  const guestLinks = [
    { path: "/", title: "Home" },
    { path: "/cars", title: "Available Cars" },
  ];

  const authLinks = [
    { path: "/", title: "Home" },
    { path: "/cars", title: "Available Cars" },
    { path: "/add-car", title: "Add Car", icon: PlusCircle },
    { path: "/my-cars", title: "My Cars", icon: LayoutDashboard },
    { path: "/my-bookings", title: "My Bookings", icon: CalendarDays },
  ];

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const btnBase =
    "px-3 py-1.5 rounded-md text-sm transition-all hover:bg-[var(--primary)] hover:text-white";

  return (
    <div className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[var(--primary)] p-2 rounded-xl">
            <Car className="text-white" size={22} />
          </div>
          <h1 className="text-xl font-bold text-[var(--foreground)] hidden sm:block">
            Car Rental
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {(user ? authLinks : guestLinks).map((link) => (
            <NavLink
              key={link.title}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors text-[var(--foreground)] ${
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-[var(--primary)]/10"
                }`
              }
            >
              {link.icon && <link.icon size={16} />}
              {link.title}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--primary)] text-white hover:opacity-80 transition-opacity"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--primary)]">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm text-[var(--foreground)] hidden lg:block">
                  {user.name}
                </span>
              </div>
              <button onClick={logout} className={`${btnBase} flex items-center gap-1 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white`}>
                <LogOut size={16} /> 
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login" className={`${btnBase} border border-[var(--foreground)] flex items-center gap-1`}>
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className={`${btnBase} bg-[var(--primary)] text-white flex items-center gap-1`}>
                <UserPlus size={16} /> Register
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end md:hidden">
            <div tabIndex={0} role="button" className="p-2 rounded-full bg-[var(--primary)] text-white">
              <Menu size={22} />
            </div>
            <ul className="dropdown-content menu bg-[var(--card)] rounded-box w-56 shadow-lg mt-2 gap-1 p-2 border border-[var(--border)]">
              {(user ? authLinks : guestLinks).map((link) => (
                <li key={link.title}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                        isActive
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--foreground)] hover:bg-[var(--secondary)]"
                      }`
                    }
                  >
                    {link.icon && <link.icon size={16} />}
                    {link.title}
                  </NavLink>
                </li>
              ))}
              <div className="border-t border-[var(--border)] my-1" />
              {user ? (
                <li>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-500 hover:bg-red-50 w-full"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--secondary)]"
                    >
                      <LogIn size={16} /> Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--foreground)] hover:bg-[var(--secondary)]"
                    >
                      <UserPlus size={16} /> Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
