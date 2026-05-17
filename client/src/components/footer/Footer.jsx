import { Link } from "react-router-dom";
import { Car, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--foreground)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[var(--primary)] p-2 rounded-xl">
                <Car className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold">Car Rental</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for premium car rentals. We offer a wide range
              of vehicles at competitive prices with exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/cars", label: "Available Cars" },
                { to: "/login", label: "Login" },
                { to: "/register", label: "Register" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-gray-400 hover:text-[var(--primary)] text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-white/10 p-3 rounded-full hover:bg-[var(--primary)] transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Stay connected for the latest offers and updates.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          &copy; {currentYear} Car Rental. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
