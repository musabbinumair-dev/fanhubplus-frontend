import { X, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo.jsx";

const FooterInfoModal = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border border-gray-200 animate-in fade-in zoom-in-95 duration-150 text-gray-900">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <div className="flex items-center gap-2">
            <Logo size="footer" />
            <h3 className="font-bold text-gray-900 text-base">{info.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {info.text}
        </p>

        <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#4ADE80] shrink-0" />
            <span>Official FanHub Documentation & Verification</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-extrabold rounded-lg text-xs transition-colors cursor-pointer shrink-0"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export { FooterInfoModal };
