import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { Package, Plus, Edit2, Trash2, X, Search, UploadCloud } from 'lucide-react';
import { uploadToCloudinary, uploadMultipleImages } from '../../utils/cloudinary';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', sku: '', price: '', currency: 'USD', colorLabel: '', images: '', category: '', subCategory: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImages = formData.images ? formData.images.split(',').map(i => i.trim()).filter(Boolean) : [];
    if (currentImages.length >= 10) {
      toast.warning('Maximum 10 images allowed per product');
      e.target.value = '';
      return;
    }

    const availableSlots = 10 - currentImages.length;
    const filesToUpload = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast.info(`Only uploading ${availableSlots} image${availableSlots > 1 ? 's' : ''} (maximum 10 images limit)`);
    }

    try {
      setIsUploading(true);
      const newUrls = await uploadMultipleImages(filesToUpload);
      const updatedImages = [...currentImages, ...newUrls].slice(0, 10);
      setFormData({ ...formData, images: updatedImages.join(', ') });
      toast.success(`${newUrls.length} image${newUrls.length > 1 ? 's' : ''} added successfully`);
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/category');
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axiosInstance.get('/sub-category');
      setSubCategories(Array.isArray(res.data) ? res.data : res.data.subCategories || []);
    } catch (error) {
      console.error('Failed to load sub-categories', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/product');
      const productList = Array.isArray(res.data.products) ? res.data.products : [];
      // Sort newest products first by createdAt or _id
      productList.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        if (timeB !== timeA) return timeB - timeA;
        return (b._id || '').localeCompare(a._id || '');
      });
      setProducts(productList);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
        currency: product.currency || 'USD',
        colorLabel: product.colorLabel,
        category: product.category?._id || product.category || '',
        subCategory: product.subCategory || '',
        images: product.images?.join(', ') || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', sku: '', price: '', currency: 'USD', colorLabel: '', images: '', category: '', subCategory: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        images: formData.images.split(',').map(img => img.trim()).filter(Boolean).slice(0, 10)
      };

      if (editingProduct) {
        await axiosInstance.put(`/product/${editingProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        const res = await axiosInstance.post('/product', payload);
        toast.success('Product created successfully');
        if (res.data?.product) {
          // Prepend newly created product immediately at the very top of the list
          setProducts(prev => [res.data.product, ...prev.filter(p => p._id !== res.data.product._id)]);
        }
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axiosInstance.delete(`/product/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 text-sm">Manage your inventory</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex shrink-0 items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Color</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="text-slate-300" size={20} />
                            )}
                          </div>
                          <span className="font-medium text-slate-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 font-mono text-sm">{product.sku}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        {product.currency} {product.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="px-2 py-1 bg-slate-100 text-xs rounded-full border border-slate-200">
                          {product.colorLabel}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-bold text-slate-800">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subcategory</label>
                    <select 
                      required
                      value={formData.subCategory}
                      onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories.map(subCat => (
                        <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subcategory (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.subCategory}
                      onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. T-Shirts"
                    />
                  </div> */}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                    <input 
                      type="text" 
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Color Label</label>
                    <input 
                      type="text" 
                      required
                      value={formData.colorLabel}
                      onChange={(e) => setFormData({...formData, colorLabel: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                    <input 
                      type="text" 
                      required
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Images <span className="text-xs text-indigo-600 font-semibold">({formData.images ? formData.images.split(',').map(i => i.trim()).filter(Boolean).length : 0}/10)</span>
                    </label>
                    <span className="text-[11px] text-slate-500">Up to 10 images (only added images will show)</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {(!formData.images || formData.images.split(',').map(i => i.trim()).filter(Boolean).length < 10) && (
                      <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${isUploading ? 'bg-slate-50 border-slate-300 text-slate-400' : 'bg-slate-50 border-indigo-300 text-indigo-600 hover:bg-indigo-50'}`}>
                        <UploadCloud size={20} />
                        <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Upload Images (Up to 10 images)'}</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                    )}

                    {/* Thumbnail Previews with Quick Remove */}
                    {formData.images && formData.images.split(',').map(i => i.trim()).filter(Boolean).length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                        {formData.images.split(',').map((imgUrl, idx) => {
                          const trimmed = imgUrl.trim();
                          if (!trimmed) return null;
                          return (
                            <div key={idx} className="relative group w-14 h-16 rounded-md overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs">
                              <img src={trimmed} alt={`preview ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = formData.images.split(',').map(i => i.trim()).filter(Boolean);
                                  list.splice(idx, 1);
                                  setFormData({ ...formData, images: list.join(', ') });
                                }}
                                className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 shadow-sm transition"
                                title="Remove image"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <textarea 
                      rows={2}
                      value={formData.images}
                      onChange={(e) => setFormData({...formData, images: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                      placeholder="Or manually edit image URLs (comma separated)"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="productForm"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
