//import './Navbar.css';
import icon from '../../../assets/logo.png';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { FaUserCircle, FaCog, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";

export function Navbar() {
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserName = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        const storedImage = localStorage.getItem("image");

        setUsername(storedUserName);
        setRole(storedRole);
        setImage(storedImage);
    }, []);

    const handleLogout = () => {
        // Clear user session
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setUsername(null);
        setRole(null);

        // Redirect to login page
        navigate("/login");
    };

    return (
        <div className="p-2 bg-gradient-to-r from-red-500 via-red-500 to-red-500 shadow-lg flex justify-between items-center">
            <div className="flex items-center p-0.5">
                <h1 className="text-3xl text-[#e6f0e6] hover:text-green-950 font-bold">
                    Glamor Shot
                </h1>
                <img className="h-[2.5rem] w-[2.5rem] ml-2" src={icon} alt="" />
            </div>
            <ul className="list-none flex gap-10 mt-0.5 mb-1">
                {/* Customer-only links */}
                {role === 'customer' && (
                    <>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/about">About</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/shopping-cart">My-Cart</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}

                {/* Admin-only links */}
                {role === 'admin' && (
                    <>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950 ">
                            <Link to="/admin-panel">Admin Panel</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/manage-products">Manage Products</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/manage-category">Manage Category</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/payments">Payments</Link>
                        </li>
                        <li className="text-[1.5rem] text-[#e6f0e6] hover:text-red-950">
                            <Link to="/users">Users</Link>
                        </li>
                    </>
                )}
            </ul>

            <div className="flex items-center space-x-4">
                {username ? (
                    <>
                        <p className="text-2xl text-white hover:text-red-950">{username}</p>
                        {image && (
                            <img
                                src={image}
                                alt="User Avatar"
                                className="h-[2.5rem] w-[2.5rem] rounded-full"
                            />
                        )}
                        <FaCog
                            className="text-2xl text-white cursor-pointer hover:text-red-950"
                            onClick={() => navigate("/account-settings")}
                        />
                        <button
                            onClick={handleLogout}
                            className="text-[1.5rem] text-[#e6f0e6] bg-red-600 py-0.1 px-1
                            rounded-lg border-white border-2 hover:bg-red-700 hover:text-white"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="text-[1.5rem] text-[#e6f0e6] bg-[#1f9e4b] py-2 px-4
                        rounded-lg border-white border-2 hover:bg-red-400"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Navbar;