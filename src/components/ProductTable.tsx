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
    <div data-testid="product-table-wrapper" className="py-4 lg:p-4 w-full">

      <div data-testid="product-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            data-testid={`product-card-${product.id}`}
            onClick={() => onRowClick(product)}
            className="flex flex-row p-4 bg-white rounded-[1.5rem] hover:bg-gray-50 cursor-pointer transition-colors shadow-sm border border-gray-100 gap-5"
          >
            {/* Left: Thumbnail */}
            <div data-testid={`product-thumbnail-container-${product.id}`} className="shrink-0 w-[120px] md:w-[140px] aspect-[9/16] overflow-hidden rounded-[1rem] bg-[#d89694] shadow-sm flex items-center justify-center">
              {product.thumbnail && product.thumbnail !== "h" ? (
                <img data-testid={`product-image-${product.id}`} src={product.thumbnail} alt={product.modelName} className="w-full h-full object-cover" />
              ) : (
                <span data-testid={`product-placeholder-text-${product.id}`} className="font-serif text-white text-5xl font-semibold opacity-30 shadow-none">h</span>
              )}
            </div>

            {/* Right: Content Flex */}
            <div data-testid={`product-content-${product.id}`} className="flex flex-col flex-1 py-1">
              {/* Product Info Setup */}
              <div data-testid={`product-header-${product.id}`}>
                <h3 data-testid={`product-name-${product.id}`} className="font-medium text-gray-800 text-lg md:text-xl line-clamp-2 leading-tight">
                  {product.modelName}
                </h3>
                <p data-testid={`product-stock-${product.id}`} className="font-medium text-gray-500 mt-1 md:mt-2 text-sm md:text-base">
                  stock: {product.stock}
                </p>
                <p data-testid={`product-price-${product.id}`} className="font-semibold text-[#628b25] text-xl md:text-2xl mt-3 md:mt-4 tracking-tight">
                  ₹{product.sellPrice}
                </p>
              </div>

              {/* Spacer pushes bottom row down */}
              <div data-testid={`spacer-${product.id}`} className="flex-1"></div>

              {/* Bottom Details Row */}
              <div data-testid={`product-metrics-${product.id}`} className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4 md:gap-y-0 items-end pb-1 md:pb-2">
                <div data-testid={`metric-cost-container-${product.id}`} className="flex flex-col">
                  <span data-testid={`metric-cost-label-${product.id}`} className="text-gray-500 font-medium text-[13px] md:text-sm capitalize mb-0.5">Cost</span>
                  <span data-testid={`metric-cost-value-${product.id}`} className="font-medium text-gray-800 text-sm md:text-[17px]">₹{product.makingCost}</span>
                </div>
                <div data-testid={`metric-margin-container-${product.id}`} className="flex flex-col">
                  <span data-testid={`metric-margin-label-${product.id}`} className="text-gray-500 font-medium text-[13px] md:text-sm capitalize mb-0.5">margin</span>
                  <span data-testid={`metric-margin-value-${product.id}`} className="font-medium text-gray-800 text-sm md:text-[17px]">₹{product.margin}</span>
                </div>
                <div data-testid={`metric-profit-container-${product.id}`} className="flex flex-col">
                  <span data-testid={`metric-profit-label-${product.id}`} className="text-gray-500 font-medium text-[13px] md:text-sm capitalize mb-0.5">profit</span>
                  <span data-testid={`metric-profit-value-${product.id}`} className="font-medium text-[#628b25] text-sm md:text-[17px]">{product.profitPercent}%</span>
                </div>
                <div data-testid={`metric-sold-container-${product.id}`} className="flex flex-col">
                  <span data-testid={`metric-sold-label-${product.id}`} className="text-gray-500 font-medium text-[13px] md:text-sm capitalize mb-0.5">sold</span>
                  <span data-testid={`metric-sold-value-${product.id}`} className="font-medium text-gray-800 text-sm md:text-[17px]">{product.sold}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


