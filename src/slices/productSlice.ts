import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {ProductData} from '../model/ProductData.ts';
import {backendApi} from '../api.ts';

interface ProductState {
    list: ProductData[];
    error: string | null | undefined;
}

//// Initial state for the product slice
const initialState: ProductState = {
    list: [],
    error: null
};

export const getAllProducts = createAsyncThunk(
    'products/getAllProducts',
    async () => {
        const response = await backendApi.get('/products/all');
        return await response.data;
        console.error('Error fetching products:', response.data);
    }
)

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (product: FormData | Record<string, any>, { rejectWithValue }) => {
        try {
            const response = await backendApi.post('/products/save', product);
            return response.data;
        } catch (error: any) {
            console.error('Backend error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (product: ProductData, { rejectWithValue }) => {
        try {
            console.log('Request received at updateProduct endpoint', product);

            // Validate the product ID format (e.g., PROD<number>)
            if (!product.id || !/^PROD\d+$/.test(product.id)) {
                throw new Error('Invalid product ID format.');
            }

            const response = await backendApi.put(`/products/update/${product.id}`, product);
            return response.data;
        } catch (error: any) {
            console.error('Backend error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id: string) => {
        const response = await backendApi.delete(`/products/delete/${id}`);
        return await response.data;
    }
);

// Import necessary modules from Redux Toolkit
const productSlice = createSlice({
    name: 'product',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handle the getAllProducts async thunk
        builder.addCase(getAllProducts.pending, (state:ProductState) => {
            alert('Products are still loading..');
            state.error = null; // Reset error state
        }).addCase(getAllProducts.fulfilled, (state: ProductState, action:any) => {
            state.list = action.payload;
        }).addCase(getAllProducts.rejected, (state:ProductState, action:any) => {
            state.error = action.error.message;
            alert('Error loading: ' + state.error);
        })
        builder
            .addCase(updateProduct.fulfilled, (state: ProductState, action:any) => {
                const index = state.list.findIndex((prod) => prod.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload; // Update the product in the list

                }
            });
        builder
            .addCase(deleteProduct.fulfilled, (state: ProductState, action:any) => {
                state.list = state.list.filter((product) => product.id !== action.meta.arg);
            });
    }
});

export default productSlice.reducer;