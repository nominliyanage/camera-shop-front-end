import {useEffect, useState} from "react";
import {Product} from "../../common/Product/Product.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {getAllProducts} from "../../../slices/productSlice.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import {fetchCart} from "../../../slices/cartSlice.ts";

export function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const {list } = useSelector((state: RootState) => state.products);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [nameFilter, setNameFilter] = useState("");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");

    useEffect(() => {
        const fetchProductsAndCart = async () => {
            try {
                const authToken = localStorage.getItem("token");
                if (!authToken) {
                    console.error("No auth token found. Unable to fetch products.");
                    return;
                }
                const userData = getUserFromToken(authToken);
                const userId = userData.userId;

                await dispatch(getAllProducts());
                await dispatch(fetchCart(userId)); // Fetch updated cart
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchProductsAndCart();
    }, [dispatch]);
    // Get unique categories from the product list
    const categories = ["All", ...new Set(list.map((product) => product.category))];

    // Filter products based on the selected category, name, and price range
    const filteredProducts = list
        .filter((product) => product && product.id && product.name) // Ensure valid product data
        .filter((product) => {
            const matchesCategory =
                selectedCategory === "All" || product.category === selectedCategory;
            const matchesName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesPrice =
                (minPrice === "" || product.price >= minPrice) &&
                (maxPrice === "" || product.price <= maxPrice);
            return matchesCategory && matchesName && matchesPrice;
        });

    return (
        <div>
            {/* Filter Options */}
            <div className="mb-4 p-4 bg-gradient-to-r from-red-200 via-red-200 to-red-200 rounded flex gap-20rounded flex gap-4">
                {/* Category Selection Dropdown */}
                <div>
                    <h2 className="text-xl font-bold mb-2">Filter by Category</h2>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
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
            <div className="flex flex-wrap justify-center items-center mx-auto">
                {filteredProducts
                    .filter((product) => product && product.id && product.name) // Ensure valid product data
                    .map((product) => {
                        console.log("Rendering product:", product);
                        return <Product key={product.id} data={product} />;
                    })}
            </div>
        </div>
    );
}

export default Home;