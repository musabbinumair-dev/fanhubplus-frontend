import { useState, useEffect } from "react";
import { X, Sparkles, BookOpen, PlusCircle } from "lucide-react";
const StartWikiModal = ({
  isOpen,
  onClose,
  onCreateWiki
}) => {
  const [wikiName, setWikiName] = useState("");
  const [category, setCategory] = useState("Gaming");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setCategory(data.categories[0].name);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!wikiName.trim()) return;
    onCreateWiki(
      wikiName.trim(),
      category,
      description.trim() || `The official community knowledge base for ${wikiName.trim()}.`
    );
    setWikiName("");
    setDescription("");
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
    <div className="relative w-full max-w-md bg-[#0A2A33] rounded-xl p-6 shadow-2xl border border-[#123847] text-[#F2F7F5] animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-[#123847] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#06F284]/15 border border-[#06F284]/30 text-[#06F284] flex items-center justify-center">
            <PlusCircle size={18} />
          </div>
          <div>
            <h3 className="font-unbounded font-bold text-[#F2F7F5] text-sm">Start a New Wiki</h3>
            <p className="text-[11px] text-[#7FA3A8]">Create an official fan community on FanHub</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#021826] rounded-lg text-[#7FA3A8] hover:text-[#F2F7F5] cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-[#7FA3A8] uppercase mb-1">
            Wiki Title / Franchise Name
          </label>
          <input
            type="text"
            required
            value={wikiName}
            onChange={(e) => setWikiName(e.target.value)}
            placeholder="e.g. Solo Leveling, Silksong, Chainsaw Man"
            className="w-full text-xs bg-[#021826] border border-[#123847] rounded-lg p-2.5 text-[#F2F7F5] placeholder:text-[#7FA3A8] focus:outline-none focus:border-[#06F284] focus:ring-1 focus:ring-[#06F284]/30"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#7FA3A8] uppercase mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs bg-[#021826] border border-[#123847] rounded-lg p-2.5 text-[#F2F7F5] focus:outline-none focus:border-[#06F284] cursor-pointer"
          >
            {categories.length > 0 ? (
              categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))
            ) : (
              <option value="Anime">Anime</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#7FA3A8] uppercase mb-1">
            Initial Wiki Mission Statement
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will fans find in this community wiki? Characters, plot summaries, weapon scaling, lore..."
            className="w-full text-xs bg-[#021826] border border-[#123847] rounded-lg p-2.5 text-[#F2F7F5] placeholder:text-[#7FA3A8] focus:outline-none focus:border-[#06F284] focus:ring-1 focus:ring-[#06F284]/30"
          />
        </div>

        <div className="bg-[#021826] rounded-lg p-3 border border-[#123847] text-[11px] text-[#7FA3A8] flex items-center gap-2">
          <BookOpen size={16} className="text-[#06F284] shrink-0" />
          <span>You will automatically be granted Bureaucrat & Sysop admin permissions for this wiki.</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#123847]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#7FA3A8] hover:text-[#F2F7F5] rounded-lg hover:bg-[#021826] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold bg-[#06F284] hover:bg-[#05db77] text-[#021826] rounded-lg transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Launch Community Wiki</span>
          </button>
        </div>
      </form>
    </div>
  </div>;
};
export {
  StartWikiModal
};
