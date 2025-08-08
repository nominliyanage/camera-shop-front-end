import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategories } from "../../../slices/categorySlice.ts";
import type { AppDispatch, RootState } from "../../../store/store.ts";

export function ManageCategory() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { list } = useSelector((state: RootState) => state.category);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await dispatch(deleteCategory(id)).unwrap();
                alert("Category deleted successfully!");
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category. Please try again.");
            }
        }
    };

    const handleUpdate = (category: any) => {
        navigate("/add-category", { state: { category } });
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Categories</h1>
                <button
                    onClick={() => navigate("/add-category")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Category
                </button>
            </div>
            <div className="flex flex-wrap ml-[1px] mt-6 mb-5 justify-center items-center mx-auto bg-red-200">
                {list.map((category) => (
                    <div
                        key={category.id}
                        className="w-70 h-80 mr-2 mb-2 justify-center items-center border-gray-500 border-[1px] p-4 rounded shadow-md bg-gradient-to-r from-red-100 via-red-100 to-red-100"
                    >
                        <h3 className="text-lg font-bold">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        {category.image && (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-40 object-cover mt-2"
                            />
                        )}
                        <div className="mt-2 flex justify-between">
                            <button
                                onClick={() => handleUpdate(category)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}