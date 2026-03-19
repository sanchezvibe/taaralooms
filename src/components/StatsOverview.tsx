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
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex flex-col text-left">
      <span className="text-xl md:text-2xl font-semibold mb-1">{value}</span>
      <span className="text-[10px] md:text-xs text-gray-500 font-medium capitalize">
        {label}
      </span>
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

  const stats = [
    { value: totalUnits, label: "Total" },
    { value: totalSold, label: "sold" },
    { value: totalStock, label: "Stock remaining" },
    { value: totalExpense, label: "Expense" },
    { value: totalReturns, label: "returns" },
    { value: totalProfit, label: "profit" },
    { value: stockWorth, label: "Stock worth" },
  ];

  return (
    <div className="bg-white rounded-[1.5rem] p-6 md:p-10 w-full mb-6 relative z-10 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4 md:gap-y-12 md:gap-x-8">
        {stats.map((stat, i) => (
          <StatCard key={i} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
}


