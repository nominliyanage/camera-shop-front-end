import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '../../../store/store.ts';
import {decreaseQuantity, fetchCart, increaseQuantity, saveCart} from '../../../slices/cartSlice.ts';
import type {ProductData} from '../../../model/ProductData.ts';
import {getUserFromToken} from '../../../auth/auth.ts';

interface ModifyCartProps {
    data: any;
}

export function ModifyCart({data}: ModifyCartProps) {
    const dispatch = useDispatch<AppDispatch>();
    const item = useSelector((state: RootState) =>
        state.cart.items.find(cartItem => cartItem.product.id === data.id));

    const decreaseItemCount = async () => {
        if (!item || item.itemCount <= 1) return;

        const authToken = localStorage.getItem('token');
        if (!authToken) {
            console.error('Auth token is missing.');
            return;
        }
        const userData = getUserFromToken(authToken);
        const userId = userData?.userId;

        if (!userId) {
            console.error('User ID is missing.');
            return;
        }
        try {
            // Dispatch decreaseQuantity and wait for the state to update
            await dispatch(decreaseQuantity(data.id));

            // Use the existing `item` to calculate the new quantity
            const newQuantity = item.itemCount - 1;

            // Dispatch saveCart with the updated quantity
            await dispatch(saveCart({
                userId,
                productId: data.id,
                quantity: newQuantity,
                name: data.name,
                unitPrice: data.price,
                totalPrice: newQuantity * data.price,
            }));

            // Fetch the updated cart to ensure UI reflects the correct state
            await dispatch(fetchCart(userId));
        } catch (error) {
            console.error('Error updating cart:', error);
        }

    };

    const increaseItemCount = async () => {
        if (!item) return;

        const authToken = localStorage.getItem('token');
        if (!authToken) {
            console.error('Auth token is missing.');
            return;
        }
        const userData = getUserFromToken(authToken);
        const userId = userData?.userId;

        if (!userId) {
            console.error('User ID is missing.');
            return;
        }
        try {
            // Dispatch increaseQuantity and wait for the state to update
            await dispatch(increaseQuantity(data.id));

            // Use the existing `item` to calculate the new quantity
            const newQuantity = item.itemCount + 1;

            // Dispatch saveCart with the updated quantity
            await dispatch(saveCart({
                userId,
                productId: data.id,
                quantity: newQuantity,
                name: data.name,
                unitPrice: data.price,
                totalPrice: newQuantity * data.price,
            }));

            // Fetch the updated cart to ensure UI reflects the correct state
            await dispatch(fetchCart(userId));
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };


    return (
        <div className="w-full mt-4 p-[1px] text-[8px] font-bold text-center">
            <button
                className="float-left text-[20px] font-bold bg-yellow-300 rounded-lg h-7 w-9"
                onClick={decreaseItemCount}
            >
                -
            </button>
            <small className="text-[20px]">{item?.itemCount}</small>
            <button
                className="float-right text-[20px] font-bold bg-yellow-300 rounded-lg h-7 w-9"
                onClick={increaseItemCount}
            >
                +
            </button>
        </div>
    );
}