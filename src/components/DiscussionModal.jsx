import { useState } from "react";
import { X, Heart, MessageSquare, Send } from "lucide-react";

const DiscussionModal = ({
  discussion,
  isCreateMode = false,
  onClose,
  onPostNewDiscussion,
  onLike,
  isLiked
}) => {
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([
    {
      id: "r-1",
      user: "PikachuFanatic",
      text: "The balloon texture makes so much sense since it learns Stockpile and Minimize! Love the shiny eye reflection too.",
      time: "1h ago"
    },
    {
      id: "r-2",
      user: "RetroGamer_2000",
      text: "Super cute! Would love to see an animated bobbing idle sprite in this art style.",
      time: "25m ago"
    }
  ]);
  const [createTitle, setCreateTitle] = useState("");
  const [createBody, setCreateBody] = useState("");
  const [createCommunity, setCreateCommunity] = useState("Pokémon Community");

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplies([
      ...replies,
      {
        id: `r-${Date.now()}`,
        user: "You",
        text: replyText.trim(),
        time: "Just now"
      }
    ]);
    setReplyText("");
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createTitle.trim() || !createBody.trim()) return;
    if (onPostNewDiscussion) {
      onPostNewDiscussion(createTitle.trim(), createBody.trim(), createCommunity);
    }
    onClose();
  };

  if (!discussion && !isCreateMode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden border border-gray-200 my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col text-gray-900">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFA800]">
              {isCreateMode ? "Start New Discussion" : discussion?.community}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Create Mode */}
        {isCreateMode ? (
          <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Choose Community
              </label>
              <select
                value={createCommunity}
                onChange={(e) => setCreateCommunity(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-[#F8F9FA] text-gray-900 focus:outline-none focus:border-[#FFA800] cursor-pointer"
              >
                <option value="Pokémon Community" className="bg-white">Pokémon Community</option>
                <option value="One Piece Community" className="bg-white">One Piece Community</option>
                <option value="Elden Ring Community" className="bg-white">Elden Ring Community</option>
                <option value="Star Wars Community" className="bg-white">Star Wars Community</option>
                <option value="General FanHub Hub" className="bg-white">General FanHub Hub</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Discussion Title
              </label>
              <input
                type="text"
                required
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                placeholder="What would you like to discuss or share?"
                className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-[#F8F9FA] text-gray-900 placeholder:text-gray-500/60 focus:outline-none focus:border-[#FFA800]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Your Post & Details
              </label>
              <textarea
                required
                rows={5}
                value={createBody}
                onChange={(e) => setCreateBody(e.target.value)}
                placeholder="Share your theories, artwork, character analysis, or question for fellow fans..."
                className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-[#F8F9FA] text-gray-900 placeholder:text-gray-500/60 focus:outline-none focus:border-[#FFA800]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#FFA800] hover:bg-[#FFB51A] text-black rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send size={13} />
                <span>Publish to Community</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {/* Thread Header */}
            <div className="flex items-start gap-3.5 mb-4">
              <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-black shadow-xs">
                <img
                  src={discussion?.thumbnail}
                  alt={discussion?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  {discussion?.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-[10px] text-[#FFA800]">
                    {discussion?.author?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="font-semibold text-gray-900">{discussion?.author}</span>
                  <span>•</span>
                  <span>{discussion?.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="bg-[#F8F9FA] rounded-xl p-4 text-xs sm:text-sm text-gray-900 leading-relaxed border border-gray-200 mb-5">
              {discussion?.body}
            </div>

            {/* Like and Stats action */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200 mb-5 text-xs">
              <button
                onClick={() => discussion && onLike(discussion.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${isLiked
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200"
                  }`}
              >
                <Heart size={14} fill={isLiked ? "#f43f5e" : "none"} />
                <span>{(discussion?.likes || 0) + (isLiked ? 1 : 0)} Likes</span>
              </button>

              <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                <MessageSquare size={14} />
                <span>{replies.length} Replies</span>
              </div>
            </div>

            {/* Replies List */}
            <div className="space-y-3 mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Thread Replies
              </h4>
              {replies.map((r) => (
                <div key={r.id} className="p-3 bg-[#F8F9FA] rounded-lg border border-gray-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{r.user}</span>
                    <span className="text-[10px] text-gray-500">{r.time}</span>
                  </div>
                  <p className="text-gray-500">{r.text}</p>
                </div>
              ))}
            </div>

            {/* Post Reply */}
            <form onSubmit={handleAddReply} className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply to the author..."
                className="flex-1 text-xs border border-gray-200 bg-[#F8F9FA] text-gray-900 placeholder:text-gray-500/60 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FFA800]"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="bg-[#FFA800] hover:bg-[#FFB51A] disabled:opacity-40 text-black text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Send size={13} />
                <span>Reply</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export { DiscussionModal };
