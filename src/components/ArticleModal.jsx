import { useState } from "react";
import { X, Bookmark, Share2, Heart, MessageSquare, Send } from "lucide-react";
const ArticleModal = ({
  story,
  onClose,
  isSaved,
  onToggleSave
}) => {
  const [likes, setLikes] = useState(14);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([
    { id: "c1", user: "MasterChief_99", text: "Activision assisting with the multiplayer engineering might actually bring the classic matchmaking feel back!", time: "2h ago" },
    { id: "c2", user: "SpartanLocke", text: "As long as the campaign narrative stays true to the lore and character depth, I am all for new blood on the team.", time: "45m ago" }
  ]);
  const [newComment, setNewComment] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  if (!story) return null;
  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2e3);
  };
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: `c_${Date.now()}`,
        user: "You",
        text: newComment.trim(),
        time: "Just now"
      }
    ]);
    setNewComment("");
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0B0B0D]/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#151517] rounded-lg overflow-hidden border border-[#232326] my-auto max-h-[90vh] flex flex-col text-[#F5F5F5]">
        {
    /* Top Header Controls */
  }
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#232326] bg-[#151517] sticky top-0 z-10">
          <span className="text-xs font-semibold text-[#8A8A8E]">
            {story.category || "News"} · 2026
          </span>
          <div className="flex items-center gap-2">
            <button
    onClick={() => onToggleSave(story.id)}
    className={`p-1.5 rounded transition-colors ${isSaved ? "text-[#E1121E] bg-[#0B0B0D]" : "text-[#8A8A8E] hover:text-[#F5F5F5] hover:bg-[#0B0B0D]"}`}
    title="Bookmark article"
  >
              <Bookmark size={16} fill={isSaved ? "#E1121E" : "none"} />
            </button>
            <button
    onClick={handleShare}
    className="p-1.5 rounded text-[#8A8A8E] hover:text-[#F5F5F5] hover:bg-[#0B0B0D] transition-colors relative"
    title="Share"
  >
              <Share2 size={16} />
              {copiedShare && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0B0B0D] border border-[#232326] text-white text-[10px] px-1.5 py-0.5 rounded">
                  Copied
                </span>}
            </button>
            <button
    onClick={onClose}
    className="p-1.5 rounded text-[#8A8A8E] hover:text-[#F5F5F5] hover:bg-[#0B0B0D] transition-colors"
    title="Close"
  >
              <X size={16} />
            </button>
          </div>
        </div>

        {
    /* Scrollable Story Content */
  }
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {
    /* Real Photo Banner */
  }
          <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-[#0B0B0D] border border-[#232326]">
            <img
    src={story.image}
    alt={story.title}
    className="w-full h-full object-cover"
  />
            {
    /* IMDb Rating Chip */
  }
            <div className="absolute top-2.5 left-2.5 bg-[#0B0B0D]/95 border border-[#232326] px-2 py-0.5 rounded text-[11px] font-bold text-[#F5F5F5] flex items-center gap-1">
              <span className="text-[#E1121E]">★</span> 9.2
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] leading-snug">
              {story.title}
            </h1>
            <p className="text-xs text-[#8A8A8E] mt-1.5">
              {story.date} · 4 min read · 68K views
            </p>
          </div>

          <div className="space-y-3 text-sm text-[#8A8A8E] leading-relaxed">
            <p>{story.excerpt}</p>
            <p>
              Lead developers confirmed that cross-functional design sprints will streamline weapon sandbox tuning and telemetry collection. The community feedback board has already logged over 12,000 constructive submissions regarding competitive map layouts and server tick rates.
            </p>
            <p>
              Executive producers reiterated that franchise lore continuity remains the paramount priority, ensuring narrative coherence across all upcoming seasonal expansions and supplementary graphic novels.
            </p>
          </div>

          {
    /* Social Reactions Bar */
  }
          <div className="flex items-center gap-4 py-3 border-y border-[#232326] text-xs text-[#8A8A8E]">
            <button
    onClick={handleLike}
    className={`flex items-center gap-1.5 font-medium transition-colors ${hasLiked ? "text-[#E1121E]" : "hover:text-[#F5F5F5]"}`}
  >
              <Heart size={15} fill={hasLiked ? "#E1121E" : "none"} />
              <span>{likes} upvotes</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={15} />
              <span>{comments.length} comments</span>
            </div>
          </div>

          {
    /* Comment Stream */
  }
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-[#F5F5F5]">
              Community Discussion ({comments.length})
            </h3>

            <div className="space-y-2.5">
              {comments.map((c) => <div key={c.id} className="p-3 bg-[#0B0B0D] rounded border border-[#232326] text-xs">
                  <div className="flex items-center justify-between text-[#8A8A8E] mb-1">
                    <span className="font-semibold text-[#F5F5F5]">{c.user}</span>
                    <span className="text-[10px]">{c.time}</span>
                  </div>
                  <p className="text-[#8A8A8E] leading-relaxed">{c.text}</p>
                </div>)}
            </div>

            {
    /* Comment Input */
  }
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <input
    type="text"
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
    placeholder="Write a comment..."
    className="flex-1 bg-[#0B0B0D] border border-[#232326] rounded px-3 py-2 text-xs text-[#F5F5F5] placeholder:text-[#8A8A8E] focus:outline-none focus:border-[#8A8A8E]"
  />
              <button
    type="submit"
    className="px-3.5 py-2 bg-[#232326] hover:bg-[#343438] text-[#F5F5F5] rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
  >
                <Send size={13} />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>;
};
export {
  ArticleModal
};
