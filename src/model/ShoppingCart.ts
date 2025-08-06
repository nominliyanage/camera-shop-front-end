import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
    productId: string;
    quantity: number;
}

export interface ShoppingCart extends Document {
    userId: string;
    items: CartItem[];
}

const ShoppingCartSchema = new Schema<ShoppingCart>({
    userId: { type: String, required: true, unique: true },
    items: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
});

export const ShoppingCartModel = mongoose.model<ShoppingCart>('ShoppingCart', ShoppingCartSchema);