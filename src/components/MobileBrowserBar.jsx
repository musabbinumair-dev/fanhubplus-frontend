import { X, ChevronDown, Share2, Bookmark, MoreVertical, Wifi, BatteryCharging } from "lucide-react";

const MobileBrowserBar = ({
  onClose,
  isSaved = false,
  onToggleSave,
  onShare
}) => {
  return (
    <div className="bg-white text-gray-900 select-none shrink-0 border-b border-gray-200">
      {/* Top Phone Status Bar */}
      <div className="flex items-center justify-between px-6 pt-2 pb-1 text-xs font-semibold tracking-tight">
        <span>9:11</span>
        <div className="flex items-center gap-2">
          {/* Signal bars */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-1.5 bg-[#0F172A] rounded-xs" />
            <span className="w-0.5 h-2 bg-[#0F172A] rounded-xs" />
            <span className="w-0.5 h-2.5 bg-[#0F172A] rounded-xs" />
            <span className="w-0.5 h-3 bg-[#0F172A]/40 rounded-xs" />
          </div>
          <Wifi size={13} />
          {/* Battery 44% */}
          <div className="flex items-center gap-1 bg-[#4ADE80]/20 text-[#4ADE80] px-1.5 py-0.5 rounded text-[11px] font-bold">
            <span>44</span>
            <BatteryCharging size={13} />
          </div>
        </div>
      </div>

      {/* Browser Navigation Row */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Expand"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center max-w-[160px] truncate">
          <span className="text-sm font-semibold text-gray-900 truncate">
            Personal Homep...
          </span>
          <span className="text-[11px] text-gray-500 tracking-tight">
            FanHub.com
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onShare}
            className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Share Page"
          >
            <Share2 size={19} />
          </button>
          <button
            onClick={onToggleSave}
            className={`transition-colors cursor-pointer ${isSaved ? "text-[#FFA800]" : "text-gray-500 hover:text-gray-900"}`}
            title="Bookmark"
          >
            <Bookmark size={19} fill={isSaved ? "#FFA800" : "none"} />
          </button>
          <button
            className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Menu"
          >
            <MoreVertical size={19} />
          </button>
        </div>
      </div>
    </div>
  );
};

export { MobileBrowserBar };
