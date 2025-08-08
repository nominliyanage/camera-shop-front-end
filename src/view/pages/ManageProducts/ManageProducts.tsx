import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { deleteProduct, getAllProducts } from "../../../slices/productSlice.ts";
import { getAllCategories } from "../../../slices/categorySlice.ts";

export function ManageProducts() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.products);
    const categories = useSelector((state: RootState) => state.category.list || []);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [nameFilter, setNameFilter] = useState("");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");

    useEffect(() => {
        // Fetch products and categories
        const fetchData = async () => {
            await dispatch(getAllCategories());
            await dispatch(getAllProducts());
            setIsLoading(false); // Set loading to false after data is fetched
        };
        fetchData();
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                alert("Product deleted successfully!");
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product. Please try again.");
            }
        }
    };

    const handleUpdate = (product: any) => {
        navigate("/add-product", { state: { product } });
    };

    // Helper function to get category name by ID
    const getCategoryName = (category: string | { name: string }) => {
        if (typeof category === "string") {
            const foundCategory = categories.find((cat) => cat.name === category || cat.id === category);
            return foundCategory ? foundCategory.name : "Unknown Category";
        } else if (typeof category === "object" && category.name) {
            return category.name;
        }
        return "Unknown Category";
    };

    // Filter products based on the selected category, name, and price range
    const filteredProducts = list.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" || product.category === selectedCategory;
        const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesMinPrice =
            (minPrice === "" || product.price >= minPrice) &&
            (maxPrice === "" || product.price <= maxPrice);
        return matchesCategory && matchesName && matchesMinPrice;
    });

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator while data is being fetched
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <button
                    onClick={() => navigate("/add-product")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Product
                </button>
            </div>

            {/* Filter Options */}
            <div className="mb-4 p-4 bg-gradient-to-r from-red-200 via-red-200 to-red-200 rounded flex gap-20">
                {/* Category Selection Dropdown */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Filter by Category</h2>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="All">All</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Name Filter Input */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Filter by Name</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>

                {/* Price Range Filter */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Filter by Price Range</h2>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value ? +e.target.value : "")}
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value ? +e.target.value : "")}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Display Filtered Products */}
            <div className="flex flex-wrap ml-[1px] mt-6 mb-5 justify-center items-center mx-auto ">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="w-70 h-auto mr-2 mb-2 justify-center items-center border-gray-500 border-[1px] p-4 rounded shadow-md bg-white hover:shadow-2xl transition-shadow duration-300"
                    >
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-55 object-cover mb-2"
                            />
                        )}
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="text-m text-red-600">Price: {product.price} {product.currency}</p>
                        <p className="text-m text-black">Category: {getCategoryName(product.category)}</p>
                        <p className="text-sm text-gray-800">{product.description}</p>
                        <div className="mt-2 flex justify-between">
                            <button
                                onClick={() => handleUpdate(product)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}