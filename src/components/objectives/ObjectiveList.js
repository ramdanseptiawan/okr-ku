import { Edit, Trash2, Calendar, CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { TEXT_COLORS } from '../../constants';
import { calculateObjectiveProgress } from '../../utils/helpers';

export default function ObjectiveList({ 
  filteredObjectives, 
  objectives, 
  handleEditObjective, 
  handleDeleteObjective, 
  handleUpdateKeyResult 
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-medium ${TEXT_COLORS.primary}`}>Your Objectives ({filteredObjectives.length})</h3>
        <p className={`text-sm ${TEXT_COLORS.light}`}>Showing {filteredObjectives.length} of {objectives.length} objectives</p>
      </div>
      
      {filteredObjectives.map((objective, objIndex) => {
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
                <p className={`text-sm ${TEXT_COLORS.light} italic`}>No key results defined for this objective.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}