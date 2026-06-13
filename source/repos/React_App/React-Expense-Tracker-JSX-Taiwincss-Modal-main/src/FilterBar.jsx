export const FilterBar = ({ searchTerm, setSearchTerm, filterOver500k, setFilterOver500k, sortBy, setSortBy }) => {
  return (
    <div className="flex justify-between items-center gap-4 my-6">
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
        <input
        id="search-expenses"
        name="search"
        type="text"
        placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div className="flex gap-2">
        <select 
        id="sort-expenses"
        name="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600 bg-white"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button 
          onClick={() => setFilterOver500k(!filterOver500k)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`border rounded-lg px-4 py-2 text-sm font-medium ${filterOver500k ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
        >
          Over 500k
        </button>
      </div>
    </div>
  );
};