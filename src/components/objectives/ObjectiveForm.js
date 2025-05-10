import { useState } from 'react';
import { Trash2, PlusCircle, Calendar } from 'lucide-react';
import { TEXT_COLORS, CATEGORIES } from '../../constants'; // Add CATEGORIES to the import

export default function ObjectiveForm({
  newObjective,
  setNewObjective,
  newKeyResult,
  setNewKeyResult,
  handleAddKeyResult,
  handleRemoveKeyResult,
  handleAddObjective,
  editMode,
  setActiveTab
}) {
  return (
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
                {CATEGORIES.map(category => (
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
  );
}