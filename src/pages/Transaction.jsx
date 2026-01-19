const Transactions = () => {
  const transactions = [
    {
      id: 1,
      title: "Salary",
      amount: 25000,
      type: "income",
      date: "2025-12-01",
    },
    {
      id: 2,
      title: "Food",
      amount: 500,
      type: "expense",
      date: "2025-12-02",
    },
    {
      id: 3,
      title: "Travel",
      amount: 1200,
      type: "expense",
      date: "2025-12-03",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {/* Filter row */}
      <div className="flex gap-4 mb-6">
        <select className="border rounded p-2">
          <option>All</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
      </div>

      {/* Empty state */}
      {transactions.length === 0 && (
        <p className="text-sm text-gray-400">No transactions found</p>
      )}

      {/* Transaction list */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center border rounded p-4"
          >
            <div>
              <p className="font-medium">{transaction.title}</p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>

            <p
              className={
                transaction.type === "income"
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {transaction.type === "income" ? "+" : "-"}₹
              {transaction.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
