import { useState, useEffect, useCallback } from "react";
import { ImagePlus, X, Scissors, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

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

  // Crop State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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
    setImageToCrop(null);
  }, [product, isOpen]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDoneCropping = async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        if (croppedImage) {
          setFormData({ ...formData, thumbnail: croppedImage });
          setImageToCrop(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  // Auto calculated fields
  const makingCostNum = parseFloat(formData.makingCost) || 0;
  const sellPriceNum = parseFloat(formData.sellPrice) || 0;
  const margin = sellPriceNum - makingCostNum;
  const profitPercent = makingCostNum > 0 ? ((margin / makingCostNum) * 100).toFixed(0) : "0";

  return (
    <div data-testid="product-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim Overlay */}
      <div 
        data-testid="modal-overlay"
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div data-testid="modal-content" className="bg-white rounded-[2rem] p-8 md:p-12 w-full max-w-[850px] relative z-10 shadow-2xl overflow-y-auto max-h-[95vh] border border-gray-100">
        <div data-testid="modal-layout" className="md:flex md:gap-12 md:items-start text-left">
          
          {/* Left Column: Thumbnail */}
          <div data-testid="thumbnail-upload-column" className="flex-shrink-0 mb-8 md:mb-0 w-full md:w-[220px]">
            <label data-testid="thumbnail-label" className="block text-sm font-medium text-gray-800 mb-3 tracking-tight">Thumbnail (9:16)</label>
            <label data-testid="thumbnail-upload-trigger" className="border border-gray-100 shadow-sm rounded-[1.5rem] aspect-[9/16] w-[140px] md:w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all relative overflow-hidden group">
              <input 
                data-testid="thumbnail-input-file"
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden" 
              />
              {formData.thumbnail ? (
                <img data-testid="thumbnail-preview" src={formData.thumbnail} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div data-testid="thumbnail-placeholder" className="flex items-center justify-center bg-gray-50 rounded-full p-6 text-gray-300">
                   <ImagePlus className="w-10 h-10" />
                </div>
              )}
              {formData.thumbnail && (
                <div data-testid="thumbnail-crop-hint" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px] text-white">
                  <Scissors className="w-8 h-8" />
                </div>
              )}
            </label>
          </div>

          {/* Right Column: Details */}
          <div data-testid="product-details-column" className="flex-grow space-y-8">
            
            {/* Model Name */}
            <div data-testid="input-group-model-name" className="space-y-2">
              <label data-testid="label-model-name" className="block text-sm font-medium text-gray-800 leading-none">Model name</label>
              <input 
                data-testid="input-model-name"
                type="text" 
                value={formData.modelName}
                onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium shadow-sm"
                placeholder="e.g. lemon strap dress"
              />
            </div>

            {/* Metrics Grid */}
            <div data-testid="metrics-grid" className="grid grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Row 1: Cost & Price */}
              <div data-testid="input-group-cost" className="space-y-2">
                <label data-testid="label-making-cost" className="block text-sm font-medium text-gray-800 leading-none">making cost</label>
                <input 
                  data-testid="input-making-cost"
                  type="number" 
                  value={formData.makingCost}
                  onChange={(e) => setFormData({...formData, makingCost: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium shadow-sm"
                />
              </div>
              <div data-testid="input-group-price" className="space-y-2">
                <label data-testid="label-sell-price" className="block text-sm font-medium text-gray-800 leading-none tracking-tight">Sell price</label>
                <input 
                  data-testid="input-sell-price"
                  type="number" 
                  value={formData.sellPrice}
                  onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium shadow-sm"
                />
              </div>

              {/* Row 2: Margin & Profit */}
              <div data-testid="input-group-margin" className="space-y-2">
                <label data-testid="label-margin" className="block text-sm font-medium text-gray-800 leading-none">margin</label>
                <div data-testid="display-margin" className="w-full border border-gray-100 bg-[#fdf8f8] text-gray-500 rounded-xl px-4 py-3 text-sm font-medium shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  {margin > 0 ? margin : "0"}
                </div>
              </div>
              <div data-testid="input-group-profit" className="space-y-2">
                <label data-testid="label-profit" className="block text-sm font-medium text-gray-800 leading-none">profit %</label>
                <div data-testid="display-profit" className="w-full border border-gray-100 bg-[#fdf8f8] text-gray-500 rounded-xl px-4 py-3 text-sm font-medium shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  {sellPriceNum > 0 ? `${profitPercent}%` : "0%"}
                </div>
              </div>

              {/* Row 3: Sold & Stock */}
              <div data-testid="input-group-sold" className="space-y-2">
                <label data-testid="label-sold" className="block text-sm font-medium text-gray-800 leading-none">sold</label>
                <input 
                  data-testid="input-sold"
                  type="number" 
                  value={formData.sold}
                  onChange={(e) => setFormData({...formData, sold: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium shadow-sm"
                />
              </div>
              <div data-testid="input-group-stock" className="space-y-2">
                <label data-testid="label-stock" className="block text-sm font-medium text-gray-800 leading-none">stock</label>
                <input 
                  data-testid="input-stock"
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div data-testid="modal-actions-container" className="pt-8 flex gap-4">
               <button 
                 data-testid="modal-save-button"
                 onClick={() => {
                   onSave({
                     ...formData, 
                     makingCost: parseFloat(formData.makingCost) || 0,
                     sellPrice: parseFloat(formData.sellPrice) || 0,
                     sold: parseInt(formData.sold) || 0,
                     stock: parseInt(formData.stock) || 0,
                     margin, 
                     profitPercent: parseFloat(profitPercent),
                     thumbnail: formData.thumbnail || "h"
                   });
                   onClose();
                 }}
                 className="flex-1 max-w-[150px] bg-[#5d4d4a] text-white py-3.5 rounded-xl text-md font-semibold hover:bg-[#4d3f3d] transition-all shadow-md active:scale-95"
               >
                 {product ? "Update" : "Save"}
               </button>
               {product && onDelete && (
                 <button
                   data-testid="modal-delete-button"
                   onClick={() => {
                     setShowDeletePrompt(true);
                     setPasswordAttempt("");
                   }}
                   className="flex-1 max-w-[150px] border-2 border-[#5d4d4a] text-[#5d4d4a] py-3.5 rounded-xl text-md font-semibold hover:bg-gray-50 transition-all active:scale-95"
                 >
                   Delete product
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal Layer */}
      {imageToCrop && (
        <div data-testid="cropper-layer" className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
          <div data-testid="cropper-container" className="relative w-full max-w-lg aspect-[9/16] bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/10">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={9 / 16}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          
          <div data-testid="cropper-actions" className="mt-8 flex items-center gap-4 w-full max-w-lg">
             <button 
               data-testid="cropper-cancel-button"
               onClick={() => setImageToCrop(null)}
               className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
             >
               <X className="w-5 h-5" /> Cancel
             </button>
             <button 
               data-testid="cropper-save-button"
               onClick={handleDoneCropping}
               className="flex-1 bg-white text-black py-4 rounded-2xl font-semibold transition-all shadow-xl flex items-center justify-center gap-2 hover:bg-gray-100"
             >
               <Check className="w-6 h-6" /> Crop Image
             </button>
          </div>

          <div data-testid="cropper-zoom-controls" className="mt-8 flex flex-col items-center w-full max-w-xs space-y-3">
            <span data-testid="cropper-zoom-label" className="text-white/80 text-sm font-medium tracking-wide text-center">Zoom: {zoom.toFixed(1)}x</span>
            <input
              data-testid="cropper-zoom-slider"
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>
      )}

      {/* Delete Password Prompt */}
      {showDeletePrompt && (
        <div data-testid="delete-prompt-layer" className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div data-testid="delete-prompt-overlay" className="fixed inset-0 bg-black/40 transition-opacity" onClick={() => setShowDeletePrompt(false)} />
          <div data-testid="delete-prompt-modal" className="bg-white rounded-[2rem] p-10 relative z-[70] w-full max-w-sm shadow-2xl border border-gray-100 text-center">
            <div data-testid="delete-prompt-icon" className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
               <X className="w-6 h-6" />
            </div>
            <h3 data-testid="delete-prompt-title" className="font-semibold text-gray-900 text-xl mb-2">Delete Product</h3>
            <p data-testid="delete-prompt-description" className="text-gray-500 text-sm mb-8 leading-relaxed px-4">Enter the admin password to confirm deletion. This cannot be undone.</p>
            <input 
              data-testid="delete-password-input"
              type="password"
              value={passwordAttempt}
              onChange={(e) => setPasswordAttempt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 mb-8 font-medium text-center"
              placeholder="Admin password"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && passwordAttempt && onDelete && product) {
                  onDelete(product.id, passwordAttempt);
                  setShowDeletePrompt(false);
                }
              }}
            />
            <div data-testid="delete-prompt-actions" className="grid grid-cols-2 gap-3">
              <button 
                data-testid="delete-cancel-button"
                onClick={() => setShowDeletePrompt(false)}
                className="text-gray-400 font-semibold text-sm px-4 py-3 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                data-testid="delete-confirm-button"
                onClick={() => {
                  if (passwordAttempt && onDelete && product) {
                    onDelete(product.id, passwordAttempt);
                    setShowDeletePrompt(false);
                  }
                }}
                className="bg-red-600 text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

