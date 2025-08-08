import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements} from "@stripe/react-stripe-js";
import type {RootState, AppDispatch} from "../../../store/store.ts";
import { addPayment} from "../../../slices/paymentSlice.ts";
import {
    clearCart,
    fetchCart,
    removeFromCart,
    updateItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    updateCartItem
} from "../../../slices/cartSlice.ts";
import { getUserFromToken, isTokenExpired} from "../../../auth/auth.ts";
import { useNavigate} from "react-router-dom";

const stripePromise = loadStripe("pk_test_51R6ZgFKiBxldEfFS2fX0YC3riyZE1M5C8oFqG239MAcBiLl6TqyoKtzPsqiiXEV5ilYkqRYHvn8hnvqY5EdNfR8L00weOUntYV");

const CheckoutForm = ({ totalAmount}: { totalAmount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe or Elements is not available");
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
            console.error("Card Number Element is not available");
            return;
        }

        try {
            const authToken = localStorage.getItem("token");

            if (!authToken || isTokenExpired(authToken)) {
                alert("You must be logged in to proceed with payment.");
                return;
            }

            const userData = getUserFromToken(authToken);
            const userId = userData.userId;
            const email = userData.email;

            if (!userId){
                alert("Unable to retrieve user information.");
                return;
            }

            const paymentData = {
                amount: totalAmount,
                currency: "LKR",
                paymentMethod: "card",
                status: "pending",
                userId,
                createdAt: new Date(),
                email,
            };

            const result = await dispatch(addPayment(paymentData)).unwrap();

            const { paymentIntent, error } = await stripe.confirmCardPayment(result.clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                },
            });

            if (error) {
                alert("Payment failed!");
            } else if (paymentIntent.status === "succeeded") {
                const transactionId = paymentIntent.id;
                const paymentId = paymentIntent.charges?.data[0]?.id;

                const updatedPaymentData = {
                    ...paymentData,
                    status: "completed",
                    transactionId,
                    paymentId,
                };

                await dispatch(addPayment(updatedPaymentData));

                alert("Payment successful!");
                dispatch({type: "cart/clearCart"}); // Clear the cart after successful payment
                navigate("/");
                window.location.reload(); // Reload the page to reflect changes
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-screen-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="w-100">
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <CardNumberElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
                                color: "#424770",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                    className="border border-gray-300 rounded p-3 w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <CardExpiryElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
                                color: "#424770",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                    className="border border-gray-300 rounded p-3 w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">CVC</label>
                <CardCvcElement
                    options={{
                        style: {
                            base: {
                                fontSize: "18px",
                                color: "#424770",
                                letterSpacing: "0.025em",
                                fontFamily: "Arial, sans-serif",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                    className="border border-gray-300 rounded p-3 w-full"
                />
            </div>
            <button
                type="submit"
                disabled={!stripe || !elements}
                className="bg-gradient-to-r from-green-500 to-green-500 text-white px-8 py-4 rounded w-full text-lg"
            >
                Pay Now
            </button>
        </form>
    );
};

export function ShoppingCart() {
    const {items} = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const authToken = localStorage.getItem("token");
        if (authToken) {
            const userData = getUserFromToken(authToken);
            const userId = userData.userId;
            console.log("Fetching cart for user:", userId, "with token:", authToken, "useData:", userData);
            dispatch(fetchCart(userId));
            console.log("Cart fetched successfully for user:", userId);
        }
    }, [dispatch]);

    const totalAmount = items.reduce(
        (total, item) => total + item.product.price * item.itemCount, 0);

    const handleRemoveItem = async (productId: string) => {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
            console.error("Auth token is missing.");
            return;
        }

        const userData = getUserFromToken(authToken);
        const userId = userData.userId;

        if (!userId || !productId) {
            console.error("User ID Product ID is undefined.");
            return;
        }

        // Dispatch the action to remove the item from the cart
        await dispatch(removeFromCart({userId, productId}));

        // fetch the updated cart
        dispatch(fetchCart(userId));
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 0) {
            dispatch(removeFromCart(productId));
        }
    };


    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-4 font-sans bg-gradient-to-r from-white-500 to-white-400 text-center">Shopping Cart</h1>
            <table className="min-w-full border-collapse mb-4 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <thead>
                <tr className="border-b bg-red-700 text-white">
                    <th className="px-6 py-4 text-left text-lg font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Unit Price</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Quantity</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Total Price</th>
                    <th className="px-6 py-4 text-left text-lg font-bold">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item) => {
                    if (!item || !item.product) {
                        console.error("Invalid item:", item);
                        return null;
                    }
                    return (
                        <tr key={item.product.id}>
                            <td>{item.product.name}</td>
                            <td className="px-6 py-4 text-m">
                                {item.product.price} {item.product.currency}
                            </td>
                            <td className="px-6 py-4 text-m flex items-center">
                                <button
                                    onClick={async () => {
                                        const newQuantity = item.itemCount - 1;
                                        if (newQuantity >= 0) {
                                            const authToken = localStorage.getItem("token");
                                            if (authToken) {
                                                const userData = getUserFromToken(authToken);
                                                const userId = userData.userId;

                                                await dispatch(updateCartItem({
                                                    userId,
                                                    productId: item.product.id,
                                                    quantity: newQuantity,
                                                }));
                                                await dispatch(fetchCart(userId)); // Fetch updated cart
                                            }
                                        }
                                    }}
                                >
                                    -
                                </button>
                                <span className="mx-2">{item.itemCount}</span>
                                <button
                                    onClick={async () => {
                                        const newQuantity = item.itemCount + 1;
                                        const authToken = localStorage.getItem("token");
                                        if (authToken) {
                                            const userData = getUserFromToken(authToken);
                                            const userId = userData.userId;

                                            await dispatch(updateCartItem({
                                                userId,
                                                productId: item.product.id,
                                                quantity: newQuantity,
                                            }));
                                            await dispatch(fetchCart(userId)); // Fetch updated cart
                                        }
                                    }}
                                >
                                    +
                                </button>
                            </td>
                            <td className="px-6 py-4 text-m">
                                {(item.product.price * item.itemCount).toFixed(2)} {item.product.currency}
                            </td>
                            <td className="px-6 py-4 text-m">
                                <button onClick={() => handleRemoveItem(item.product.id)}>🗑️</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">
                    Total Amount: {totalAmount.toFixed(2)} {items[0]?.product.currency}
                </h2>
                <Elements stripe={stripePromise}>
                    <CheckoutForm totalAmount={totalAmount}/>
                </Elements>
            </div>
        </div>
    );
}