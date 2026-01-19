import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const storedExpenses =
      JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(storedExpenses);
  }, []);

  // Calculate totals
  const totalExpense = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const totalIncome = 0; // will be added later
  const balance = totalIncome - totalExpense;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Total Income</p>
          <h2 className="text-xl font-semibold text-green-600">
            ₹{totalIncome}
          </h2>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Total Expense</p>
          <h2 className="text-xl font-semibold text-red-600">
            ₹{totalExpense}
          </h2>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-gray-500">Balance</p>
          <h2 className="text-xl font-semibold">
            ₹{balance}
          </h2>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => navigate("/add-expense")}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          + Add Expense
        </button>
      </div>

      {/* Recent Expenses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Recent Expenses
        </h2>

        {expenses.length === 0 && (
          <p className="text-gray-500 text-sm">
            No expenses added yet
          </p>
        )}

        {expenses.map((exp, index) => (
          <div
            key={index}
            className="flex justify-between items-center border rounded p-4 mb-2"
          >
            <div>
              <p className="font-medium">{exp.category}</p>
              <p className="text-sm text-gray-500">
                {new Date(exp.date).toDateString()}
              </p>
            </div>

            <p className="text-red-600 font-semibold">
              -₹{Number(exp.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
