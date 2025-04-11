import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[85%] lg:w-[75%] bg-[rgb(255, 255, 255)] backdrop-blur-lg text-white py-4 px-8 rounded-3xl shadow-xl flex justify-between items-center z-50 transition-all duration-300">
      <a href="/" className="flex items-center space-x-3 text-4xl font-extrabold text-white-500 tracking-wide ">
        <span>AI Talent</span>
      </a>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 text-lg">
        <li><a href="/" className="hover:text-blue-500 transition duration-300">Buscar</a></li>
        <li><a href="/results" className="hover:text-blue-500 transition duration-300">Candidatos</a></li>
        <li><a href="#" className="hover:text-blue-500 transition duration-300">Contacto</a></li>
      </ul>

      {/* Mobile Menu Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white focus:outline-none">
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-[rgba(9,22,42,0.94)] backdrop-blur-lg shadow-xl flex flex-col items-center space-y-6 py-8 transition-all duration-300 ${menuOpen ? 'block' : 'hidden'}`}>
        <a href="/" className="text-xl hover:text-blue-500 transition duration-300">Inicio</a>
        <a href="/" className="text-xl hover:text-blue-500 transition duration-300">Buscar</a>
        <a href="/results" className="text-xl hover:text-blue-500 transition duration-300">Candidatos</a>
        <a href="#" className="text-xl hover:text-blue-500 transition duration-300">Contacto</a>
      </div>
    </nav>
  );
}

export default Navbar;
