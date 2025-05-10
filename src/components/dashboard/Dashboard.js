import { PlusCircle } from 'lucide-react';
import { TEXT_COLORS } from '../../constants';
import FilterSection from './FilterSection';
import ChartSection from './ChartSection';
import ObjectiveList from '../objectives/ObjectiveList';

export default function Dashboard({
  setActiveTab,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  dateRangeFilter,
  setDateRangeFilter,
  resetFilters,
  chartData,
  filteredObjectives,
  objectives,
  handleEditObjective,
  handleDeleteObjective,
  handleUpdateKeyResult
}) {
  return (
    <div className="space-y-8">
      {/* Dashboard header */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${TEXT_COLORS.primary}`}>OKR Dashboard</h2>
        <button 
          onClick={() => setActiveTab('add')}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          <span>New Objective</span>
        </button>
      </div>
      
      {/* Filter section */}
      <FilterSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRangeFilter={dateRangeFilter}
        setDateRangeFilter={setDateRangeFilter}
        resetFilters={resetFilters}
      />

      {filteredObjectives.length > 0 ? (
        <>
          {/* Charts section */}
          <ChartSection chartData={chartData} />

          {/* Objectives list */}
          <ObjectiveList 
            filteredObjectives={filteredObjectives}
            objectives={objectives}
            handleEditObjective={handleEditObjective}
            handleDeleteObjective={handleDeleteObjective}
            handleUpdateKeyResult={handleUpdateKeyResult}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className={`text-xl font-medium ${TEXT_COLORS.primary} mb-2`}>No objectives match your filters</h3>
          <p className={`${TEXT_COLORS.secondary} mb-6`}>Try adjusting your filters or create a new objective</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-900 placeholder-gray-500"
            >
              Reset Filters
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add New Objective
            </button>
          </div>
        </div>
      )}
    </div>
  );
}