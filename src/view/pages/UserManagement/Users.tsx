import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleUserActive } from "../../../slices/userSlice";
import type { RootState } from "../../../slices/rootReducer.ts";

export function Users() {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state: RootState) => state.user || { users: [], status: "idle", error: null });

    useEffect(() => {
        dispatch(fetchUsers() as any); // Type assertion to handle AsyncThunkAction
    }, [dispatch]);

    const handleToggleActive = async (userId: string, currentStatus: string) => {
        try {
            const result = await dispatch(toggleUserActive(userId)).unwrap(); // Unwrap the result
            console.log(`User status changed to: ${result.status}`);

            // Update localStorage with the new status
            if (localStorage.getItem("userId") === userId) {
                localStorage.setItem("status", result.status);
            }

            await dispatch(fetchUsers() as any); // Refresh the user list after toggling status
        } catch (error) {
            console.error("Failed to toggle user status:", error); // Handle errors
        }
    };
    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            {users && users.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-800">
                    <thead>
                    <tr>
                        <th className="border border-gray-800 px-4 py-2 bg-red-300">Name</th>
                        <th className="border border-gray-800 px-4 py-2 bg-red-300">Role</th>
                        <th className="border border-gray-800 px-4 py-2 bg-red-300">Email</th>
                        <th className="border border-gray-800 px-4 py-2 bg-red-300">Status</th>
                        <th className="border border-gray-800 px-4 py-2 bg-red-300">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{user.username}</td>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{user.role}</td>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">{user.email}</td>
                            <td className="border border-gray-800 px-4 py-2 bg hover:bg-green-400">
                                {user.status === "active" ? "Active" : "Inactive"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleToggleActive(user.userId,user.status)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    {user.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No users available.</p>
            )}
        </div>
    );
}

export default Users;