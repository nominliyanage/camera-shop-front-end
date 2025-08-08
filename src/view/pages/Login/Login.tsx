import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {backendApi} from "../../../api.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import type {UserData} from "../../../model/UserData.ts";
import {fetchCart} from "../../../slices/cartSlice.ts";
import {useDispatch} from "react-redux";

type FormData = {
    username: string;
    password: string;
};

export function Login() {
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm<FormData>();
    const dispatch = useDispatch();

    const authenticateUser = async (data: FormData) => {
        try {
            const userCredentials = {
                username: data.username,  // assuming your backend uses "username" for email
                password: data.password
            };

            const response = await backendApi.post('/auth/login', userCredentials);
            console.log("Login response:", response.data);
            const user: UserData = getUserFromToken(response.data.accessToken);

            // Check if the user's status is inactive
            if (user.status === "inactive") {
                alert("You can't log in. Admin has restricted your account.");
                return; // Stop further execution
            }

            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            localStorage.setItem('username', user.username as string);
            localStorage.setItem('role', user.role as string);
            localStorage.setItem('userId', user.userId as string);
            localStorage.setItem('image', response.data.user.image as string);
            localStorage.setItem('email', user.email as string);
            localStorage.setItem('status', user.status || 'active'); // Default to 'active' if status is not set

            // Dispatch fetchCart to load cart details
            dispatch(fetchCart(user.userId));

            alert("Successfully logged in!");
            if (user.role === 'customer') {
                navigate('/');
            } else if (user.role === 'admin') {
                navigate('/admin-panel')
            }
        } catch (error) {
            console.error(error);
            alert("You can't log in. Admin has restricted your account.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Sign In
                </h2>
                <div className="mt-1 mb-4">
                    <button onClick={() => navigate("/")}
                            className="text-sm text-green-600 hover:text-green-900 underline">
                        Go Back
                    </button>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(authenticateUser)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register("username")}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="username"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign In
                    </button>
                    <div className="text-m text-center text-green-600">
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-medium text-lg rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate("/sendOtp")}
                            className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-medium text-lg rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}