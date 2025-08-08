import {ModifyCart} from "../ModifyCart/ModifyCart.tsx";
import type {ProductData} from "../../../model/ProductData.ts";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {addItemToCart, saveCart} from "../../../slices/cartSlice.ts";
import {getUserFromToken} from "../../../auth/auth.ts";

type ProductProps = {
    data: ProductData
}

export function Product({ data }: ProductProps) {
    if (!data || !data.id) {
        console.error("Product data is invalid or undefined:", data);
        return <div>Product data is not available.</div>;
    }

    const dispatch = useDispatch<AppDispatch>();
    const item = useSelector((state: RootState) =>
        state.cart.items.find(cartItem => cartItem.product.id === data.id)
    );

    const addToCart = async (event: React.MouseEvent) => {
        event.preventDefault(); // Prevent default behavior
        console.log("Attempting to add to cart:", data);

        try {
            // Dispatch to update the local state
            dispatch(addItemToCart(data));

            const authToken = localStorage.getItem("token");
            if (!authToken) {
                console.error("No authentication token found. Unable to add to cart.");
                return;
            }

            const userData = getUserFromToken(authToken); // Extract user data from token
            if (!userData || !userData.userId) {
                console.error("Invalid user data. Unable to add to cart.");
                return;
            }

            const userId = userData.userId;

            // Dispatch to save the cart to the backend
            await dispatch(
                saveCart({
                    userId,
                    productId: data.id,
                    quantity: 1, // Always add with quantity 1
                    name: data.name,
                    unitPrice: data.price,
                    totalPrice: data.price, // Assuming total price is the same as unit price for quantity 1
                })
            );

            console.log("Item successfully added to cart:", data);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    return (
        <div className="w-65 h-auto mr-2 mb-2 justify-center items-center border-gray-500 border-[1px] p-4 rounded shadow-md bg-white ">
            {/* Name */}
            <h3 className="text-[black] text-[1.2rem] pl-1 font-bold mb-2">{data.name}</h3>

            {/* Image */}
            <div>
                {data.image ? (
                    <img
                        className="h-[230px] w-[200px] object-cover mb-2"
                        src={data.image}
                        alt={data.name}
                    />
                ) : (
                    <div className="h-[140px] w-[200px] bg-gray-600 flex items-center justify-center mb-2">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
            </div>

            {/* Price with Currency */}
            <div className="bg-red-200 p-[1px] rounded-lg pr-1 mb-2 align-middle px-3">
                <h3 className="text-[20px] pl-1 font-medium text-blue-800">
                    {data.price} <small className="text-[15px]">{data.currency}</small>
                </h3>
            </div>

            {/* Description */}
            <div className="text-[1rem] pl-1 mb-2">
                <p>{data.description}</p>
            </div>

            {/* Category */}
            <div className="text-[1rem] pl-1 mb-2">
                <p>Category: {data.category}</p>
            </div>

            {/* Add to Cart or Modify Cart */}
            <div className="flex justify-center">
                {item ? (
                    <ModifyCart data={data} />
                ) : (
                    <button
                        className="bg-gradient-to-r from-green-500 to-green-400 text-white font-medium text-[15px] px-4 py-2 rounded mt-2"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}