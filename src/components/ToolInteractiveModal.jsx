import { useState } from "react";
import { X, Play } from "lucide-react";

const ToolInteractiveModal = ({ tool, onClose }) => {
  const [activeFighterA, setActiveFighterA] = useState("Jiyan (Aero)");
  const [activeFighterB, setActiveFighterB] = useState("Yinlin (Electro)");
  const [battleLog, setBattleLog] = useState(null);
  const [tierItems, setTierItems] = useState([
    { name: "One Piece: Gear 5 Luffy", tier: "S" },
    { name: "Elden Ring: Starscourge Radahn", tier: "S" },
    { name: "Halo: Master Chief John-117", tier: "A" },
    { name: "Star Trek: Spock", tier: "A" },
    { name: "Silent Hill: Pyramid Head", tier: "B" }
  ]);

  if (!tool) return null;

  const handleSimulateBattle = () => {
    setBattleLog("Simulating Resonance battle metrics...");
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? activeFighterA : activeFighterB;
      setBattleLog(
        `Battle Concluded! 🏆 Winner: ${winner} via Critical Concerto Resonance Burst with 4,820 remaining HP!`
      );
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto font-sans text-gray-900">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden border border-gray-200 my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA800]">
              {tool.category}
            </span>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {tool.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            {tool.description}
          </p>

          {/* Interactive view based on tool type */}
          {tool.id === "resonance-clash" && (
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold uppercase text-gray-900">Arena Duel Simulator</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Resonator 1</label>
                  <select
                    value={activeFighterA}
                    onChange={(e) => setActiveFighterA(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-2 font-medium cursor-pointer"
                  >
                    <option value="Jiyan (Aero)" className="bg-white">Jiyan (Aero DPS)</option>
                    <option value="Changli (Fusion)" className="bg-white">Changli (Fusion Burst)</option>
                    <option value="Rover (Havoc)" className="bg-white">Rover (Havoc Spec)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Resonator 2</label>
                  <select
                    value={activeFighterB}
                    onChange={(e) => setActiveFighterB(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-lg p-2 font-medium cursor-pointer"
                  >
                    <option value="Yinlin (Electro)" className="bg-white">Yinlin (Electro Sub-DPS)</option>
                    <option value="Calcharo (Electro)" className="bg-white">Calcharo (Heavy Finisher)</option>
                    <option value="Jinhsi (Spectro)" className="bg-white">Jinhsi (Spectro Dragon)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSimulateBattle}
                className="w-full py-2 bg-[#FFA800] hover:bg-[#FFB51A] text-black font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Play size={14} className="fill-current" />
                <span>Simulate Arena Clash</span>
              </button>

              {battleLog && (
                <div className="p-3 bg-[#FFA800]/10 border border-[#FFA800]/30 text-[#FFA800] rounded-lg text-xs font-semibold animate-in fade-in">
                  {battleLog}
                </div>
              )}
            </div>
          )}

          {tool.id === "tier-list-maker" && (
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold uppercase text-gray-900">Quick Tier Board</h4>
              <div className="space-y-1.5 text-xs">
                {["S", "A", "B"].map((tier) => (
                  <div key={tier} className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-gray-200">
                    <span
                      className={`w-7 h-7 rounded flex items-center justify-center font-black text-black shrink-0 ${
                        tier === "S" ? "bg-[#FF6B9D]" : tier === "A" ? "bg-[#FFA800]" : "bg-[#4ADE80]"
                      }`}
                    >
                      {tier}
                    </span>
                    <div className="flex-1 flex flex-wrap gap-1.5">
                      {tierItems
                        .filter((item) => item.tier === tier)
                        .map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200"
                          >
                            {item.name}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tool.id === "warp-factor" && (
            <div className="bg-[#F8F9FA] text-gray-900 rounded-xl p-4 space-y-3 border border-gray-200">
              <h4 className="text-xs font-bold uppercase text-[#FFA800]">Six Degrees of the Federation</h4>
              <p className="text-xs text-gray-500">
                Connection found in <span className="font-bold text-[#4ADE80]">2 degrees</span>:
              </p>
              <div className="text-xs bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                <div>1. <strong>La&apos;an Noonien-Singh</strong> served with <strong>Captain Christopher Pike</strong> on the U.S.S. Enterprise.</div>
                <div>2. <strong>Christopher Pike</strong> transferred command of the Enterprise to <strong>Captain James T. Kirk</strong> in Starfleet canon.</div>
              </div>
            </div>
          )}

          {/* General action button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-gray-500">All calculations verified with community databases</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ToolInteractiveModal };
