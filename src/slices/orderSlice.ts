import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { OrderData } from "../model/OrderData";
import { backendApi } from "../api";

interface OrderState {
    orders: OrderData[];
    status: "idle" | "loading" | "success" | "error";
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    status: "idle",
    error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
    const response = await backendApi.get("/orders");
    return response.data;
});

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state: OrderState) => {
                state.status = "loading";
                state.error = null; // Reset error on new fetch
            })
            .addCase(fetchOrders.fulfilled, (state: OrderState, action) => {
                state.status = "success";
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state: OrderState, action:any) => {
                state.status = "error";
                state.error = action.error.message || "Failed to fetch orders.";
            });
    },
});

export default orderSlice.reducer;