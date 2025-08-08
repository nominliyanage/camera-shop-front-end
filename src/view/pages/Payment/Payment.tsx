import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPayments } from "../../../slices/paymentSlice";

export function Payment() {
    const dispatch = useDispatch();
    const { list: payments, error } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(getAllPayments());
    }, [dispatch]);

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Payments</h1>
            {payments && payments.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-800">
                    <thead>
                    <tr>
                        <th className="border border-gray-800 px-4 py-2 bg-green-300">Payment ID</th>
                        <th className="border border-gray-800 px-4 py-2 bg-green-300">Amount</th>
                        <th className="border border-gray-800 px-4 py-2 bg-green-300">Currency</th>
                        <th className="border border-gray-800 px-4 py-2 bg-green-300">Status</th>
                        <th className="border border-gray-800 px-4 py-2 bg-green-300">User Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((payment) => (
                        <tr key={payment._id}>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{payment.paymentId}</td>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{payment.amount}</td>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{payment.currency}</td>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{payment.status}</td>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{payment.userId?.email || "N/A"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No payments available.</p>
            )}
        </div>
    );
}

export default Payment;