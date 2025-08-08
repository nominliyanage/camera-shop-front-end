import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../../slices/userSlice.ts";
import { useNavigate } from "react-router-dom";

type FormData = {
    email: string;
};

export function SendOtp() {
    const { register, handleSubmit } = useForm<FormData>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        try {
            await dispatch(sendOtp(data.email)).unwrap();
            alert("OTP sent to your email!");
            // Navigate to ResetPasswordWithOtp page with email as a query parameter
            navigate(`/Reset-password-with-otp?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            console.error(error);
            alert(error || "Error sending OTP");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Send OTP
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className="mt-1 block w-full border border-gray-200 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
}