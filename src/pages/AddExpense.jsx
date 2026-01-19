import { useEffect, useState } from "react";

const AddExpense = () => {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: ""
  });

  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const successSound = new Audio("/success.mp3");

  /* ---------------- Fetch Expense Categories ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/categories?type=expense",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        // IMPORTANT: handle both array or wrapped response
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- Handle Input Change ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setExpense((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* ---------------- Handle Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!expense.category) {
      setError("Please select a category");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: expense.title.trim(),
          amount: Number(expense.amount),
          category: expense.category,
          date: expense.date,
          note: expense.note.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add expense");
        return;
      }

      successSound.play();
      setSuccess(true);

      setExpense({
        title: "",
        amount: "",
        category: "",
        date: "",
        note: ""
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Expense</h1>

      {success && (
        <p className="text-green-600 font-medium mb-4">
          Expense added successfully
        </p>
      )}

      {error && (
        <p className="text-red-600 font-medium mb-4">
          {error}
        </p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Expense Name */}
        <div>
          <label className="block text-sm mb-1">Expense Name</label>
          <input
            type="text"
            name="title"
            value={expense.title}
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="e.g. Lunch at cafe"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select
            name="category"
            value={expense.category}
            onChange={handleChange}
            className="w-full border p-2 max-h-40 overflow-y-auto"
            required
          >
            <option value="">Select category</option>

            {categories.length === 0 && (
              <option disabled>No categories found</option>
            )}

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm mb-1">Note</label>
          <textarea
            name="note"
            value={expense.note}
            onChange={handleChange}
            className="w-full border p-2"
            placeholder="Optional note"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
