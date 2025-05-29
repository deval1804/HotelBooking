import React from 'react';
import Navbar from '../../components/HotelOwner/Navbar';
import Sidebar from '../../components/HotelOwner/Sidebar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
    return (
        <div className="flex flex-col h-screen">

            <Navbar />
            {/* Sidebar and Outlet side by side */}
            <div className="flex h-full">
                <Sidebar />
                <div className="flex-1 p-4 pt-10 h-full overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;