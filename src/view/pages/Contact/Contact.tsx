import {useForm} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { submitContactForm } from "../../../slices/contactSlice.ts";
import type { ContactData } from "../../../model/ContactData.ts";

export function Contact() {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();
    const dispatch = useDispatch<AppDispatch>();
    const {status, error} = useSelector((state: RootState) => state.contact);

    const onSubmit = (data: ContactData) => {
        dispatch(submitContactForm(data));
    }

    return (
        <div className="max-w-screen-lg mx-35 mt-10 p-18 bg-gradient-to-r from-red-400 via-red-400 to-red-400 rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="p-2 rounded border border-black-500"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address",
                            },
                        })}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        className="p-2 rounded border border-black-500"
                        {...register("subject", {
                            required: "Subject is required",
                            minLength: {
                                value: 5,
                                message: "Subject must be at least 5 characters long",
                            },
                        })}
                    />
                    {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        className="p-2 rounded border border-black-500"
                        {...register("message", { required: "Message is required" })}
                    />
                    {errors.message && <span className="text-red-500 text-sm">Message is required</span>}
                </div>
                <button type="submit" className="bg-green-400 text-black-800 px-4 py-2 rounded hover:bg-green-600">
                    Submit
                </button>
            </form>
            {status === "loading" && <p>Submitting...</p>}
            {status === "success" && <p>Form submitted successfully!</p>}
            {status === "error" && <p className="text-red-500">Error: {error}</p>}
        </div>
    );
}