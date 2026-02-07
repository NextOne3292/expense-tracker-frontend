import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* 🔊 success sound */
const successSound = new Audio("/success.mp3");

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
  const [recentIncome, setRecentIncome] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------- Fetch income categories -------- */
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3000/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setCategories(data.filter(cat => cat.type === "income"));
      } catch {
        toast.error("Failed to load income categories");
      }
    };

    fetchCategories();
  }, []);

  /* -------- Fetch recent income -------- */
  useEffect(() => {
    const fetchRecentIncome = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:3000/api/income",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) return;

        const data = await res.json();
        setRecentIncome(data.slice(0, 5));
      } catch {
        // silent fail
      }
    };

    fetchRecentIncome();
  }, []);

  /* -------- Input handler -------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncome(prev => ({ ...prev, [name]: value }));
  };

  /* -------- Submit -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...income,
          amount: Number(income.amount)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add income");
        return;
      }

      /* 🔊 play success sound */
      successSound.currentTime = 0;
      successSound.play();

      toast.success("Income added successfully");

      setRecentIncome(prev => [data, ...prev.slice(0, 4)]);

      setIncome({
        title: "",
        amount: "",
        category: "",
        date: "",
        note: ""
      });

    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Add Income</h1>

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

        {/* ✅ GREEN button */}
        <button
          type="submit"
          disabled={loading || categories.length === 0}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Income"}
        </button>
      </form>

      {/* -------- Recent Income -------- */}
      {recentIncome.length > 0 && (
        <div className="mt-8">

          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Income</h2>

            <button
              onClick={() => navigate("/transactions?type=income")}
              className="text-blue-600 text-sm hover:underline"
            >
              See all
            </button>
          </div>

          {recentIncome.map(inc => (
            <div key={inc._id} className="flex justify-between border-b py-2">
              <span>{inc.title}</span>
              <span className="text-green-600 font-medium">
                ₹{inc.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddIncome;