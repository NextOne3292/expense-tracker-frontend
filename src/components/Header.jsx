import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const navigate = useNavigate();

  // check auth status on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">
          <Link to="/" className="hover:text-slate-300 transition">
            Track<span className="text-slate-300">Wise</span>
          </Link>
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {!isAuth ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium hover:text-slate-300 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-slate-300 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:text-slate-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 px-6 py-4 space-y-4">
          {!isAuth ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
