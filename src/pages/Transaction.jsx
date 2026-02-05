import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        const data = await res.json();

        // backend returns { transactions: [...] } or direct array (depending on your API)
        setTransactions(data.transactions || data);
      } catch {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter(tx => tx.type === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* Filter */}
      <div className="flex gap-4 mb-6">
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

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && filteredTransactions.length === 0 && (
        <p className="text-sm text-gray-400">No transactions found</p>
      )}

      <div className="space-y-3">
        {filteredTransactions.map(tx => (
          <div
            key={tx._id}
            className="flex justify-between items-center border rounded p-4 bg-white"
          >
            <div>
              <p className="font-medium">
                {tx.category?.title || tx.title}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(tx.date).toDateString()}
              </p>
            </div>

            <p className={`font-semibold ${
              tx.type === "expense" ? "text-red-600" : "text-green-600"
            }`}>
              {tx.type === "expense" ? "-" : "+"}₹
              {Number(tx.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;