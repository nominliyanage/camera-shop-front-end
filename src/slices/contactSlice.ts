import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { ContactData } from "../model/ContactData";
import { backendApi } from "../api";

interface ContactState {
    status: "idle" | "loading" | "success" | "error";
    error: string | null;
}

const initialState: ContactState = {
    status: "idle",
    error: null,
};

export const submitContactForm = createAsyncThunk(
    "contact/submitContactForm",
    async (data: ContactData) => {
        const response = await backendApi.post("/contact/save", data);
        return response.data;
    }
);

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitContactForm.pending, (state: ContactState) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(submitContactForm.fulfilled, (state: ContactState) => {
                state.status = "success";
            })
            .addCase(submitContactForm.rejected, (state: ContactState, action:any) => {
                state.status = "error";
                state.error = action.error.message || "Failed to submit the form.";
            });
    },
});

export default contactSlice.reducer;