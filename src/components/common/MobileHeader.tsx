import { BellIcon } from '@heroicons/react/24/outline';
import { LayoutIcon, NotificationIcon } from '../icons/IssueIcons';

export default function MobileHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sm:hidden fixed top-0 left-0 w-full h-14 bg-[#101011] flex items-center justify-between px-3 z-[10000] shadow border-b border-[#23272e]">
      <div className="flex items-center">
        <button
          className="p-2 rounded-lg hover:bg-[#23272e] text-[#e2e2e2] focus:outline-none"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            role="img"
            focusable="false"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 5.25A3.25 3.25 0 0 0 11.75 2h-7.5A3.25 3.25 0 0 0 1 5.25v5.5A3.25 3.25 0 0 0 4.25 14h7.5A3.25 3.25 0 0 0 15 10.75v-5.5Zm-3.5 7.25H7v-9h4.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2Zm-6 0H4.25a1.75 1.75 0 0 1-1.75-1.75v-5.5c0-.966.784-1.75 1.75-1.75H5.5v9Z"></path>
          </svg>
        </button>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#23272e]">
          <NotificationIcon className="w-4 h-4 text-[#bdbdbd]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#23272e]">
          <LayoutIcon className="w-4 h-4 text-[#bdbdbd]" />
        </button>
      </div>
    </header>
  );
}
