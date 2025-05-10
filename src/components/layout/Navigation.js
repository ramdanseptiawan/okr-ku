import { TEXT_COLORS } from '../../constants';

export default function Navigation({ activeTab, setActiveTab, setEditMode, setNewObjective }) {
  return (
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
  );
}