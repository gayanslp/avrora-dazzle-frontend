import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { Grid, Plus, Edit2, Trash2, X, UploadCloud } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image: '' });
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
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/category');
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug, image: category.image || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await axiosInstance.put(`/category/${editingCategory._id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await axiosInstance.post('/category', formData);
        toast.success('Category created successfully');
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will also delete ALL subcategories under this category.')) return;

    try {
      // 1. Fetch ALL subcategories and filter ones that belong to this category
      const subRes = await axiosInstance.get('/sub-category');
      const allSubs = Array.isArray(subRes.data) ? subRes.data : (subRes.data?.subCategories ?? []);
      const childSubs = allSubs.filter(
        (sub) => sub.mainCategory?._id === id || sub.mainCategory === id
      );

      // 2. Delete all child subcategories in parallel
      await Promise.all(childSubs.map((sub) => axiosInstance.delete(`/sub-category/${sub._id}`)));

      // 3. Delete the main category itself
      await axiosInstance.delete(`/category/${id}`);

      toast.success(`Category deleted (${childSubs.length} subcategory${childSubs.length !== 1 ? 'ies' : ''} removed)`);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
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
            {categories.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-12">
                No categories found. Create one to get started.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category._id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-slate-100 flex items-center justify-center relative group">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <Grid size={40} className="text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenModal(category)} className="p-2 bg-white text-slate-800 rounded-full hover:text-indigo-600">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(category._id)} className="p-2 bg-white text-slate-800 rounded-full hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800">{category.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Slug: {category.slug}</p>
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
                {editingCategory ? 'Edit Category' : 'Add Category'}
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

export default AdminCategoriesPage;
