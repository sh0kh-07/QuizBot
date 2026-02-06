import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

export default function AdminHeader() {
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
        <div className="
            fixed top-0 left-0 right-0 z-30
            flex justify-between items-center
            pt-[10px] px-[10px]
        ">
            {/* Кнопка "Назад" */}
            <Button
                onClick={handleGoBack}
                className="px-4 py-2 rounded-lg
                               bg-black hover:bg-gray-600
                               text-white transition-all
                               flex items-center gap-2"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Orqaga</span>
            </Button>


            {/* Профиль */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="
                        flex items-center gap-2 px-3 py-2 rounded-lg
                        border border-gray-200
                        bg-white hover:bg-gray-50
                        transition-all
                    "
                >
                    <div className="p-1.5 rounded-full bg-gray-100">
                        <User className="w-5 h-5 text-gray-700" />
                    </div>
                </button>

                {/* Dropdown */}
                {openMenu && (
                    <div className="
                        absolute right-0 top-14 w-48
                        bg-white
                        border border-gray-200
                        shadow-lg rounded-lg py-2
                        overflow-hidden
                    ">
                        <button
                            onClick={handleLogout}
                            className="
                                w-full px-4 py-3 text-left text-sm
                                text-red-600 hover:bg-red-50
                                transition-all flex items-center gap-2
                            "
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Chiqish</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}