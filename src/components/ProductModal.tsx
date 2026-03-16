"use client";

import { useState, useEffect } from "react";
import { ImagePlus, ChevronRight } from "lucide-react";

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

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: any) => void;
  onDelete?: (id: string, passwordAttempt: string) => void;
}

export default function ProductModal({ isOpen, onClose, product, onSave, onDelete }: ProductModalProps) {
  const [formData, setFormData] = useState({
    modelName: "",
    thumbnail: "",
    makingCost: "",
    sellPrice: "",
    sold: "",
    stock: "",
  });
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        modelName: product.modelName || "",
        thumbnail: product.thumbnail === "h" ? "" : (product.thumbnail || ""),
        makingCost: (product.makingCost || 0).toString(),
        sellPrice: (product.sellPrice || 0).toString(),
        sold: (product.sold || 0).toString(),
        stock: (product.stock || 0).toString(),
      });
    } else {
      setFormData({
        modelName: "",
        thumbnail: "",
        makingCost: "",
        sellPrice: "",
        sold: "",
        stock: "",
      });
    }
    setShowDeletePrompt(false);
    setPasswordAttempt("");
  }, [product, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  // Auto calculated fields
  const makingCostNum = parseFloat(formData.makingCost) || 0;
  const sellPriceNum = parseFloat(formData.sellPrice) || 0;
  const margin = sellPriceNum - makingCostNum;
  const profitPercent = makingCostNum > 0 ? ((margin / makingCostNum) * 100).toFixed(0) : "0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-[1.5rem] p-6 md:p-10 w-full max-w-4xl relative z-10 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Model name</label>
                <input 
                  type="text" 
                  value={formData.modelName}
                  onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">thumbnail</label>
                <label className="border border-gray-300 rounded-md p-4 h-32 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden" 
                  />
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Upload preview" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 rounded p-2 text-gray-500">
                       <ImagePlus className="w-5 h-5" /> [ + ]
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">making cost</label>
                <input 
                  type="number" 
                  value={formData.makingCost}
                  onChange={(e) => setFormData({...formData, makingCost: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">margin</label>
                <input 
                  type="text" 
                  value={margin > 0 ? margin : ""}
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-pink-50/50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">sold</label>
                <input 
                  type="number" 
                  value={formData.sold}
                  onChange={(e) => setFormData({...formData, sold: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6 lg:col-span-1 md:col-span-2 lg:w-auto">
              <div>
                <label className="block text-sm font-semibold mb-2">Sell price</label>
                <input 
                  type="number" 
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">profit %</label>
                <input 
                  type="text" 
                  value={sellPriceNum > 0 ? `${profitPercent}%` : ""}
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-pink-50/50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">stock</label>
                <input 
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 lg:text-left text-center flex items-center gap-4 justify-center sm:justify-start">
             <button 
               onClick={() => {
                 onSave({
                   ...formData, 
                   makingCost: parseFloat(formData.makingCost) || 0,
                   sellPrice: parseFloat(formData.sellPrice) || 0,
                   sold: parseInt(formData.sold) || 0,
                   stock: parseInt(formData.stock) || 0,
                   margin, 
                   profitPercent: parseFloat(profitPercent),
                   thumbnail: formData.thumbnail || "h" // fallback if empty
                 });
                 onClose();
               }}
               className="bg-[#624a46] text-white px-10 py-2.5 rounded text-sm font-medium hover:bg-[#503b38] transition-colors w-full sm:w-auto"
             >
               {product ? "Update" : "Save"}
             </button>
             {product && onDelete && (
               <button
                 onClick={() => {
                   setShowDeletePrompt(true);
                   setPasswordAttempt("");
                 }}
                 className="flex items-center justify-center border-2 border-[#503b38] bg-transparent text-[#503b38] font-medium text-sm px-6 py-2 rounded-[0.5rem] hover:bg-gray-50 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
               >
                 Delete product
               </button>
             )}
          </div>
        </div>
      </div>

      {/* Delete Password Prompt */}
      {showDeletePrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={() => setShowDeletePrompt(false)} />
          <div className="bg-white rounded-[1rem] p-6 relative z-[70] w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Delete Product</h3>
            <p className="text-gray-600 text-sm mb-5">Enter the admin password to confirm deletion.</p>
            <input 
              type="password"
              value={passwordAttempt}
              onChange={(e) => setPasswordAttempt(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400 mb-6"
              placeholder="Admin password"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && passwordAttempt && onDelete && product) {
                  onDelete(product.id, passwordAttempt);
                  setShowDeletePrompt(false);
                }
              }}
            />
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowDeletePrompt(false)}
                className="text-gray-500 font-medium text-sm px-4 py-2 hover:bg-gray-50 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (passwordAttempt && onDelete && product) {
                    onDelete(product.id, passwordAttempt);
                    setShowDeletePrompt(false);
                  }
                }}
                className="bg-[#624a46] text-white font-medium text-sm px-5 py-2 rounded-[0.5rem] hover:bg-[#503b38]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

