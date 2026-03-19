interface Product {
  id: string;
  thumbnail: string;
  modelName: string;
  makingCost: number;
  margin: number;
  sellPrice: number;
  profitPercent: number;
  sold: number;
  stock: number;
}

interface StatCardProps {
  value: string | number;
  label: string;
  isGreen?: boolean;
  isLarge?: boolean;
}

function StatCard({ value, label, isGreen, isLarge }: StatCardProps) {
  return (
    <div
      data-testid={`stat-card-${label}`}
      className={`flex flex-col text-left relative ${isLarge ? "animate-soft-pop" : ""}`}
    >
      {isLarge && <ConfettiOverlay />}
      <span
        data-testid={`stat-value-${label}`}
        className={`font-medium transition-all leading-none ${isGreen ? "text-[#628b25]" : "text-gray-900"
          } ${isLarge ? "text-8xl md:text-[9.5rem] -mb-1" : "text-xl md:text-3xl mb-3"
          }`}
      >
        {value}
      </span>
      <span data-testid={`stat-label-${label}`} className="text-sm md:text-lg text-gray-400 font-medium capitalize tracking-tight">
        {label}
      </span>
    </div>
  );
}

function ConfettiOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti opacity-0"
          style={{
            backgroundColor: ["#628b25", "#8eb54e", "#c4df9b", "#4a6b1c"][i % 4],
            left: '50%',
            top: '50%',
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 360}deg) translate(${30 + Math.random() * 80}px)`,
            '--tx': `${(Math.random() - 0.5) * 150}px`,
            '--ty': `${(Math.random() - 0.5) * 150}px`,
          } as any}
        />
      ))}
    </div>
  );
}

interface StatsOverviewProps {
  products: Product[];
}

export default function StatsOverview({ products }: StatsOverviewProps) {
  // Calculate stats dynamically
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalUnits = totalSold + totalStock;
  const totalExpense = products.reduce((sum, p) => sum + (p.makingCost * (p.sold + p.stock)), 0);
  const totalReturns = products.reduce((sum, p) => sum + (p.sellPrice * p.sold), 0);
  const totalProfit = products.reduce((sum, p) => sum + (p.margin * p.sold), 0);
  const stockWorth = products.reduce((sum, p) => sum + (p.sellPrice * p.stock), 0);

  return (
    <div data-testid="stats-overview" className="bg-white rounded-[3rem] p-10 md:p-20 w-full mb-8 relative z-10 shadow-sm border border-gray-100/30">

      <style jsx global>{`
        @keyframes soft-pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }
        .animate-soft-pop {
          animation: soft-pop 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-confetti {
          animation: confetti 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 4 forwards;
        }
      `}</style>

      {/* Top: Inventory Section - Forced 2 Columns */}
      <div data-testid="inventory-section" className="grid grid-cols-2 gap-8 pb-16 items-center">

        {/* Left Col: Stacked Total & Stock */}
        <div data-testid="inventory-stacked-col" className="flex flex-col gap-12">
          <StatCard value={totalUnits} label="Total" />
          <StatCard value={totalStock} label="Stock Remaining" />
        </div>

        {/* Right Col: Hero Sold */}
        <div data-testid="sold-hero-col" className="flex flex-col items-start justify-center">
          <StatCard
            value={totalSold}
            label="Sold"
            isGreen={true}
            isLarge={true}
          />
        </div>
      </div>

      {/* Horizontal Separator */}
      <div data-testid="stats-separator" className="h-[1px] bg-gray-100/60 mb-16" />

      {/* Bottom: Financial Stats Grid - Forced 2 Columns */}
      <div data-testid="financial-stats-grid" className="grid grid-cols-2 gap-y-16 gap-x-12">
        <StatCard value={totalExpense} label="Expense" />
        <StatCard value={`₹${totalReturns.toLocaleString()}`} label="Returns" />

        <StatCard
          value={`₹${totalProfit.toLocaleString()}`}
          label="Profit"
          isGreen={true}
        />
        <StatCard value={`₹${stockWorth.toLocaleString()}`} label="Stock Worth" />
      </div>
    </div>
  );
}


