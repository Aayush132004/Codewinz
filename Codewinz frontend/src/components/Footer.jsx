// src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#08080a] text-gray-500 py-12 mt-auto border-t border-[#18181c] z-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-sm tracking-wide text-zinc-400">
          Made with ❤️ by <span className="text-white font-medium">Aayush</span>
        </p>
        <p className="text-xs text-zinc-500">
          Contact me: <a href="mailto:aayushsharma132004@gmail.com" className="text-zinc-400 hover:text-white transition-colors underline decoration-zinc-700 hover:decoration-white">aayushsharma132004@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;