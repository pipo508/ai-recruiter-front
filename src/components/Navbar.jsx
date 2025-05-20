import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[85%] lg:w-[75%] bg-[rgba(9,22,42,0.94)] backdrop-blur-lg text-white py-4 px-8 rounded-3xl shadow-xl flex justify-between items-center z-50 transition-all duration-300">
      <Link to="/" className="flex items-center space-x-3 text-4xl font-extrabold text-white tracking-wide">
        <span>AI Talent</span>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 text-lg items-center">
        {user ? (
          <>
            <li><Link to="/" className="hover:text-blue-500 transition duration-300">Buscar</Link></li>
            <li><Link to="/results" className="hover:text-blue-500 transition duration-300">Candidatos</Link></li>
            <li><Link to="/upload" className="hover:text-blue-500 transition duration-300">Subir Curriculums</Link></li>
            <li><Link to="/documentlist" className="hover:text-blue-500 transition duration-300">Ver Curriculums</Link></li>
            <li className="text-sm text-blue-400">{user.username} (ID: {user.id})</li>
            <li>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="hover:text-blue-500 transition duration-300">Iniciar Sesión</Link></li>
            <li><Link to="/register" className="hover:text-blue-500 transition duration-300">Registrarse</Link></li>
          </>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white focus:outline-none">
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-[rgba(9,22,42,0.94)] backdrop-blur-lg shadow-xl flex flex-col items-center space-y-6 py-8 transition-all duration-300 ${menuOpen ? 'block' : 'hidden'}`}>
        {user ? (
          <>
            <Link to="/" className="text-xl hover:text-blue-500 transition duration-300">Buscar</Link>
            <Link to="/results" className="text-xl hover:text-blue-500 transition duration-300">Candidatos</Link>
            <Link to="/upload" className="text-xl hover:text-blue-500 transition duration-300">Subir Curriculums</Link>
            <div className="text-xl text-blue-400">{user.username} (ID: {user.id})</div>
            <button
              onClick={logout}
              className="text-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-xl hover:text-blue-500 transition duration-300">Iniciar Sesión</Link>
            <Link to="/register" className="text-xl hover:text-blue-500 transition duration-300">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;