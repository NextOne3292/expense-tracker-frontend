import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* 🔊 success sound */
const successSound = new Audio("/success.mp3");

const Transactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* -------- Fetch transactions -------- */
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/transactions${
          filter !== "all" ? `?type=${filter}` : ""
        }`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load transactions");
        return;
      }

      setTransactions(data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  /* -------- Delete -------- */
  const handleDelete = async (tx) => {
    if (!window.confirm("Delete this transaction?")) return;

    const url =
      tx.type === "income"
        ? `http://localhost:3000/api/income/${tx._id}`
        : `http://localhost:3000/api/expenses/${tx._id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      successSound.currentTime = 0;
      successSound.play();

      toast.success("Transaction deleted");
      fetchTransactions();
    } catch {
      toast.error("Server error");
    }
  };

  /* -------- Edit -------- */
  const handleEdit = (tx) => {
    if (tx.type === "income") {
      navigate(`/add-income?edit=${tx._id}`);
    } else {
      navigate(`/add-expense?edit=${tx._id}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && transactions.length === 0 && (
        <p className="text-sm text-gray-400">No transactions found</p>
      )}

      <div className="space-y-4">
        {transactions.map(tx => (
          <div
            key={tx._id}
            className="border rounded p-4 bg-white"
          >

            {/* Header */}
            <div className="flex justify-between">
              <h3 className="font-semibold">{tx.title}</h3>
              <span
                className={`font-medium ${
                  tx.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}₹
                {Number(tx.amount).toLocaleString()}
              </span>
            </div>

            {/* Meta */}
            <div className="text-sm text-gray-500 mt-1 flex gap-2 items-center">
              <span>{new Date(tx.date).toLocaleDateString()}</span>

              {tx.category && (
                <span
                  className="px-2 py-0.5 rounded text-white text-xs"
                  style={{ backgroundColor: tx.category.color }}
                >
                  {tx.category.title}
                </span>
              )}
            </div>

            {/* Note */}
            {tx.note && (
              <p className="text-sm text-gray-700 mt-2">
                📝 {tx.note}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-3 text-sm">
              <button
                onClick={() => handleEdit(tx)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tx)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;