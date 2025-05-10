import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS, TEXT_COLORS } from '../../constants';

export default function ChartSection({ chartData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Progress chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className={`text-lg font-medium mb-4 ${TEXT_COLORS.primary}`}>Objective Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 'dataMax']} />
              <Tooltip 
                formatter={(value, name, props) => `${value}%`}
                labelFormatter={(value) => {
                  const obj = chartData.find(item => item.name === value);
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
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                dataKey="progress"
                nameKey="name"
                label={({name, progress}) => `${name}: ${progress}%`}
                labelLine={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}