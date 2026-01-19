const AddIncome = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Income</h1>

      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <select className="w-full border rounded p-2">
            <option>Select category</option>
            <option>Salary</option>
            <option>Business</option>
            <option>Freelance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Note</label>
          <textarea
            placeholder="Optional note"
            className="w-full border rounded p-2"
          ></textarea>
        </div>

        <button
          type="button"
          className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800"
        >
          Save Income
        </button>
      </form>
    </div>
  );
};

export default AddIncome;

       
