"use client";
import { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { calculateObjectiveProgress } from '../utils/helpers';

// Import the components correctly
import Header from '../components/layout/Header';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import Dashboard from '../components/dashboard/Dashboard';
import ObjectiveForm from '../components/objectives/ObjectiveForm';
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
  
  // State for filtering and time range
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
      <Header />

      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setEditMode={setEditMode}
        setNewObjective={setNewObjective}
      />

      {/* Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        {activeTab === 'dashboard' ? (
          <Dashboard 
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRangeFilter={dateRangeFilter}
            setDateRangeFilter={setDateRangeFilter}
            resetFilters={resetFilters}
            chartData={getChartData()}
            filteredObjectives={getFilteredObjectives()}
            objectives={objectives}
            handleEditObjective={handleEditObjective}
            handleDeleteObjective={handleDeleteObjective}
            handleUpdateKeyResult={handleUpdateKeyResult}
          />
        ) : (
          <ObjectiveForm 
            newObjective={newObjective}
            setNewObjective={setNewObjective}
            newKeyResult={newKeyResult}
            setNewKeyResult={setNewKeyResult}
            handleAddKeyResult={handleAddKeyResult}
            handleRemoveKeyResult={handleRemoveKeyResult}
            handleAddObjective={handleAddObjective}
            editMode={editMode}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}