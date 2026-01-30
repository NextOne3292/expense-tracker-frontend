import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("expense");
  const [color, setColor] = useState("#3b82f6");

  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Category title required");
      return;
    }

    const url = editingId
      ? `http://localhost:3000/api/categories/${editingId}`
      : "http://localhost:3000/api/categories";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: title.trim(),
        type,
        color
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Action failed");
      return;
    }

    resetForm();
    fetchCategories();
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setTitle(cat.title);
    setType(cat.type);
    setColor(cat.color || "#3b82f6");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await fetch(`http://localhost:3000/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchCategories();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setType("expense");
    setColor("#3b82f6");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-5 mb-8 space-y-4"
      >
        <input
          placeholder="Category name (eg: Food, Rent, Salary)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 border p-2 rounded"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 border rounded cursor-pointer"
          />
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {editingId ? "Update Category" : "Add Category"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 border p-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <div
              key={cat._id}
              className="flex justify-between items-center bg-white shadow-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />

                <span className="font-medium">{cat.title}</span>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    cat.type === "expense"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {cat.type}
                </span>
              </div>

              {!cat.isDefault && (
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
