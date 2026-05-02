import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Header() {
  const [session, setSession] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/' && !location.hash) return true;
    if (path.startsWith('/#') && location.hash === path.substring(1)) return true;
    if (path === '/collections' && location.pathname === '/collections') return true;
    return false;
  };

  const NavLink = ({ href, text }) => {
    const isHash = href.startsWith('/#');
    const active = isActive(href);
    
    // Luxury dark typography: bright white/gray for high contrast against dark bg
    const baseStyle = "relative text-[12px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 py-2 group";
    const activeStyle = active ? "text-gold" : "text-gray-300 hover:text-gold";

    const content = (
      <>
        {text}
        {/* Bold gold underline */}
        <span className={`absolute bottom-0 left-0 h-[2px] bg-gold transition-all duration-500 ${active ? 'w-full' : 'w-0 group-hover:w-full shadow-[0_0_8px_rgba(212,175,55,0.6)]'}`}></span>
      </>
    );

    return isHash ? (
      <a href={href} onClick={closeMenu} className={`${baseStyle} ${activeStyle}`}>
        {content}
      </a>
    ) : (
      <Link to={href} onClick={closeMenu} className={`${baseStyle} ${activeStyle}`}>
        {content}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-6 z-50 px-4 sm:px-6 lg:px-8 mb-6">
        {/* Deep Charcoal Pill Container with Gold Glow */}
        <div className="max-w-[1200px] mx-auto bg-[#080808]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(212,175,55,0.12),0_0_15px_rgba(212,175,55,0.05)] border border-gold/40 rounded-full px-6 sm:px-10 h-[64px] sm:h-[72px] flex justify-between items-center transition-all duration-500">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center z-50">
            <Link to="/" className="text-2xl sm:text-[28px] font-serif font-bold tracking-widest text-white hover:text-gray-200 flex items-center group transition-colors duration-300" onClick={closeMenu}>
              Bhairavnath<span className="text-gold text-3xl opacity-90 -mb-2 ml-0.5 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">.</span>
            </Link>
          </div>

          {/* Center Navigation Links (Hidden on tablet/mobile) */}
          <nav className="hidden lg:flex space-x-12 items-center absolute left-1/2 -translate-x-1/2 mt-1">
            <NavLink href="/" text="Home" />
            <NavLink href="/collections" text="Collections" />
            <NavLink href="/#about" text="About" />
            <NavLink href="/#contact" text="Contact" />
          </nav>

          {/* Utilities / CTA (Right) */}
          <div className="hidden lg:flex items-center space-x-8 z-50">
            {session ? (
              <div className="flex items-center space-x-6">
                {session.user.email === 'anshpatel8780@gmail.com' && (
                  <Link to="/admin" className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-gold transition-colors px-2">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-red-500 transition-colors px-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center bg-transparent border-[1.5px] border-gold text-gold hover:bg-gold hover:text-[#080808] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] px-8 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden z-50 text-gold p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Premium Dark Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#080808]/98 backdrop-blur-2xl z-40 flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center space-y-10">
          <NavLink href="/" text="Home" />
          <NavLink href="/collections" text="Collections" />
          <NavLink href="/#about" text="About" />
          <NavLink href="/#contact" text="Contact" />
          
          <div className="w-16 h-[2px] bg-gold/40 my-6 shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
          
          {session ? (
            <div className="flex flex-col items-center space-y-8">
              {session.user.email === 'anshpatel8780@gmail.com' && (
                <Link to="/admin" onClick={closeMenu} className="text-sm uppercase tracking-[0.2em] font-bold text-gold">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="text-sm uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-red-500">Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={closeMenu} className="bg-gold text-[#080808] px-12 py-3 rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
