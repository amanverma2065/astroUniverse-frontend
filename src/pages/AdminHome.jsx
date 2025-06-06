import React from 'react'
import { AiFillProduct } from "react-icons/ai";
import { FaList } from "react-icons/fa6";
import { MdBookmarkBorder } from "react-icons/md";
import { useAppContext } from '../context/AppContext';
import { NavLink, Outlet } from 'react-router-dom';
import AstrologerRequest from './AstrologerRequest';
import AllAstrologers from './AllAstrologers';
import AllUsers from './AllUsers';
// import websiteLogo from "../assets/Picsart_25-05-25_17-01-48-426.png";


function AdminHome() {
    const { logout } = useAppContext();

    const addProductIcon = (
        <AiFillProduct />
    );

    const productListIcon = (
        <FaList />
    );

    const ordersIcon = (
        <MdBookmarkBorder />
    );

    const sidebarLinks = [
        { name: "All Users", path: "/admin", icon: ordersIcon },
        { name: "All Astrologers", path: "/admin/all-astrologers", icon: addProductIcon },
        { name: "Astrologer Request", path: "/admin/astrologer-request", icon: productListIcon },
        // { name: "Add Product", path: "/admin/add-product", icon: addProductIcon },
        // { name: "Product List", path: "/admin/product-list", icon: productListIcon },
        // { name: "Orders", path: "/admin/orders", icon: ordersIcon },

    ];

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-700 py-3 bg-gray-900 transition-all duration-300">
                <NavLink to="/admin">
                    {/* <img className="w-[140px] md:w-[160px]" src={websiteLogo} alt="dummyLogoColored" /> */}
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AstroUniverse
                    </span>
                </NavLink>
                <div className="flex items-center gap-5 text-gray-300">
                    <button onClick={() => {logout();}} className='border border-gray-600 rounded-full text-sm px-4 py-1 hover:bg-gray-800 transition-colors duration-200'>Logout</button>
                </div>
            </div>
            <div className='flex'>
                <div className="md:w-56 w-16 border-r text-base border-gray-700 pt-4 flex flex-col bg-gray-900">
                    {sidebarLinks.map((item, index) => (
                        <NavLink to={item.path} key={item.name} end={item.path === "/admin"}
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-purple-500/10 border-purple-500 text-purple-400"
                                    : "hover:bg-gray-800 border-gray-700 text-gray-300"
                                }`
                            }
                        >
                            {item.icon}
                            <p className="md:block hidden text-start">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>
        </>
    );
}

export default AdminHome