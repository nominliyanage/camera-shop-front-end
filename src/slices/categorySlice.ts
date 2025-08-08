import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { CategoryData } from "../model/CategoryData";
import { backendApi } from "../api";

interface CategoryState {
    list: CategoryData[];
    error: string | null;
}

const initialState: CategoryState = {
    list: [],
    error: null,
};

// Async Thunks
export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async () => {
        const response = await backendApi.get("/categories/all");
        return response.data;
    }
);

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (category: FormData | Record<string, any>, { rejectWithValue }) => {
        try {
            const response = await backendApi.post("/categories/save", category);
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async (category: FormData) => {
        const response = await backendApi.put(`/categories/update/${category.get("id")}`, category);
        return response.data;
    }
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id: string) => {
        const response = await backendApi.delete(`/categories/delete/${id}`); // Use id as a string
        return response.data;
    }
);

// Slice
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategories.pending, (state: CategoryState) => {
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state: CategoryState, action : any) => {
                state.list = action.payload;
            })
            .addCase(getAllCategories.rejected, (state: CategoryState, action : any) => {
                state.error = action.error.message;
            })
            .addCase(addCategory.fulfilled, (state: CategoryState, action : any) => {
                state.list.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state: CategoryState, action : any) => {
                const index = state.list.findIndex(cat => cat.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state: CategoryState, action : any) => {
                state.list = state.list.filter(cat => cat.id !== action.meta.arg);
            });
    },
});

export default categorySlice.reducer;