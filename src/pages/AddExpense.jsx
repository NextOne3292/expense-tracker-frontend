import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* 🔊 success sound (public/success.mp3) */
const successSound = new Audio("/success.mp3");

const AddExpense = () => {
  const navigate = useNavigate();

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: ""
  });

  const [categories, setCategories] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch categories ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3000/api/categories", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setCategories(data.filter(cat => cat.type === "expense"));
      } catch {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- Fetch recent expenses ---------------- */
  useEffect(() => {
    const fetchRecentExpenses = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:3000/api/expenses?limit=5",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) return;

        const data = await res.json();
        setRecentExpenses(data);
      } catch {
        // silent fail (not critical)
      }
    };

    fetchRecentExpenses();
  }, []);

  /* ---------------- Input handler ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...expense,
          amount: Number(expense.amount)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add expense");
        return;
      }

      /* 🔊 play success sound */
      successSound.currentTime = 0;
      successSound.play();

      toast.success("Expense added successfully");

      setRecentExpenses(prev => [data, ...prev.slice(0, 4)]);

      setExpense({
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

      <h1 className="text-2xl font-bold mb-4">Add Expense</h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="title"
          placeholder="Expense name"
          value={expense.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="category"
          value={expense.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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
          value={expense.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="note"
          placeholder="Note (optional)"
          value={expense.note}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </form>

      {/* ---------------- Recent Expenses ---------------- */}
      {recentExpenses.length > 0 && (
        <div className="mt-8">

          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Expenses</h2>

            <button
              onClick={() => navigate("/transactions?type=expense")}
              className="text-blue-600 text-sm hover:underline"
            >
              See all
            </button>
          </div>

          {recentExpenses.map(exp => (
            <div key={exp._id} className="flex justify-between border-b py-2">
              <span>{exp.title}</span>
              <span className="text-red-600 font-medium">
                ₹{exp.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddExpense;