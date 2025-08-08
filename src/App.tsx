import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import {Login} from "./view/pages/Login/Login.tsx";
import {useEffect} from "react";
import {isTokenExpired} from "./auth/auth.ts";
import {Unauthorized} from "./auth/Unauthorized.tsx";
import {Register} from "./view/pages/Register/Register.tsx"; // Import JWT token validation
import {AccountSettings} from "./view/pages/AccountSettings/AccountSettings";
import {SendOtp} from "./view/pages/SendOtp/SendOtp.tsx";
import {ResetPasswordWithOtp} from "./view/pages/ResetPasswordWithOtp/ResetPasswordWithOtp.tsx";

function App() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="/sendOtp" element={<SendOtp />} />
            <Route path="/Reset-password-with-otp" element={<ResetPasswordWithOtp />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/*" element={<DefaultLayout/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/unauthorized" element={<Unauthorized/>}></Route> {/* Define Route for unauthorized access */}
        </Routes>
    );
}
export default App;