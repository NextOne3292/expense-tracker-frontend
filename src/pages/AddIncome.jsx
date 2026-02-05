import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddIncome = () => {
  const navigate = useNavigate();

  const [income, setIncome] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: ""
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* -------- Fetch categories -------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        const incomeCategories = data.filter(
          cat => cat.type?.toLowerCase() === "income"
        );

        setCategories(incomeCategories);
      } catch {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  /* -------- Input handler -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncome(prev => ({ ...prev, [name]: value }));
  };

  /* -------- Submit -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!income.category) {
      setError("Select a category");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: income.title.trim(),
          amount: Number(income.amount),
          category: income.category,
          date: income.date,
          note: income.note.trim()
        })
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add income");
        return;
      }

      setSuccess(true);

      setIncome({
        title: "",
        amount: "",
        category: "",
        date: "",
        note: ""
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Income</h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          Income added successfully
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && categories.length === 0 && (
        <div className="border border-dashed rounded-lg p-6 text-center bg-gray-50 mb-6">
          <p className="text-lg font-semibold text-gray-700">
            No income categories yet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Create an income category first
          </p>

          <button
            onClick={() => navigate("/categories")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            type="button"
          >
            + Add Category
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Income source"
          value={income.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={income.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          min="0.01"
          step="0.01"
          required
        />

        <select
          name="category"
          value={income.category}
          onChange={handleChange}
          disabled={categories.length === 0}
          className="w-full border p-2 rounded disabled:bg-gray-100"
          required
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={income.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="note"
          placeholder="Note (optional)"
          value={income.note}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={categories.length === 0}
          className="w-full bg-slate-900 text-white p-3 rounded hover:bg-slate-800 disabled:opacity-50"
        >
          Save Income
        </button>
      </form>
    </div>
  );
};

export default AddIncome;
