import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { UserData } from "../model/UserData";
import { backendApi } from "../api";

interface UserState {
    users: UserData[];
    status: "idle" | "loading" | "success" | "error";
    error: string | null;
}

const initialState: UserState = {
    users: [],
    status: "idle",
    error: null,
};

export const fetchUsers = createAsyncThunk(
    "users/getAllUsers",
    async () => {
        const response = await backendApi.get("/auth/all");
        console.log("Response received at fetchUsers endpoint", response.data);
        return response.data;
    }
);

export const toggleUserActive = createAsyncThunk(
    "users/toggleUserActive",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await backendApi.post(`/users/${userId}/toggle-active`, { userId });
            console.log("Response received at toggleUserActive endpoint", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addUser = createAsyncThunk(
    "users/addUser",
    async (user: FormData | Record<string, any>, { rejectWithValue }) => {
        try {
            console.log("Request received at addUser endpoint", user);
            const response = await backendApi.post("/auth/register", user);
            console.log("Response received at addUser endpoint", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (user: UserData, { rejectWithValue }) => {
        try {
            const response = await backendApi.put(`/auth/update/${user.userId}`, user);
            return response.data;
        } catch (error: any) {
            console.error("Backend error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id: string) => {
        const response = await backendApi.delete(`/users/delete/${id}`);
        return response.data;
    }
);

export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await backendApi.post("/auth/request-password-reset", { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error sending password reset email");
        }
    }
);

export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, newPassword }: { token: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await backendApi.post("/auth/reset-password", { token, newPassword });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error resetting password");
        }
    }
);

export const sendOtp = createAsyncThunk(
    "user/sendOtp",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await backendApi.post("/auth/send-otp", { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error sending OTP");
        }
    }
);

export const resetPasswordWithOtp = createAsyncThunk(
    "user/resetPasswordWithOtp",
    async ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await backendApi.post("/auth/reset-password-with-otp", { email, otp, newPassword });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error resetting password with OTP");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state:UserState) => {
                state.status = "loading";
            })
            .addCase(fetchUsers.fulfilled, (state:UserState, action:any) => {
                state.status = "success";
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state:UserState, action:any) => {
                state.error = action.error.message || "Failed to fetch users";
            });
        builder
            .addCase(addUser.fulfilled, (state:UserState, action:any) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state:UserState, action:any) => {
                const index = state.users.findIndex(user => user.userId === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state:UserState, action:any) => {
                state.users = state.users.filter(user => user.userId !== action.payload.id);
            });
        builder
            .addCase(toggleUserActive.fulfilled, (state:UserState, action:any) => {
                const updatedUser = action.payload;
                const userIndex = state.users.findIndex(user => user.userId === updatedUser.userId);
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser.state;
                }
            });
        builder
            .addCase(forgotPassword.fulfilled, (state:UserState, action:any) => {
                console.log("Password reset email sent successfully", action.payload);
            })
            .addCase(forgotPassword.rejected, (state:UserState, action:any) => {
                state.error = action.payload || "Failed to send password reset email";
            });
        builder
            .addCase(resetPassword.fulfilled, (state:UserState, action:any) => {
                console.log("Password reset successfully", action.payload);
            })
            .addCase(resetPassword.rejected, (state:UserState, action:any) => {
                state.error = action.payload || "Failed to reset password";
            });
    },
});

export default userSlice.reducer;