import { useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, deleteProduct, getAllProducts } from "../../../slices/productSlice.ts";
import { getAllCategories } from "../../../slices/categorySlice";
import type { AppDispatch, RootState } from "../../../store/store";

interface productData {
    id?: string;
    name: string;
    price: number;
    category: string;
    description: string;
    currency: string;
    image?: File | string; // URL for existing images
}

export function AddProducts() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();

    const categories = useSelector((state: RootState) => state.category.list || []);

    const [formData, setFormData] = useState<productData>({
        name: "",
        price: 0,
        currency: "LKR",
        category: "",
        description: "",
        image: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        dispatch(getAllCategories());
        if (location.state && location.state.product) {
            const product = location.state.product;
            setFormData({
                ...product,
                category: typeof product.category === "object" ? product.category.id : product.category,
            });
        }
    }, [location.state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            // setIsUploading(true); // Start the upload process
            const timestamp = Math.round(new Date().getTime() / 1000);
            try {
                const response = await fetch("http://localhost:3000/api/cloudinary/signature", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({timestamp}),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch cloudinary signature");
                }

                const { signature } = await response.json();

                const uploadData = new FormData();
                uploadData.append("file", files[0]);
                uploadData.append("upload_preset", "my_preset"); // Replace with your Cloudinary preset
                uploadData.append("api_key", "524965941769252")
                uploadData.append("timestamp", timestamp.toString());
                uploadData.append("signature", signature);

                const  uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dln8mdday/image/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload image to Cloudinary");
                }

                const data = await uploadResponse.json();

                if (data.secure_url) {
                    setFormData((prevState) => ({...prevState, image: data.secure_url}));
                    console.log("New Image URL set in formData:", data.secure_url);
                } else {
                    throw new Error("secure_url not found in Cloudinary response");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.image || typeof formData.image !== "string") {
                console.error("Image URL is missing is formData");
                return;
            }

            const selectedCategory = categories.find((cat) => cat.id === formData.category);
            if (!selectedCategory) {
                console.error("Selected category not found");
                return;
            }

            const formPayload = {
                id: formData.id || undefined,
                name: formData.name,
                price: formData.price,
                currency: formData.currency,
                description: formData.description,
                category: selectedCategory.name,
                image: formData.image,
            };

            if (formData.id) {
                await dispatch(updateProduct(formPayload));
            } else {
                await dispatch(addProduct(formPayload));
            }
            navigate("/manage-products", { state: { reload: true}}); // pass reload state
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{formData.id ? "Update Product" : "Add Product"}</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <label className="block text-sm font-medium">Name</label>
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
                    <label className="block text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Currency</label>
                    <input
                        type="text"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
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
                            alt="Product"
                            className="w-40 h-40 object-cover mt-2"
                        />
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {formData.id ? "Update Product" : "Add Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}