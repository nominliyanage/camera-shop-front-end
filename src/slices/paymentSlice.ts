import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { backendApi } from "../api";
import type { PaymentData } from "../model/PaymentData.ts";

interface PaymentState {
    list: PaymentData[];
    error: string | null;
}

const initialState: PaymentState = {
    list: [],
    error: null,
};

// Async Thunks
export const getAllPayments = createAsyncThunk(
    "payment/getAllPayments",
    async () => {
        console.log("Request received at getAllPayments endpoint");
        const response = await backendApi.get("/payments/all");
        console.log("Response from backend:", response.data);
        return response.data;
    }
);

export const addPayment = createAsyncThunk(
    "payment/addPayment",
    async (payment: Omit<PaymentData, "id" | "paymentId" | "transactionId">, { rejectWithValue }) => {
        try {
            console.log("Request received at addPayment endpoint", payment);
            // Send the payment data to the backend
            const response = await backendApi.post("/payments/create-payment-intent", payment);

            // Return the response data (e.g., clientSecret or payment details)
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updatePayment = createAsyncThunk(
    "payment/updatePayment",
    async (payment: PaymentData) => {
        const response = await backendApi.put(`/payments/update/${payment.id}`, payment);
        return response.data;
    }
);

export const deletePayment = createAsyncThunk(
    "payment/deletePayment",
    async (id: string) => {
        const response = await backendApi.delete(`/payments/delete/${id}`);
        return response.data;
    }
);

// Slice
const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllPayments.pending, (state: PaymentState) => {
                state.error = null;
            })
            .addCase(getAllPayments.fulfilled, (state: PaymentState, action : any) => {
                state.list = action.payload;
            })
            .addCase(getAllPayments.rejected, (state: PaymentState, action : any) => {
                state.error = action.error.message;
            })
            .addCase(addPayment.fulfilled, (state: PaymentState, action : any) => {
                state.list.push(action.payload);
            })
            .addCase(updatePayment.fulfilled, (state: PaymentState, action : any) => {
                const index = state.list.findIndex((payment) => payment.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deletePayment.fulfilled, (state: PaymentState, action : any) => {
                state.list = state.list.filter((payment) => payment.id !== action.meta.arg);
            });

    },
});

export default paymentSlice.reducer;