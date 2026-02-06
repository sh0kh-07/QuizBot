import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown, Menu, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export default function AdminHeader({ active, sidebarOpen, showBackButton = false, ...props }) {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    // Закрытие меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="
                fixed top-[10px] z-30 flex justify-between items-center
                mb-6 px-6 py-2 rounded-2xl border
                backdrop-blur-xl bg-white/50
                border-white/30 shadow-lg
                transition-all duration-300
            "
            style={{
                width: sidebarOpen ? "calc(99% - 240px)" : "91%",
                left: sidebarOpen ? "240px" : "120px",
            }}
        >
            {/* Левая часть */}
            <div className="flex items-center gap-3">
                <Button
                    onClick={active}
                    className="px-4 py-3 rounded-xl
                               bg-blue-500/90 hover:bg-blue-600
                               text-white transition-all"
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Кнопка "Назад" */}
                {showBackButton && (
                    <Button
                        onClick={handleGoBack}
                        className="px-4 py-3 rounded-xl
                                   bg-gray-500/90 hover:bg-gray-600
                                   text-white transition-all
                                   flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Orqaga</span>
                    </Button>
                )}
            </div>

            {/* Правая часть */}
            <div className="flex items-center gap-4">
                {/* Профиль */}
                <div className="relative flex items-center gap-4" ref={menuRef}>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="
                            flex items-center gap-3 px-4 py-1 rounded-xl
                            border border-white/40 shadow-sm
                            bg-white/60 hover:bg-white/80
                            backdrop-blur-lg
                            transition-all text-sm font-medium text-gray-800
                        "
                    >
                        <div className="p-2 rounded-full bg-white/70">
                            <User className="w-4 h-4" />
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${openMenu ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Dropdown */}
                    {openMenu && (
                        <div
                            className="
                                absolute right-0 top-16 w-48
                                bg-white/70 backdrop-blur-xl
                                border border-white/40
                                shadow-xl rounded-xl py-2 z-50
                                overflow-hidden
                            "
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/70"></div>

                            <button
                                onClick={() => navigate("/profile")}
                                className="
                                    w-full px-4 py-3 text-left text-sm
                                    text-gray-700 hover:bg-white/60
                                    transition-all flex items-center gap-2
                                "
                            >
                                <User className="w-4 h-4" />
                                <span>Profil</span>
                            </button>

                            <div className="h-px my-1 bg-white/40"></div>

                            <button
                                onClick={handleLogout}
                                className="
                                    w-full px-4 py-3 text-left text-sm
                                    text-red-600 hover:bg-red-50/60
                                    transition-all flex items-center gap-2
                                "
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    )}
                    {props.children}
                </div>
            </div>
        </div>
    );
}