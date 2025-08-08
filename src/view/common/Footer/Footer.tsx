import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png';
import { useLocation } from "react-router-dom";

export function Footer() {
    const location = useLocation();

    // Do not display the footer on the Register page
    if (location.pathname === "/register") {
        return null;
    }

    return (
        <footer className="bg-white border-t border-gray-200 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-lg-gray-900">
            <div className="max-w-screen-xl mx-auto p-4">
                <div className="flex flex-wrap items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img className="w-16 h-16 cursor-pointer rounded-full" src={logo} alt="logo" />
                        <span className="text-2xl font-semibold whitespace-nowrap dark:text-white dark:hover:text-black">Glamor Shot</span>
                    </Link>
                    <ul className="flex flex-wrap gap-6 mt-4 md:mt-0">
                        {/*<li><Link className="text-lg font-semibold text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500" to="/">Home</Link></li>*/}
                        <li><Link className="text-lg font-semibold text-gray-900 hover:text-black dark:text-white dark:hover:text-black" to="/about">About</Link></li>
                        <li><Link className="text-lg font-semibold text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-black" to="/contact">Contact</Link></li>
                        <li><Link className="text-lg font-semibold text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-black" to="/services">Services</Link></li>
                    </ul>
                </div>
                <div className="text-center text-gray-500 mt-6 dark:text-gray-950">
                    <p className="text-sm">© 2025 Glamor Shot. All rights reserved.</p>
                    <p className="text-sm">Privacy Policy | Terms of Service</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;