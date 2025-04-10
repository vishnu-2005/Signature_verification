import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">SignSecure</Link>
      </h1>
      <div
        className="hamburger-menu"
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "show" : ""}>
        {user ? (
          <li
            className="welcome-container"
            onClick={toggleDropdown}
          >
            <span>Welcome, {user}</span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </button>
                <Link
                  to="/verify-signature"
                  className="dropdown-link"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Verification page
                </Link>
              </div>
            )}
          </li>
        ) : (
          <li>
            <Link
              to="/signin"
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
