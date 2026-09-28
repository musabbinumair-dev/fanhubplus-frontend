export function AdminLoadingScreen({ type = "dashboard" }) {
  if (type === "table") {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-screen text-[#231C14] font-sans pb-16 select-none animate-in fade-in duration-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Header Row Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
            <div className="space-y-2">
              <div className="w-48 sm:w-64 h-8 bg-stone-200" />
              <div className="w-64 sm:w-80 h-3.5 bg-stone-100" />
            </div>
            <div className="w-32 h-10 bg-stone-200" />
          </div>

          {/* Search & Filter Bar Skeleton */}
          <div className="bg-white border border-[#EBE6DD] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
            <div className="w-full sm:w-80 h-10 bg-stone-100 border border-stone-200/60" />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="w-28 h-10 bg-stone-100 border border-stone-200/60" />
              <div className="w-28 h-10 bg-stone-100 border border-stone-200/60" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white border border-[#EBE6DD] overflow-hidden shadow-2xs animate-pulse">
            {/* Table Header */}
            <div className="h-11 bg-stone-100/80 border-b border-[#EBE6DD] flex items-center px-4 gap-4">
              <div className="w-12 h-3 bg-stone-200" />
              <div className="w-40 h-3 bg-stone-200" />
              <div className="w-24 h-3 bg-stone-200" />
              <div className="w-24 h-3 bg-stone-200" />
              <div className="w-20 h-3 bg-stone-200" />
              <div className="ml-auto w-16 h-3 bg-stone-200" />
            </div>

            {/* Table Rows Skeleton */}
            <div className="divide-y divide-[#F0EBE1]">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="w-48 sm:w-72 h-3.5 bg-stone-200" />
                    <div className="w-32 sm:w-44 h-2.5 bg-stone-100" />
                  </div>
                  <div className="w-20 h-6 bg-stone-100 hidden sm:block" />
                  <div className="w-20 h-6 bg-stone-100 hidden md:block" />
                  <div className="w-20 h-3 bg-stone-100 hidden lg:block" />
                  <div className="w-16 h-7 bg-stone-100 shrink-0 ml-auto" />
                </div>
              ))}
            </div>

            {/* Table Pagination Footer Skeleton */}
            <div className="p-4 border-t border-[#EBE6DD] bg-stone-50/50 flex items-center justify-between">
              <div className="w-32 h-3 bg-stone-200" />
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 bg-stone-200" />
                <div className="w-8 h-8 bg-stone-200" />
                <div className="w-8 h-8 bg-stone-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Dashboard Skeleton
  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen text-[#231C14] font-sans pb-16 select-none animate-in fade-in duration-150">
      {/* Page Header Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 animate-pulse space-y-2">
        <div className="w-56 sm:w-72 h-8 bg-stone-200" />
        <div className="w-72 sm:w-96 h-3.5 bg-stone-100" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* 1. Top 4 KPI Metrics Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-stone-200 shrink-0" />
                <div className="w-24 h-3 bg-stone-200" />
              </div>
              <div className="flex items-end justify-between pt-1">
                <div className="w-20 h-7 bg-stone-200" />
                <div className="w-14 h-6 bg-stone-100" />
              </div>
              <div className="w-32 h-2.5 bg-stone-100" />
            </div>
          ))}
        </div>

        {/* 2. Middle Row: 2 Chart Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 animate-pulse">
          {/* Chart 1 */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="space-y-1.5">
                <div className="w-36 h-4 bg-stone-200" />
                <div className="w-48 h-3 bg-stone-100" />
              </div>
              <div className="w-20 h-6 bg-stone-100" />
            </div>
            <div className="h-52 bg-stone-50 border border-stone-100 p-4 flex items-end justify-between gap-2">
              {[35, 60, 45, 80, 50, 95, 65, 40, 75, 85].map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-stone-200"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="space-y-1.5">
                <div className="w-40 h-4 bg-stone-200" />
                <div className="w-44 h-3 bg-stone-100" />
              </div>
              <div className="w-20 h-6 bg-stone-100" />
            </div>
            <div className="h-52 bg-stone-50 border border-stone-100 p-4 flex items-end justify-between gap-3">
              {[50, 70, 40, 90, 60, 75].map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-stone-200"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: Table & Feed Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 animate-pulse">
          {/* Submissions Table Skeleton */}
          <div className="lg:col-span-2 bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="w-44 h-4 bg-stone-200" />
              <div className="w-24 h-6 bg-stone-100" />
            </div>
            <div className="divide-y divide-[#F0EBE1]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-stone-200 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="w-40 sm:w-56 h-3.5 bg-stone-200" />
                      <div className="w-24 h-2.5 bg-stone-100" />
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-stone-100 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity / Feedback Feed Skeleton */}
          <div className="bg-white border border-[#EBE6DD] rounded-none p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="w-36 h-4 bg-stone-200" />
              <div className="w-16 h-4 bg-stone-100" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="w-full h-3 bg-stone-200" />
                    <div className="w-24 h-2.5 bg-stone-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
