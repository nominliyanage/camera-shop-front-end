import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../slices/orderSlice";
import type { RootState } from "../../../store/store.ts";

export function OrderList() {
    const dispatch = useDispatch();
    const { orders, status } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Order Management</h1>
            {status === "loading" ? (
                <p>Loading...</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Customer ID</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                            <td className="px-4 py-2">{order.id}</td>
                            <td className="px-4 py-2">{order.customerId}</td>
                            <td className="px-4 py-2">{order.total}</td>
                            <td className="px-4 py-2">{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}