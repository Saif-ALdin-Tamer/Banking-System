import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { Bell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/transactions", label: "Transactions" },
        { path: "/transfer", label: "Transfer" },
        { path: "/profile", label: "Profile" },
        { path: "/mycard", label: "My Card" },
    ];

    return (
        <motion.div initial={{y: -50, opacity: 0}} animate={{y: 0, opacity: 1}}
        transition={{duration: 0.6}}
        className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100/60">
            
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-xl">
                        <span className="text-xl">🏦</span>
                    </div>
                    <h1 className="text-xl font-extrabold tracking-wide text-slate-800">
                        Bank
                    </h1>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2">
                    {user ? (
                        <>
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} 
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                                        location.pathname === link.path 
                                            ? "bg-slate-800 text-white" 
                                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <Link to="/notifications" className="relative group ml-2">
                                <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 0.95}}
                                className="p-2 rounded-full hover:bg-slate-100 transition-all relative">
                                    <Bell size={20} className="text-slate-500" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                                </motion.div>
                            </Link>

                            <button onClick={handleLogout} className="ml-3 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium text-sm transition-all">
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg transition-all">
                                Login
                            </Link>
                            <Link to="/register" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg font-medium transition-all">
                                Create Account
                            </Link>
                        </>
                    )}
                </div> 


                <div className="md:hidden flex items-center gap-3">
                    {user && (
                        <Link to="/notifications" className="relative">
                            <motion.div whileTap={{scale: 0.9}} 
                            className="p-2 rounded-full hover:bg-slate-100 transition-all relative">
                                <Bell size={20} className="text-slate-500" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                            </motion.div>
                        </Link>
                    )}
                    <button onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="text-slate-600 text-2xl focus:outline-none">
                        {isMobileMenuOpen ? <HiX /> : <HiMenu />}
                    </button>
                </div>

            </div> 


            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}}
                    exit={{height:0, opacity:0}} transition={{duration:0.3}} className="md:hidden bg-white border-t border-slate-100 shadow-lg overflow-hidden">
                        <div className="flex flex-col px-6 py-4 gap-2">
                            {user ? (
                                <>
                                    {navLinks.map((link)=>(
                                        <Link key={link.path} to={link.path}
                                        onClick={()=> setIsMobileMenuOpen(false)} 
                                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            location.pathname === link.path 
                                                ? "bg-slate-800 text-white" 
                                                : "text-slate-500 hover:bg-slate-100"
                                        }`}>
                                            {link.label}
                                        </Link>
                                    ))}
                                    <button onClick={handleLogout} className="mt-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-lg font-medium text-sm transition-all">
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-slate-500 hover:bg-slate-100 px-4 py-2.5 rounded-lg transition-all">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all">
                                        Create Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
