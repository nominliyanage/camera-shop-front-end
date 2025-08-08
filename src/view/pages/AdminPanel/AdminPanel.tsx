import { useEffect, useState} from "react";
import { getAllProducts } from "../../../slices/productSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { getAllCategories } from "../../../slices/categorySlice.ts";

export function AdminPanel() {
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
        const matchesPrice =
            (minPrice === "" || product.price >= minPrice) &&
            (maxPrice === "" || product.price <= maxPrice);
        return matchesCategory && matchesName && matchesPrice;
    });

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading indicator while data is being fetched
    }

    return (
        <div>
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
            <div
                className="flex flex-wrap ml-[1px] mt-6 mb-5
                            justify-center items-center mx-auto"
            >
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="w-65 h-120 mr-2 mb-2 justify-center items-center border-gray-500 border-[1px] p-4 rounded shadow-md bg-white"
                    >
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="text-m text-blue-800">
                            {getCategoryName(product.category)}
                        </p>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-50 h-50 bject-cover mt-0.5"
                            />
                        ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                            </div>
                        )}
                        <p className="text-m text-gray-600 mt-2">{product.description}</p>
                        <p className="text-lg text-red-600 mt-2">{product.price} {product.currency}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}