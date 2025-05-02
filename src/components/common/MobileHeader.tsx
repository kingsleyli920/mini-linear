import { Bars3Icon } from '@heroicons/react/24/outline';

export default function MobileHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sm:hidden fixed top-0 left-0 w-full h-14 bg-gray-900 flex items-center px-4 z-[10000] shadow">
      <button
        className="p-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
        style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <span className="text-lg font-bold text-white">Mini Linear</span>
    </header>
  );
} 