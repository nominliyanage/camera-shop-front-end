import './App.css';
import {Route, Routes, useNavigation} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import {Login} from "./view/pages/Login/Login.tsx";
import {useEffect} from "react";
import {isTokenExpired} from "./auth/auth.ts";
import {Unauthorized} from "./auth/Unauthorized.tsx";

function App() {
    const navigation = useNavigation();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigation("/login");
        }
    }, [navigation]);

    return (
        <Routes>
            <Route path="/*" element={<DefaultLayout/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/unauthorized" element={<Unauthorized/>}></Route> {/* Define Route for unauthorized access */}
        </Routes>
    );
}
export default App;