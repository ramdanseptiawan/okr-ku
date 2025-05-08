"use client";
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, Circle, Edit, Trash2, PlusCircle, Calendar, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

// Color constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#4ECDC4', '#45B7D1'];
// Remove dark mode variants, use only dark text on white background
const TEXT_COLORS = {
  primary: 'text-gray-900',
  secondary: 'text-gray-700',
  light: 'text-gray-500',
};

// Status badges for visual clarity
const StatusBadge = ({ progress }) => {
  let color, text;
  
  if (progress > 100) {
    color = 'bg-purple-100 text-purple-800 border-purple-200';
    text = 'Overachieved';
  } else if (progress >= 80) {
    color = 'bg-green-100 text-green-800 border-green-200';
    text = 'On Track';
  } else if (progress >= 50) {
    color = 'bg-blue-100 text-blue-800 border-blue-200';
    text = 'In Progress';
  } else if (progress >= 25) {
    color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    text = 'At Risk';
  } else {
    color = 'bg-red-100 text-red-800 border-red-200';
    text = 'Off Track';
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${color}`}>
      {text}
    </span>
  );
};

export default function OKRTracker() {
  const [objectives, setObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState({ 
    title: '', 
    description: '', 
    keyResults: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    category: 'Business'
  });
  const [newKeyResult, setNewKeyResult] = useState({ title: '', target: 100, current: 0 });
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // New state for filtering and time range
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
    end: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]  // End of current year
  });
  
  // Categories for OKRs
  const categories = ['Business', 'Product', 'Engineering', 'Marketing', 'Personal'];

  // Calculate overall progress for an objective based on its key results
  // Allow for overachievement (>100%) for individual KRs, but cap objective progress at 100% by default
  const calculateObjectiveProgress = (keyResults, allowOverachievement = false) => {
    if (keyResults.length === 0) return 0;
    
    const totalProgress = keyResults.reduce((sum, kr) => {
      // Calculate individual KR progress, allowing for >100%
      const krProgress = (kr.current / kr.target) * 100;
      return sum + krProgress;
    }, 0);
    
    const avgProgress = Math.round(totalProgress / keyResults.length);
    // Only cap at 100% if overachievement is not allowed
    return allowOverachievement ? avgProgress : Math.min(avgProgress, 100);
  };

  // Prepare chart data for the dashboard
  const getChartData = () => {
    return getFilteredObjectives().map(obj => ({
      name: obj.title.length > 20 ? obj.title.substring(0, 20) + '...' : obj.title,
      fullName: obj.title,
      progress: calculateObjectiveProgress(obj.keyResults, true), // Allow overachievement in charts
      keyResults: obj.keyResults.length,
      category: obj.category || 'Uncategorized'
    }));
  };
  
  // Filter objectives based on search, category, status and date range
  const getFilteredObjectives = () => {
    return objectives.filter(obj => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        obj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'All' || obj.category === categoryFilter;
      
      // Status filter
      const progress = calculateObjectiveProgress(obj.keyResults, true);
      let matchesStatus = true;
      
      if (statusFilter === 'On Track') {
        matchesStatus = progress >= 80 && progress <= 100;
      } else if (statusFilter === 'At Risk') {
        matchesStatus = progress >= 25 && progress < 50;
      } else if (statusFilter === 'Off Track') {
        matchesStatus = progress < 25;
      } else if (statusFilter === 'Overachieved') {
        matchesStatus = progress > 100;
      } else if (statusFilter === 'In Progress') {
        matchesStatus = progress >= 50 && progress < 80;
      }
      
      // Date range filter
      const objStartDate = new Date(obj.startDate || '2000-01-01');
      const objEndDate = new Date(obj.endDate || '2099-12-31');
      const filterStartDate = new Date(dateRangeFilter.start);
      const filterEndDate = new Date(dateRangeFilter.end);
      
      const matchesDateRange = 
        (objStartDate <= filterEndDate && objEndDate >= filterStartDate);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
    });
  };

  // Add new objective with key results
  const handleAddObjective = () => {
    if (newObjective.title.trim() === '') return;
    
    if (editMode && editIndex !== null) {
      // Update existing objective
      const updatedObjectives = [...objectives];
      updatedObjectives[editIndex] = { ...newObjective };
      setObjectives(updatedObjectives);
      setEditMode(false);
      setEditIndex(null);
    } else {
      // Add new objective
      setObjectives([...objectives, { ...newObjective }]);
    }
    
    // Reset form
    setNewObjective({ 
      title: '', 
      description: '', 
      keyResults: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      category: 'Business'
    });
    
    // Go back to dashboard
    setActiveTab('dashboard');
  };

  // Add key result to new objective
  const handleAddKeyResult = () => {
    if (newKeyResult.title.trim() === '') return;
    
    setNewObjective({
      ...newObjective,
      keyResults: [...newObjective.keyResults, { ...newKeyResult }]
    });
    
    // Reset key result form
    setNewKeyResult({ title: '', target: 100, current: 0 });
  };

  // Remove key result from new objective
  const handleRemoveKeyResult = (index) => {
    const updatedKeyResults = [...newObjective.keyResults];
    updatedKeyResults.splice(index, 1);
    setNewObjective({ ...newObjective, keyResults: updatedKeyResults });
  };

  // Edit existing objective
  const handleEditObjective = (index) => {
    setNewObjective({ ...objectives[index] });
    setEditMode(true);
    setEditIndex(index);
    setActiveTab('add');
  };

  // Delete objective
  const handleDeleteObjective = (index) => {
    const updatedObjectives = [...objectives];
    updatedObjectives.splice(index, 1);
    setObjectives(updatedObjectives);
  };

  // Update key result progress for an existing objective
  // Allow values to exceed target (overachievement)
  const handleUpdateKeyResult = (objIndex, krIndex, value) => {
    const updatedObjectives = [...objectives];
    // Only enforce minimum value of 0, no maximum cap
    const updatedValue = Math.max(0, parseInt(value) || 0);
    
    updatedObjectives[objIndex].keyResults[krIndex].current = updatedValue;
    
    // Add history entry for tracking progress over time
    if (!updatedObjectives[objIndex].keyResults[krIndex].history) {
      updatedObjectives[objIndex].keyResults[krIndex].history = [];
    }
    
    updatedObjectives[objIndex].keyResults[krIndex].history.push({
      date: new Date().toISOString().split('T')[0],
      value: updatedValue
    });
    
    setObjectives(updatedObjectives);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setDateRangeFilter({
      start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
    });
  };

  // Save to local storage when objectives change
  useEffect(() => {
    localStorage.setItem('okr-data', JSON.stringify(objectives));
  }, [objectives]);

  // Load from local storage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('okr-data');
    if (savedData) {
      try {
        setObjectives(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved OKR data");
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-600">OKR Tracker Pro</h1>
          <p className={`${TEXT_COLORS.secondary}`}>Track your Personal Objectives and Key Results</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-4">
            <button 
              className={`px-3 py-4 text-sm font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-500' : `${TEXT_COLORS.secondary} hover:text-gray-700`}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-3 py-4 text-sm font-medium ${activeTab === 'add' ? 'text-blue-600 border-b-2 border-blue-500' : `${TEXT_COLORS.secondary} hover:text-gray-700`}`}
              onClick={() => {
                setActiveTab('add');
                setEditMode(false);
                setNewObjective({ 
                  title: '', 
                  description: '', 
                  keyResults: [],
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
                  category: 'Business'
                });
              }}
            >
              Add Objective
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        {activeTab === 'dashboard' ? (
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
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${TEXT_COLORS.primary}`}>Filters</h3>
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
                    {categories.map(category => (
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

            {getFilteredObjectives().length > 0 ? (
              <>
                {/* Charts section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress chart */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className={`text-lg font-medium mb-4 ${TEXT_COLORS.primary}`}>Objective Progress</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getChartData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 'dataMax']} />
                          <Tooltip 
                            formatter={(value, name, props) => `${value}%`}
                            labelFormatter={(value) => {
                              const obj = getChartData().find(item => item.name === value);
                              return obj ? obj.fullName : value;
                            }}
                          />
                          <Legend />
                          <Bar dataKey="progress" fill="#0088FE" name="Progress %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Distribution chart */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className={`text-lg font-medium mb-4 ${TEXT_COLORS.primary}`}>Progress Distribution</h3>
                    <div className="h-64 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getChartData()}
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="progress"
                            nameKey="name"
                            label={({name, progress}) => `${name}: ${progress}%`}
                            labelLine={true}
                          >
                            {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Objectives list */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-medium ${TEXT_COLORS.primary}`}>Your Objectives ({getFilteredObjectives().length})</h3>
                    <p className={`text-sm ${TEXT_COLORS.light}`}>Showing {getFilteredObjectives().length} of {objectives.length} objectives</p>
                  </div>
                  
                  {getFilteredObjectives().map((objective, objIndex) => {
                    const actualObjIndex = objectives.findIndex(obj => obj === objective);
                    const progress = calculateObjectiveProgress(objective.keyResults, true); // Allow overachievement for display
                    
                    return (
                      <div key={actualObjIndex} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className={`text-xl font-medium ${TEXT_COLORS.primary}`}>{objective.title}</h4>
                              <StatusBadge progress={progress} />
                            </div>
                            <p className={TEXT_COLORS.secondary}>{objective.description}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {objective.category && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {objective.category}
                                </span>
                              )}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <Calendar size={12} className="mr-1" />
                                {new Date(objective.startDate).toLocaleDateString()} - {new Date(objective.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditObjective(actualObjIndex)}
                              className="p-2 text-gray-500 hover:text-blue-600"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteObjective(actualObjIndex)}
                              className="p-2 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-medium ${TEXT_COLORS.secondary}`}>Overall Progress</span>
                            <span className={`text-sm font-medium ${
                              progress > 100 ? 'text-purple-600' :
                              progress >= 80 ? 'text-green-600' : 
                              progress >= 50 ? 'text-blue-600' : 
                              progress >= 25 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                progress > 100 ? 'bg-purple-600' :
                                progress >= 80 ? 'bg-green-600' : 
                                progress >= 50 ? 'bg-blue-600' : 
                                progress >= 25 ? 'bg-yellow-600' : 
                                'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Key Results */}
                        <div className="space-y-4">
                          <h5 className={`text-md font-medium ${TEXT_COLORS.primary}`}>Key Results</h5>
                          {objective.keyResults.length > 0 ? (
                            <div className="space-y-3">
                              {objective.keyResults.map((kr, krIndex) => {
                                const krProgress = Math.round((kr.current / kr.target) * 100);
                                
                                return (
                                  <div key={krIndex} className="pl-4 border-l-2 border-gray-200">
                                    <div className="flex justify-between items-center mb-1">
                                      <div className="flex items-center gap-2">
                                        {krProgress >= 100 ? 
                                          <CheckCircle size={16} className={krProgress > 100 ? "text-purple-500" : "text-green-500"} /> : 
                                          <Circle size={16} className="text-gray-300" />
                                        }
                                        <span className={`text-sm font-medium ${TEXT_COLORS.secondary}`}>{kr.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="number"
                                          min="0"
                                          value={kr.current}
                                          onChange={(e) => handleUpdateKeyResult(actualObjIndex, krIndex, e.target.value)}
                                          className="w-16 px-2 py-1 text-sm border rounded text-gray-900 placeholder-gray-500"
                                        />
                                        <span className={`text-sm text-gray-900 placeholder-gray-500 ${TEXT_COLORS.light}`}>/ {kr.target}</span>
                                        <span className={`text-sm font-medium ${
                                          krProgress > 100 ? 'text-purple-600' :
                                          krProgress >= 80 ? 'text-green-600' : 
                                          krProgress >= 50 ? 'text-blue-600' : 
                                          krProgress >= 25 ? 'text-yellow-600' : 
                                          'text-red-600'
                                        }`}>{krProgress}%</span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 ml-6">
                                      <div 
                                        className={`h-1.5 rounded-full ${
                                          krProgress > 100 ? 'bg-purple-600' :
                                          krProgress >= 80 ? 'bg-green-600' : 
                                          krProgress >= 50 ? 'bg-blue-600' : 
                                          krProgress >= 25 ? 'bg-yellow-600' : 
                                          'bg-red-600'
                                        }`}
                                        style={{ width: `${Math.min(krProgress, 100)}%` }}
                                      ></div>
                                    </div>
                                    
                                    {/* Progress history */}
                                    {kr.history && kr.history.length > 1 && (
                                      <details className="mt-2 ml-6">
                                        <summary className="text-xs text-blue-600 cursor-pointer">
                                          View progress history
                                        </summary>
                                        <div className="mt-2 text-xs space-y-1">
                                          {[...kr.history].reverse().slice(0, 5).map((entry, idx) => (
                                            <div key={idx} className="flex justify-between">
                                              <span className={TEXT_COLORS.secondary}>{new Date(entry.date).toLocaleDateString()}</span>
                                              <span className={TEXT_COLORS.secondary}>{entry.value} / {kr.target}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </details>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className={`text-sm ${TEXT_COLORS.light} italic`}>No key results defined</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className={`text-xl font-bold mb-6 ${TEXT_COLORS.primary}`}>{editMode ? 'Edit Objective' : 'Create New Objective'}</h2>
              
              {/* Objective Form */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                    Objective Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Increase Customer Satisfaction"
                    value={newObjective.title}
                    onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1 `}>
                    Description
                  </label>
                  <textarea
                    placeholder="Briefly describe your objective"
                    value={newObjective.description}
                    onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    rows={3}
                  />
                </div>
                
                {/* Time period selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                      Category
                    </label>
                    <select
                      value={newObjective.category || 'Business'}
                      onChange={(e) => setNewObjective({...newObjective, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                      Timeframe
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className={`flex-1 py-2 px-3 text-sm rounded-md ${
                          newObjective.timeframe === 'monthly' ? 
                          'bg-blue-100 text-blue-700 border border-blue-300' : 
                          'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                        onClick={() => setNewObjective({...newObjective, 
                          timeframe: 'monthly',
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
                        })}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 px-3 text-sm rounded-md ${
                          newObjective.timeframe === 'quarterly' ? 
                          'bg-blue-100 text-blue-700 border border-blue-300' : 
                          'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                        onClick={() => setNewObjective({...newObjective, 
                          timeframe: 'quarterly',
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
                        })}
                      >
                        Quarterly
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 px-3 text-sm rounded-md ${
                          newObjective.timeframe === 'yearly' ? 
                          'bg-blue-100 text-blue-700 border border-blue-300' : 
                          'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                        }`}
                        onClick={() => setNewObjective({...newObjective, 
                          timeframe: 'yearly',
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                        })}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Date range picker */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newObjective.startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewObjective({...newObjective, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newObjective.endDate || new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]}
                      onChange={(e) => setNewObjective({...newObjective, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>
              
              {/* Key Results Section */}
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-4 ${TEXT_COLORS.primary}`}>Key Results</h3>
            
                {/* Key Results List */}
                {newObjective.keyResults.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {newObjective.keyResults.map((keyResult, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className={`font-medium ${TEXT_COLORS.primary}`}>{keyResult.title}</p>
                          <p className={`text-sm ${TEXT_COLORS.light}`}>Target: {keyResult.target}, Current: {keyResult.current}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveKeyResult(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add New Key Result Form */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className={`text-md font-medium mb-3 ${TEXT_COLORS.primary}`}>Add Key Result</h4>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., Achieve 95% customer satisfaction score"
                        value={newKeyResult.title}
                        onChange={(e) => setNewKeyResult({...newKeyResult, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                          Target Value
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="100"
                          value={newKeyResult.target}
                          onChange={(e) => setNewKeyResult({...newKeyResult, target: parseInt(e.target.value) || 100})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${TEXT_COLORS.secondary} mb-1`}>
                          Current Value
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={newKeyResult.current}
                          onChange={(e) => setNewKeyResult({...newKeyResult, current: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleAddKeyResult}
                      className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={16} />
                      <span>Add Key Result</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-900 placeholder-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddObjective}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editMode ? 'Update Objective' : 'Create Objective'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className={`text-center ${TEXT_COLORS.light}`}>OKR Tracker Pro &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
// Remove all "dark:" classes from the rest of your file, for example:

// ...and so on for all other elements.