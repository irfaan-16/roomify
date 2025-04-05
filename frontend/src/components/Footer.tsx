import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white/2 text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Name */}
          <div className="text-xl font-bold mb-4 md:mb-0">
            Roomify<span className="text-blue-400">.</span>
          </div>

          {/* Quick Links */}
          <nav className="flex space-x-6">
            <a href="#" className="hover:text-blue-400">
              Home
            </a>
            <a href="#" className="hover:text-blue-400">
              Features
            </a>
            <a href="#" className="hover:text-blue-400">
              Pricing
            </a>
            <a href="#" className="hover:text-blue-400">
              Contact
            </a>
          </nav>

          {/* Social Media Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaGithub size={20} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Copyright */}
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Roomify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
