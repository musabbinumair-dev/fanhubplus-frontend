import { useEffect } from "react";
import {
  X,
  FileText,
  Calendar,
  Check,
  Image as ImageIcon,
  Bug,
  Lightbulb,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { getCategoryBadgeClass, CATEGORY_COLORS } from "../../utils/categoryColors.js";

const ReviewDetailDrawer = ({
  item,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onResolve
}) => {
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isSubmission = item.type === "submission";

  const renderFeedbackTypeBadge = (fbType) => {
    const typeUpper = (fbType || "QUERY").toUpperCase();
    if (typeUpper === "BUG") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/30">
          <Bug size={14} />
          <span>BUG</span>
        </span>
      );
    }
    if (typeUpper === "SUGGESTION") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/30">
          <Lightbulb size={14} />
          <span>SUGGESTION</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/30">
        <HelpCircle size={14} />
        <span>QUERY</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none text-gray-900">
      {/* 1. DIMMED BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. SLIDE-IN SIDE PANEL */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg md:max-w-[490px] bg-white border-l border-gray-200 shadow-sm border border-gray-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
          
          {/* HEADER BAR */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-2.5">
              <FileText size={22} className="text-[#FFA800]" strokeWidth={2} />
              <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 font-titan">
                REVIEW
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* MAIN SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
            {/* ITEM TYPE TAG & SUBMITTER SUMMARY */}
            <div className="px-6 py-5 bg-white space-y-3.5">
              {/* Type pill */}
              <div>
                {isSubmission ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/30">
                    <Sparkles size={12} />
                    <span>Submission</span>
                  </span>
                ) : (
                  renderFeedbackTypeBadge(item.feedbackType)
                )}
              </div>

              {/* Submitter & Date Card */}
              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 bg-black shrink-0 shadow-2xs">
                    <img
                      src={item.submittedBy?.avatar}
                      alt={item.submittedBy?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/src/assets/images/luffy_avatar_1790269807034.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Submitted by:</p>
                    <p className="text-base font-bold text-gray-900 leading-tight">
                      {item.submittedBy?.name}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight mt-0.5">
                      {item.submittedBy?.username}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500">
                    <Calendar size={13} className="text-gray-500" />
                    <span>Date:</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-gray-900 mt-0.5">
                    {item.date}
                  </p>
                </div>
              </div>
            </div>

            {/* BODY: CONDITIONAL CONTENT FOR SUBMISSION VS FEEDBACK */}
            {isSubmission ? (
              /* SUBMISSION FIELDS */
              <div className="px-6 py-5 space-y-5 bg-white">
                {/* Category */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                    Category
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Content Type */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                    Content Type
                  </label>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                    {item.contentType === "Image" ? (
                      <ImageIcon size={13} />
                    ) : (
                      <FileText size={13} />
                    )}
                    <span>{item.contentType || "Article"}</span>
                  </span>
                </div>

                {/* Content Preview */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                    Content Preview
                  </label>
                  <div className="border border-gray-200 rounded-2xl p-4 bg-[#F8F9FA] space-y-3 shadow-2xs">
                    <h4 className="text-base font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {item.content}
                    </p>
                    {item.image && (
                      <div className="rounded-xl overflow-hidden border border-gray-200 max-h-56 bg-black">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* FEEDBACK FIELDS */
              <div className="px-6 py-5 space-y-5 bg-white">
                {/* Feedback Type */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                    Feedback Type
                  </label>
                  <div>{renderFeedbackTypeBadge(item.feedbackType)}</div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-1 mb-2">
                    <span>Message</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-2xl p-4 bg-[#F8F9FA] text-xs sm:text-sm text-gray-900 leading-relaxed shadow-2xs whitespace-pre-line">
                    {item.message}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER ACTION BUTTONS */}
          <div className="border-t border-gray-200 bg-white px-6 py-4 shrink-0">
            {isSubmission ? (
              /* TWO BUTTONS: REJECT & APPROVE */
              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => onReject(item.id)}
                  className="w-1/2 py-3 px-4 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X size={15} strokeWidth={2.5} />
                  <span>REJECT</span>
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(item.id)}
                  className="w-1/2 py-3 px-4 bg-[#FFA800] hover:bg-[#FFB51A] text-black rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check size={15} strokeWidth={2.5} />
                  <span>APPROVE</span>
                </button>
              </div>
            ) : (
              /* SINGLE FULL-WIDTH BUTTON: MARK AS RESOLVED */
              <button
                type="button"
                onClick={() => onResolve(item.id)}
                className="w-full py-3.5 px-6 bg-[#FFA800] hover:bg-[#FFB51A] text-black rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={15} strokeWidth={2.5} />
                <span>MARK AS RESOLVED</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ReviewDetailDrawer };
