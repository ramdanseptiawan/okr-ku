// Status badges for visual clarity
export default function StatusBadge({ progress }) {
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
}