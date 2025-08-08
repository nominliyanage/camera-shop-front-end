import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCategory, updateCategory } from "../../../slices/categorySlice.ts";
import type { AppDispatch } from "../../../store/store.ts";

interface CategoryData {
    id?: string;
    name: string;
    description: string;
    image?: File | string; // File for new uploads, string for existing images
}

export function AddCategory() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CategoryData>({
        name: "",
        description: "",
        image: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (location.state && location.state.category) {
            setFormData(location.state.category);
        }
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const timestamp = Math.round(new Date().getTime() / 1000);

            try {
                // Fetch signature from the backend
                const response = await fetch("http://localhost:3000/api/cloudinary/signature", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timestamp }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Cloudinary signature");
                }

                const { signature } = await response.json();

                const uploadData = new FormData();
                uploadData.append("file", files[0]);
                uploadData.append("upload_preset", "my_preset");
                uploadData.append("api_key", "524965941769252");
                uploadData.append("timestamp", timestamp.toString());
                uploadData.append("signature", signature);

                // Upload to Cloudinary
                const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dln8mdday/image/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image to Cloudinary");
                }

                const data = await uploadResponse.json();

                // Set the image URL in formData
                if (data.secure_url) {
                    setFormData((prevState) => ({...prevState, image: data.secure_url }));
                    console.log("New Image URL set in formData:", data.secure_url);
                } else {
                    throw new Error("Secure URL not found in cloudinary response");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure the image URL is present
            if (!formData.image || typeof formData.image !== "string") {
                console.error("Image URL is required");
                return;
            }

            const formPayload = new FormData();
            formPayload.append("name", formData.name);
            formPayload.append("description", formData.description);

            // Append the image URL
            formPayload.append("image", formData.image);

            if (formData.id) {
                // Update existing category
                formPayload.append("id", formData.id);
                await dispatch(updateCategory(formPayload));
            } else {
                // Add new category
                await dispatch(addCategory(formPayload));
            }

            navigate("/manage-category");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{formData.id ? "Update Category" : "Add Category"}</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <label className="block text-sm font-medium">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="border p-2 w-full"
                    />
                    {typeof formData.image === "string" && formData.image && (
                        <img
                            src={formData.image}
                            alt="Category"
                            className="w-40 h-40 object-cover mt-2"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {formData.id ? "Update Category" : "Add Category"}
                </button>
            </form>
        </div>
    );
}