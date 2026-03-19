"use client";

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

interface ProductTableProps {
  products: Product[];
  onRowClick: (product: Product) => void;
}

export default function ProductTable({ products, onRowClick }: ProductTableProps) {
  return (
    <div className="p-4 w-full">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onRowClick(product)}
            className="flex flex-row p-4 bg-white rounded-[1.5rem] hover:bg-gray-50 cursor-pointer transition-colors shadow-sm border border-gray-100 gap-5"
          >
            {/* Left: Thumbnail */}
            <div className="shrink-0 w-[120px] md:w-[140px] aspect-[9/16] overflow-hidden rounded-[1rem] bg-[#d89694] shadow-sm flex items-center justify-center">
              {product.thumbnail && product.thumbnail !== "h" ? (
                <img src={product.thumbnail} alt={product.modelName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-white text-5xl font-bold opacity-30 shadow-none">h</span>
              )}
            </div>

            {/* Right: Content Flex */}
            <div className="flex flex-col flex-1 py-1">
              {/* Product Info Setup */}
              <div>
                <h3 className="font-semibold text-gray-800 text-lg md:text-xl line-clamp-2 leading-tight">
                  {product.modelName}
                </h3>
                <p className="font-semibold text-gray-500 mt-1 md:mt-2 text-sm md:text-base">
                  stock: {product.stock}
                </p>
                <p className="font-bold text-[#628b25] text-3xl md:text-4xl mt-3 md:mt-4 tracking-tight">
                  ₹{product.sellPrice}
                </p>
              </div>

              {/* Spacer pushes bottom row down */}
              <div className="flex-1"></div>

              {/* Bottom Details Row */}
              <div className="grid grid-cols-4 gap-2 items-end pb-1 md:pb-2">
                <div className="flex flex-col">
                  <span className="text-gray-500 font-semibold text-[13px] md:text-sm capitalize mb-0.5">Cost</span>
                  <span className="font-semibold text-gray-800 text-sm md:text-[17px]">₹{product.makingCost}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 font-semibold text-[13px] md:text-sm capitalize mb-0.5">margin</span>
                  <span className="font-semibold text-gray-800 text-sm md:text-[17px]">₹{product.margin}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 font-semibold text-[13px] md:text-sm capitalize mb-0.5">profit</span>
                  <span className="font-semibold text-[#628b25] text-sm md:text-[17px]">{product.profitPercent}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 font-semibold text-[13px] md:text-sm capitalize mb-0.5">sold</span>
                  <span className="font-semibold text-gray-800 text-sm md:text-[17px]">{product.sold}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


