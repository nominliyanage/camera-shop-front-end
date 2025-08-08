import {combineReducers} from "redux";
import productReducer from './productsSlice.ts';
import cartReducer from './cartSlice.ts';
import userReducer from './userSlice.ts';
import contactReducer from './contactSlice.ts';
import categoryReducer from './categorySlice.ts';
import paymentReducer from './paymentSlice.ts';

export const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
    user: userReducer,
    contact: contactReducer,
    category: categoryReducer,
    payment: paymentReducer
});

export type RootState = ReturnType<typeof rootReducer>;