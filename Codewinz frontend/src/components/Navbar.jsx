import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../authSlice";
import { Settings, LogOut, User, Shield, ChevronDown } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    dispatch(logoutUser());
  };

  const navigateAndClose = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-[#1c1c22] shadow-lg' 
        : 'bg-[#0a0a0c]/70 backdrop-blur-lg border-b border-[#1c1c22]/30'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Left: Enhanced Logo */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              {user?.profile && (
                <img 
                  src="/logo.png" 
                  className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
                  alt="Logo"
                />
              )}
              <span className="text-xl font-bold text-white tracking-tight hover:text-gray-300 transition-colors">
                CodeWinz
              </span>
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Admin Panel Button */}
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="group px-4 py-2 bg-[#1c1c22] hover:bg-[#282830] text-gray-200 text-sm font-medium rounded-lg border border-[#2e2e38] transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-slate-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Admin Panel</span>
                </div>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-[#141416]/60 hover:bg-[#1c1c22]/80 border border-[#222226] hover:border-[#2e2e34] transition-all duration-300 group shadow-md"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full ring-2 ring-[#2e2e38] group-hover:ring-[#3e3e48] transition-all duration-300 overflow-hidden">
                    <img
                      alt="User Avatar"
                      src={user?.profile ? user.profile : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user?.emailId || 'user')}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-white">{user?.firstName || 'User'}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-72 bg-[#0e0e11]/95 backdrop-blur-xl border border-[#1c1c22] rounded-xl shadow-2xl z-20 overflow-hidden">
                    
                    {/* User Info Header */}
                    <div className="p-4 bg-[#141418] border-b border-[#1c1c22]">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full ring-2 ring-[#2e2e38] overflow-hidden">
                          <img
                            alt="User Avatar"
                            src={user?.profile || '/default-avatar.png'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{user?.firstName || 'User'}</div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px]">{user?.email}</div>
                          {user?.role && (
                            <div className="inline-flex items-center px-2 py-0.5 mt-1 text-[10px] font-semibold bg-[#222226] text-slate-300 rounded-full border border-[#2e2e34]">
                              {user.role}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5">
                      <button
                        onClick={() => navigateAndClose('/profile')}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-[#18181c] rounded-lg transition-all duration-300 group"
                      >
                        <div className="p-1.5 bg-[#18181c] rounded-md border border-[#222226] group-hover:bg-[#222228] transition-all duration-300">
                          <User className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Profile</div>
                        </div>
                      </button>

                      <button
                        onClick={() => navigateAndClose('/setting')}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-[#18181c] rounded-lg transition-all duration-300 group"
                      >
                        <div className="p-1.5 bg-[#18181c] rounded-md border border-[#222226] group-hover:bg-[#222228] transition-all duration-300">
                          <Settings className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Settings</div>
                        </div>
                      </button>

                      <div className="my-2 border-t border-[#1c1c22]"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-red-500/10 rounded-lg transition-all duration-300 group"
                      >
                        <div className="p-1.5 bg-red-500/10 rounded-md border border-red-500/20 group-hover:bg-red-500/20 transition-all duration-300">
                          <LogOut className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-red-400 group-hover:text-red-300">Logout</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
