import { useEffect } from "react";
import { X, Lock, ArrowRight } from "lucide-react";

export function LoginRequiredModal({
  isOpen,
  onClose,
  onRedirectToLogin,
  message = "This feature requires login"
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#181A20] border border-[#2B2F3D] text-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close / Cross Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Lock Icon */}
        <div className="w-12 h-12 bg-[#FFA800]/15 border border-[#FFA800]/40 flex items-center justify-center text-[#FFA800] mb-4">
          <Lock size={22} />
        </div>

        {/* Title & Message */}
        <h3 className="text-xl font-black uppercase tracking-wider font-titan text-white">
          Login Required
        </h3>
        <p className="text-sm text-stone-300 font-medium leading-relaxed mt-2">
          {message}. Please log in to your account to continue.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onRedirectToLogin) {
                onRedirectToLogin();
              }
            }}
            className="w-full sm:flex-1 py-3 px-5 bg-[#FFA800] hover:bg-[#FF9500] text-black font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Redirect to Login</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
