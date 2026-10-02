import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { Grid, Plus, Edit2, Trash2, X, UploadCloud } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { fetchCategories } from '../../api/categoryApi';

const AdminSubCategoriesPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', category: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, image: url });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchSubCategoriesForSideBar();
    // Load main categories for the dropdown
    fetchCategories().then((data) => {
      const cats = Array.isArray(data) ? data : (data?.categories ?? []);
      setCategories(cats);
    });
  }, []);

  const fetchSubCategoriesForSideBar = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/sub-category');
      setSubcategories(Array.isArray(res.data) ? res.data : res.data.subcategories || []);
    } catch (error) {
      toast.error('Failed to load subcategories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (subCat = null) => {
    if (subCat) {
      setEditingSubCategory(subCat);
      setFormData({
        name: subCat.name,
        slug: subCat.slug,
        category: subCat.mainCategory?._id ?? subCat.mainCategory ?? '',
        image: subCat.image || '',
      });
    } else {
      setEditingSubCategory(null);
      setFormData({ name: '', slug: '', category: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Backend schema uses "mainCategory" not "category"
      const payload = {
        name: formData.name,
        slug: formData.slug,
        mainCategory: formData.category,
        ...(formData.image && { image: formData.image }),
      };
      if (editingSubCategory) {
        await axiosInstance.put(`/sub-category/${editingSubCategory._id}`, payload);
        toast.success('SubCategory updated successfully');
      } else {
        await axiosInstance.post('/sub-category', payload);
        toast.success('SubCategory created successfully');
      }
      fetchSubCategoriesForSideBar();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save subcategory');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    
    try {
      await axiosInstance.delete(`/sub-category/${id}`);
      toast.success('SubCategory deleted');
      fetchSubCategoriesForSideBar();
    } catch (error) {
      toast.error('Failed to delete subcategory');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 text-sm">Manage product categories</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {subcategories.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-12">
                No subcategories found. Create one to get started.
              </div>
            ) : (
              subcategories.map((subcategory) => (
                <div key={subcategory._id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-slate-100 flex items-center justify-center relative group">
                    {subcategory.image ? (
                      <img src={subcategory.image} alt={subcategory.name} className="w-full h-full object-cover" />
                    ) : (
                      <Grid size={40} className="text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenModal(subcategory)} className="p-2 bg-white text-slate-800 rounded-full hover:text-indigo-600">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(subcategory._id)} className="p-2 bg-white text-slate-800 rounded-full hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800">{subcategory.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Slug: {subcategory.slug}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingSubCategory ? 'Edit SubCategory' : 'Add SubCategory'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="E.g., Men's Clothing"
                />
              </div>

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
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="E.g., mens-clothing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category Image</label>
                <div className="flex flex-col gap-3">
                  {formData.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 shadow-sm hover:bg-red-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <label className={`flex items-center justify-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer transition ${isUploading ? 'bg-slate-50 border-slate-300 text-slate-400' : 'bg-slate-50 border-indigo-300 text-indigo-600 hover:bg-indigo-50'}`}>
                    <UploadCloud size={18} />
                    <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                  <input 
                    type="url" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Or paste image URL directly"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-70"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubCategoriesPage;
