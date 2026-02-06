import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../Components/UI/Sidebar/Sidebar";
import AdminHeader from "../Components/UI/Header/AdminHeader";

export default function AdminLayout() {

    return (
        <div className="flex w-full overflow-hidden bg-[#f2f2f2] relative">
            <div
                className={`w-full pb-[90px]  pt-[70px] px-[8px] min-h-screen transition-all duration-300`}
            >
                <AdminHeader />
                <Outlet />
                <Sidebar />
            </div>
        </div>
    );
}
