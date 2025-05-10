import { TEXT_COLORS } from '../../constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className={`text-center ${TEXT_COLORS.light}`}>OKR Tracker Pro &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}