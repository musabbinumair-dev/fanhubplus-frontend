import { useState } from "react";
import {
  X,
  Bell,
  Bookmark,
  Trash2,
  ExternalLink,
  Award,
  Flame,
  Shuffle,
  Sliders,
  Film,
  UserCheck,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  FileText
} from "lucide-react";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "pending_submission":
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
          <FileText size={16} />
        </div>
      );
    case "content":
      return (
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-[#FF5F1F] flex items-center justify-center shrink-0">
          <Film size={16} />
        </div>
      );
    case "character":
      return (
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
          <UserCheck size={16} />
        </div>
      );
    case "merchandise":
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
          <ShoppingBag size={16} />
        </div>
      );
    case "submission_approved":
      return (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} />
        </div>
      );
    case "submission_rejected":
      return (
        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
          <AlertCircle size={16} />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-lg bg-stone-200/70 text-stone-600 flex items-center justify-center shrink-0">
          <Bell size={16} />
        </div>
      );
  }
};

const NotificationsDrawer = ({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState("all");

  if (!isOpen) return null;

  const displayList =
    filter === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm sm:max-w-md bg-[#FAF8F5] border-l border-[#EBE6DD] text-[#171717] h-full shadow-2xl p-5 flex flex-col animate-in slide-in-from-right duration-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EBE6DD]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FF5F1F]/10 rounded-lg text-[#FF5F1F]">
              <Bell size={18} />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-titan font-black tracking-tight uppercase text-sm text-[#171717]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#FF5F1F] text-white rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200/60 text-[#7A6F64] hover:text-[#171717] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter / Action Bar */}
        <div className="flex items-center justify-between py-2.5 border-b border-[#EBE6DD] text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[#171717] text-white"
                  : "bg-stone-200/60 text-[#7A6F64] hover:text-[#171717]"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filter === "unread"
                  ? "bg-[#FF5F1F] text-white"
                  : "bg-stone-200/60 text-[#7A6F64] hover:text-[#FF5F1F]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {notifications.length > 0 && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-semibold text-[#8E8272] hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-0.5">
          {isLoading ? (
            <div className="text-center py-12 text-[#7A6F64] text-xs">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#FF5F1F]" />
              <p>Loading notifications...</p>
            </div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-12 text-[#7A6F64] text-xs space-y-2">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-[#8E8272]">
                <Bell size={24} />
              </div>
              <p className="font-bold text-sm text-[#171717]">No notifications yet</p>
              <p className="text-[11px] text-[#8E8272] max-w-[240px] mx-auto">
                {filter === "unread"
                  ? "You're all caught up with your notifications!"
                  : "You'll be notified here when new content, characters, or merchandise are published, or when your submissions are reviewed."}
              </p>
            </div>
          ) : (
            displayList.map((n) => {
              const icon = getNotificationIcon(n.type);
              return (
                <div
                  key={n.id || n._id}
                  onClick={() => {
                    if (onSelectNotification) onSelectNotification(n);
                  }}
                  className={`p-3 border text-xs transition-all rounded-lg cursor-pointer flex gap-3 group relative ${
                    n.unread
                      ? "bg-white border-[#FF5F1F]/40 shadow-xs hover:border-[#FF5F1F]"
                      : "bg-white/60 border-[#EBE6DD] hover:bg-white hover:border-stone-300"
                  }`}
                >
                  {icon}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#FF5F1F] shrink-0 inline-block" />
                        )}
                        <span className={`font-bold truncate ${n.unread ? "text-[#171717]" : "text-stone-700"}`}>
                          {n.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#8E8272] shrink-0 whitespace-nowrap ml-1">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-[#7A6F64] leading-relaxed text-[11px] font-medium line-clamp-2">
                      {n.message}
                    </p>
                  </div>

                  {n.thumbnailUrl && (
                    <div className="w-11 h-11 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-[#EBE6DD]">
                      <img
                        src={n.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Mark All Read Footer */}
        {unreadCount > 0 && onMarkAllAsRead && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="w-full py-2.5 bg-white border border-[#EBE6DD] hover:border-[#FF5F1F] text-[#171717] hover:text-[#FF5F1F] font-bold text-xs shadow-2xs transition-colors cursor-pointer rounded-lg mt-2"
          >
            Mark all as read
          </button>
        )}
      </div>
    </div>
  );
};
const ProfileDrawer = ({ isOpen, onClose, onNavigateToDashboard }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
    <div className="w-full max-w-sm bg-[#0A2A33] border-l border-[#123847] text-[#F2F7F5] h-full shadow-2xl p-5 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[#123847]">
        <h3 className="font-unbounded font-bold text-[#F2F7F5] text-sm">Fan Profile</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-[#021826] text-[#7FA3A8] hover:text-[#F2F7F5] rounded-lg cursor-pointer">
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col items-center py-5 border-b border-[#123847]">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#FF5F1F] p-1 shadow-md mb-3 bg-amber-100 flex items-center justify-center">
          <img src="/src/assets/images/luffy_avatar_1790269807034.jpg" alt="Musab" className="w-full h-full object-cover rounded-lg" />
        </div>
        <h4 className="font-bold text-[#F2F7F5] text-base">Musab</h4>
        <span className="text-xs text-[#7FA3A8] mt-0.5">Exploring FanHub • Level 1</span>
      </div>

      {
        /* Stats */
      }
      <div className="grid grid-cols-3 gap-2 py-4 border-b border-[#123847] text-center">
        <div className="bg-[#021826] p-2.5 rounded-lg border border-[#123847]">
          <span className="text-[10px] text-[#7FA3A8] uppercase font-semibold">Saved</span>
          <div className="text-sm font-bold text-[#F2F7F5] mt-0.5">3</div>
        </div>
        <div className="bg-[#021826] p-2.5 rounded-lg border border-[#123847]">
          <span className="text-[10px] text-[#7FA3A8] uppercase font-semibold">Fandoms</span>
          <div className="text-sm font-bold text-[#FF5F1F] mt-0.5">8</div>
        </div>
        <div className="bg-[#021826] p-2.5 rounded-lg border border-[#123847]">
          <span className="text-[10px] text-[#7FA3A8] uppercase font-semibold">Rep</span>
          <div className="text-sm font-bold text-[#FFCC00] mt-0.5">140</div>
        </div>
      </div>

      {
        /* Badges preview */
      }
      <div className="py-4">
        <h5 className="text-[11px] font-bold uppercase text-[#7FA3A8] mb-2.5">Featured Badges</h5>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-[#021826] border border-[#123847] text-[#FFCC00] px-2.5 py-1.5 rounded-lg text-xs font-semibold">
            <Award size={14} className="text-[#FFCC00]" />
            <span>Explorer</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#021826] border border-[#123847] text-[#06F284] px-2.5 py-1.5 rounded-lg text-xs font-semibold">
            <Flame size={14} className="text-[#06F284]" />
            <span>Lore Seeker</span>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-4 border-t border-[#123847]">
        {onNavigateToDashboard && <button
          onClick={() => {
            onClose();
            onNavigateToDashboard();
          }}
          className="w-full py-2.5 bg-[#FF5F1F] hover:bg-[#E04F13] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>Go to Dashboard</span>
          <ExternalLink size={13} />
        </button>}
        <button
          onClick={onClose}
          className="w-full py-2 bg-[#021826] border border-[#123847] text-[#F2F7F5] font-semibold text-xs rounded-lg hover:border-[#06F284] transition-colors cursor-pointer"
        >
          Edit Profile
        </button>
      </div>
    </div>
  </div>;
};
const SavedDrawer = ({ isOpen, onClose, savedStories, onRemoveStory, onSelectStory }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
    <div className="w-full max-w-sm bg-[#0A2A33] border-l border-[#123847] text-[#F2F7F5] h-full shadow-2xl p-5 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[#123847]">
        <div className="flex items-center gap-2">
          <Bookmark size={18} className="text-[#06F284]" fill="#06F284" />
          <h3 className="font-unbounded font-bold text-[#F2F7F5] text-sm">Saved Articles ({savedStories.length})</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-[#021826] text-[#7FA3A8] hover:text-[#F2F7F5] rounded-lg">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {savedStories.length === 0 ? <div className="text-center py-12 text-[#7FA3A8] text-xs">
          <Bookmark size={32} className="mx-auto mb-2 opacity-30 text-[#06F284]" />
          <p>No saved articles yet.</p>
          <p className="mt-1">Tap the bookmark icon on any content to read it later.</p>
        </div> : savedStories.map((story) => <div
          key={story.id}
          className="p-3 bg-[#021826] border border-[#123847] rounded-lg shadow-xs hover:border-[#06F284]/60 transition-colors flex items-start gap-3"
        >
          <div
            onClick={() => {
              onSelectStory(story);
              onClose();
            }}
            className="flex-1 cursor-pointer min-w-0"
          >
            <h4 className="font-semibold text-[#F2F7F5] text-xs line-clamp-2 hover:text-[#06F284] transition-colors">
              {story.title}
            </h4>
            <span className="text-[10px] text-[#7FA3A8] mt-1 block">{story.date}</span>
          </div>
          <button
            onClick={() => onRemoveStory(story.id)}
            className="p-1 text-[#7FA3A8] hover:text-red-400 rounded"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>)}
      </div>
    </div>
  </div>;
};
const SettingsDrawer = ({ isOpen, onClose }) => {
  const [spoilerProtection, setSpoilerProtection] = useState(true);
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [emailDigest, setEmailDigest] = useState(true);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
    <div className="w-full max-w-sm bg-[#0A2A33] border-l border-[#123847] h-full shadow-2xl p-5 flex flex-col text-[#F2F7F5] animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[#123847]">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-[#06F284]" />
          <h3 className="font-unbounded font-bold text-[#F2F7F5] text-sm">Platform Settings</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-[#021826] text-[#7FA3A8] hover:text-[#F2F7F5] rounded-lg cursor-pointer">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
        <div>
          <h4 className="text-[11px] font-bold text-[#7FA3A8] uppercase tracking-wider mb-2.5">Display & Reading</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#021826] border border-[#123847] hover:border-[#06F284]/40 cursor-pointer">
              <div>
                <span className="font-semibold block text-[#F2F7F5]">Spoiler Protection</span>
                <span className="text-[11px] text-[#7FA3A8]">Blur major plot reveals and episode outcomes</span>
              </div>
              <input
                type="checkbox"
                checked={spoilerProtection}
                onChange={(e) => setSpoilerProtection(e.target.checked)}
                className="rounded text-[#06F284] accent-[#06F284] w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#021826] border border-[#123847] hover:border-[#06F284]/40 cursor-pointer">
              <div>
                <span className="font-semibold block text-[#F2F7F5]">Autoplay Video Trailers</span>
                <span className="text-[11px] text-[#7FA3A8]">Play trailers silently when cards hover</span>
              </div>
              <input
                type="checkbox"
                checked={autoPlayVideos}
                onChange={(e) => setAutoPlayVideos(e.target.checked)}
                className="rounded text-[#06F284] accent-[#06F284] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-[#7FA3A8] uppercase tracking-wider mb-2.5">Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#021826] border border-[#123847] hover:border-[#06F284]/40 cursor-pointer">
              <div>
                <span className="font-semibold block text-[#F2F7F5]">Fandom Weekly Digest</span>
                <span className="text-[11px] text-[#7FA3A8]">Receive curated wiki updates and trending lore</span>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="rounded text-[#06F284] accent-[#06F284] w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 bg-[#06F284] hover:bg-[#05db77] text-[#021826] font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
      >
        Save Preferences
      </button>
    </div>
  </div>;
};
const UtilitiesModal = ({ isOpen, onClose, onRandomWiki, onOpenCreateDiscussion }) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
    <div className="relative w-full max-w-md bg-[#0A2A33] rounded-xl p-6 shadow-2xl border border-[#123847] text-[#F2F7F5]">
      <div className="flex items-center justify-between pb-3 border-b border-[#123847] mb-4">
        <h3 className="font-unbounded font-bold text-[#F2F7F5] text-base">FanHub Utilities</h3>
        <button onClick={onClose} className="p-1 hover:bg-[#021826] text-[#7FA3A8] hover:text-[#F2F7F5] rounded-lg">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            onRandomWiki();
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#021826] border border-[#123847] hover:border-[#06F284] text-left transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#06F284]/15 text-[#06F284] border border-[#06F284]/30 flex items-center justify-center shrink-0">
            <Shuffle size={18} />
          </div>
          <div>
            <h4 className="font-bold text-[#F2F7F5] text-xs">Random Wiki Jump</h4>
            <p className="text-[11px] text-[#7FA3A8]">Discover a surprise franchise or pop-culture wiki database.</p>
          </div>
        </button>

        <button
          onClick={() => {
            onOpenCreateDiscussion();
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#021826] border border-[#123847] hover:border-[#06F284] text-left transition-all cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#9BFF6C]/15 text-[#9BFF6C] border border-[#9BFF6C]/30 flex items-center justify-center shrink-0">
            <Flame size={18} />
          </div>
          <div>
            <h4 className="font-bold text-[#F2F7F5] text-xs">Start a Discussion</h4>
            <p className="text-[11px] text-[#7FA3A8]">Post theories, fan art, or character debates to the community.</p>
          </div>
        </button>

        <div className="p-3 rounded-lg bg-[#021826]/60 border border-[#123847] text-xs text-[#7FA3A8]">
          <span className="font-semibold text-[#F2F7F5]">Syntax & Templates:</span> Use MediaWiki syntax, Wikitext templates, infoboxes, and citations when contributing to articles.
        </div>
      </div>
    </div>
  </div>;
};
export {
  NotificationsDrawer,
  ProfileDrawer,
  SavedDrawer,
  SettingsDrawer,
  UtilitiesModal
};
