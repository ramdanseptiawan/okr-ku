import { TEXT_COLORS } from '../../constants';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-blue-600">OKR Tracker Pro</h1>
        <p className={`${TEXT_COLORS.secondary}`}>Track your Personal Objectives and Key Results</p>
      </div>
    </header>
  );
}