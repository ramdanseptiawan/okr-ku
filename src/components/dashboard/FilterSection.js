import { Search, Calendar } from 'lucide-react';
import { CATEGORIES } from '../../constants';

export default function FilterSection({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  statusFilter, 
  setStatusFilter, 
  dateRangeFilter, 
  setDateRangeFilter, 
  resetFilters 
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          Reset Filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search objectives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>
        
        {/* Category filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Status filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="In Progress">In Progress</option>
            <option value="At Risk">At Risk</option>
            <option value="Off Track">Off Track</option>
            <option value="Overachieved">Overachieved</option>
          </select>
        </div>
        
        {/* Date range filter (start and end in one cell) */}
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRangeFilter.start}
            onChange={(e) => setDateRangeFilter({...dateRangeFilter, start: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          />
          <input
            type="date"
            value={dateRangeFilter.end}
            onChange={(e) => setDateRangeFilter({...dateRangeFilter, end: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  );
}