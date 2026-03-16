"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import StatsOverview from "@/components/StatsOverview";
import ActionBar from "@/components/ActionBar";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModal";
import { supabase } from "@/lib/supabase";

import { verifyAdminPassword } from "@/app/actions/auth";
import { syncBackup } from "@/app/actions/backup";

import { useToast } from "@/components/ToastProvider";

export default function Dashboard() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // null means adding a new product

  // 1. Fetch Products
  const fetchProducts = async () => {
    setIsLoaded(false);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching products:", error);
    } else if (data) {
      setProducts(data);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Automatically sync to local JSON backup whenever products change
  useEffect(() => {
    if (isLoaded) {
      syncBackup(products).catch(console.error);
    }
  }, [products, isLoaded]);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string, passwordAttempt: string) => {
    // Check password
    const isCorrect = await verifyAdminPassword(passwordAttempt);
    if (!isCorrect) {
      toast("Incorrect admin password", true);
      return;
    }
    
    // Delete from Supabase
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
      toast("Failed to delete product.", true);
      return;
    }

    // Refresh local state
    setProducts(products.filter(p => p.id !== id));
    setIsModalOpen(false);
    toast("Product removed successfully!");
  };

  const handleSaveProduct = async (productData: any) => {
    if (selectedProduct) {
      // Optimistic UI update
      setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...productData } : p));
      
      // Update in Supabase
      const { error } = await supabase
        .from("products")
        .update({
          thumbnail: productData.thumbnail,
          modelName: productData.modelName,
          makingCost: productData.makingCost,
          margin: productData.margin,
          sellPrice: productData.sellPrice,
          profitPercent: productData.profitPercent,
          sold: productData.sold,
          stock: productData.stock
        })
        .eq("id", selectedProduct.id);
        
      if (error) console.error("Update failed:", error);
      
    } else {
      // Optimistic UI update (temporary ID)
      const tempProduct = { ...productData, id: Date.now().toString() };
      setProducts([tempProduct, ...products]);

      // Insert into Supabase
      const { data, error } = await supabase
        .from("products")
        .insert([{
          thumbnail: productData.thumbnail,
          modelName: productData.modelName,
          makingCost: productData.makingCost,
          margin: productData.margin,
          sellPrice: productData.sellPrice,
          profitPercent: productData.profitPercent,
          sold: productData.sold,
          stock: productData.stock
        }])
        .select();
        
      if (error) {
        console.error("Insert failed:", error);
        // In real app, you'd maybe revert the UI here
      } else if (data && data.length > 0) {
        // Update the temp UI product with real ID from database
        setProducts(prev => prev.map(p => p.id === tempProduct.id ? data[0] : p));
      }
    }
  };

  // Filter products based on search term (name or price)
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.modelName.toLowerCase().includes(term) ||
      product.sellPrice.toString().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-12">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 lg:pt-10">
        <StatsOverview products={products} />

        
        <ActionBar 
          onAddProduct={handleOpenAdd} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <ProductTable products={filteredProducts} onRowClick={handleOpenEdit} />
      </main>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}

