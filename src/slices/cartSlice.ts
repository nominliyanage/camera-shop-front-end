import type {CartItem} from "../model/CartItem.ts";
import {createAsyncThunk ,createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {ProductData} from "../model/ProductData.ts";
import {backendApi} from "../api.ts";

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
};

// Fetch cart items for a user
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId: string) => {
    const response = await backendApi.get(`/cart/${userId}/get`);
    return {
        items: response.data.items.map((item: any) => ({
            product: {
                id: item.productId,
                name: item.Name,
                price: item.UnitPrice || 0, // Default to 0 if price is undefined
                currency: "LKR",
            },
            itemCount: item.quantity || 0, // Default to 0 if quantity is undefined
        })),
    };
});

// Save cart item
export const saveCart = createAsyncThunk(
    "cart/saveCart",
    async ({
               userId,
               productId,
               quantity,
               name,
               unitPrice,
               totalPrice,
           }: {
        userId: string;
        productId: string;
        quantity: number;
        name: string;
        unitPrice: number;
        totalPrice: number;
    }) => {
        const validQuantity = Math.max(1, quantity); // Prevent negative values
        const response = await backendApi.post(`/cart/${userId}/save`, {
            productId,
            quantity: validQuantity,
            Name: name,
            UnitPrice: unitPrice,
            TotalPrice: totalPrice,
        });
        console.log("Saving cart item:", {
            userId,
            productId,
            quantity: validQuantity,
            Name: name,
            UnitPrice: unitPrice,
            TotalPrice: totalPrice
        });
        return {productId, quantity: response.data.quantity} // Assuming the API returns the saved item
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({userId, productId, quantity,}: { userId: string; productId: string; quantity: number; }) => {
        const response = await backendApi.put(`/cart/${userId}/update`, {
            productId,
            quantity,
        });
        console.log("Updating cart item:", {userId, productId, quantity});
        return {productId, quantity: response.data.quantity}
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({userId, productId}: { userId: string; productId: string }) => {
        const response = await backendApi.delete(`/cart/${userId}/${productId}/delete` );
            return {productId}; // Assuming the API returns the removed item
    }
);

export const clearCart = createAsyncThunk("cart/clearCart", async (userId: string) => {
    await backendApi.delete(`/cart/${userId}/clear`);
    return {userId, item: []}; // Assuming the API returns a success message or status
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart:(state , action: PayloadAction<ProductData>)=> {
            const existingItem = state.items.find((item) => item.product.id === action.payload.id);
            if (existingItem) {
                existingItem.itemCount += 1; // Increase count if item already exists
            } else {
                state.items.push({
                    product: action.payload,
                    itemCount: 1 // Initialize count to 1 for new items
                });
            }
        },
        increaseQuantity:(state, action: PayloadAction<string>) => {
            const item = state.items.find((item ) => item.product.id === action.payload);
            if (item) {
                item.itemCount += 1;
            }
        },
        decreaseQuantity:(state, action: PayloadAction<string>) => {
            const item = state.items.find((item) => item.product.id === action.payload);
            if (item && item.itemCount > 1) {
                item.itemCount -= 1;
            }
        },
        removeFromCart:(state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.product.id !== action.payload);
        },
        updateItemQuantity:(state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const item = state.items.find((item) => item.product.id === action.payload.productId);
            if (item) {
                item.itemCount = action.payload.quantity;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(saveCart.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                const item = state.items.find((item) => item.product.id === productId);
                if (item) {
                    item.itemCount = quantity; // Update existing item count
                }
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.items = []; // Clear all items in the cart
            });
        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((item) => item.product.id === productId);
            if (item) {
                item.itemCount = quantity; // Update existing item count
            }
            });
        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            const { productId } = action.payload;
            state.items = state.items.filter((item) => item.product.id !== productId); // Remove item from cart
        });
    },
});

export const {
    addItemToCart,
    increaseQuantity,
    decreaseQuantity,
    updateItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;