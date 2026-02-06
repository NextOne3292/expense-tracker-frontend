import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* Fetch categories */
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      setCategories(data.filter(c => c.type === "expense"));
      setLoading(false);
    };

    fetchCategories();
  }, []);

  /* Fetch recent expenses */
  useEffect(() => {
    const fetchRecent = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/expenses?limit=5", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      setRecentExpenses(data);
    };

    fetchRecent();
  }, []);

  /* Input handler */
  const handleChange = e => {
    setExpense(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* Submit */
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

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
        setError(data.message);
        return;
      }

      setRecentExpenses(prev => [data, ...prev.slice(0, 4)]);

      setExpense({
        title: "",
        amount: "",
        category: "",
        date: "",
        note: ""
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Add Expense</h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
          Expense added successfully
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

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
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Save Expense
        </button>
      </form>

      {/* Recent expenses */}
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