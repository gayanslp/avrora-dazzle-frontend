'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  UploadCloud, 
  ExternalLink, 
  Sliders, 
  Eye, 
  X, 
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../../utils/cloudinary';

const defaultFormState = {
  image: '',
  category: 'NEW COLLECTION',
  tagline: 'Tailored Luxury & Modern Sartorial Elegance',
  buttonText: 'Shop Collection',
  link: '/products',
  isActive: true,
};

const AdminHeroSlidesPage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(defaultFormState);
  const [previewSlide, setPreviewSlide] = useState(null);

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/settings/hero-slides');
      if (res.data?.slides && Array.isArray(res.data.slides)) {
        setSlides(res.data.slides);
      }
    } catch (err) {
      console.error('Failed to load hero slides:', err);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setFormData(defaultFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (index) => {
    setEditingIndex(index);
    setFormData({ ...slides[index] });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setFormData(defaultFormState);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.info('Uploading slide banner image...');
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSlideForm = async (e) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      toast.error('Please provide or upload a banner image');
      return;
    }

    let updatedSlides = [...slides];
    if (editingIndex !== null) {
      // Edit existing
      updatedSlides[editingIndex] = { ...formData };
    } else {
      // Add new
      updatedSlides.push({ ...formData });
    }

    await saveSlidesToBackend(updatedSlides, editingIndex !== null ? 'Slide updated successfully' : 'New hero slide added successfully');
    handleCloseModal();
  };

  const saveSlidesToBackend = async (newSlides, successMessage) => {
    try {
      setSaving(true);
      const res = await axiosInstance.put('/settings/hero-slides', {
        slides: newSlides,
      });

      if (res.data?.success) {
        setSlides(res.data.slides || newSlides);
        if (successMessage) toast.success(successMessage);
      }
    } catch (err) {
      console.error('Failed to save slides:', err);
      toast.error(err.response?.data?.message || 'Failed to update hero slides');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = (index) => {
    const updated = [...slides];
    updated[index].isActive = !updated[index].isActive;
    saveSlidesToBackend(updated, `Slide ${updated[index].isActive ? 'activated' : 'deactivated'}`);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...slides];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    saveSlidesToBackend(updated, 'Slide moved up');
  };

  const handleMoveDown = (index) => {
    if (index === slides.length - 1) return;
    const updated = [...slides];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    saveSlidesToBackend(updated, 'Slide moved down');
  };

  const handleDeleteSlide = async (index) => {
    if (slides.length <= 1) {
      toast.warning('At least one hero banner slide is recommended for the homepage carousel.');
    }
    const confirmed = window.confirm('Are you sure you want to remove this hero slide?');
    if (!confirmed) return;

    const slideToDelete = slides[index];
    if (slideToDelete._id) {
      try {
        setSaving(true);
        const res = await axiosInstance.delete(`/settings/hero-slides/${slideToDelete._id}`);
        if (res.data?.success) {
          setSlides(res.data.slides);
          toast.success('Hero slide deleted successfully');
        }
      } catch (err) {
        console.error('Failed to delete slide:', err);
        toast.error(err.response?.data?.message || 'Failed to delete hero slide');
      } finally {
        setSaving(false);
      }
    } else {
      const updated = slides.filter((_, i) => i !== index);
      saveSlidesToBackend(updated, 'Hero slide deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <Sliders className="text-indigo-600" size={26} />
            Hero Banner Slides
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage, upload and customize high-impact editorial carousel slides displayed on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Slides</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{slides.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ImageIcon size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active on Homepage</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {slides.filter((s) => s.isActive !== false).length}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rotation Delay</p>
            <p className="text-2xl font-black text-slate-800 mt-1">5.0s</p>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <RefreshCw size={22} />
          </div>
        </div>
      </div>

      {/* Slides Listing */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Current Hero Slides</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Re-order, edit text titles, button links, or toggle visibility.
            </p>
          </div>
          {saving && (
            <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
              <RefreshCw size={13} className="animate-spin" /> Saving changes...
            </span>
          )}
        </div>

        {slides.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ImageIcon size={44} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No slides configured yet.</p>
            <p className="text-xs mt-1">Click "Add New Slide" to create your first homepage carousel slide.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {slides.map((slide, index) => {
              const isActive = slide.isActive !== false;
              return (
                <div 
                  key={slide._id || index}
                  className={`p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                    !isActive ? 'bg-slate-50/70 opacity-75' : 'hover:bg-slate-50/40'
                  }`}
                >
                  {/* Left: Reorder Controls + Thumbnail + Details */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === slides.length - 1}
                        title="Move Down"
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-600 transition"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Order Badge */}
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    {/* Slide Thumbnail Preview */}
                    <div className="relative w-32 h-20 sm:w-44 sm:h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 group">
                      <img
                        src={slide.image}
                        alt={slide.category || 'Hero Slide'}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewSlide(slide)}
                        title="Live Preview"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 cursor-pointer font-medium"
                      >
                        <Eye size={14} /> Preview
                      </button>
                    </div>

                    {/* Slide Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {slide.category || 'HERO SLIDE'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold flex items-center gap-1 ${
                          isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800 truncate">
                        {slide.tagline || 'Editorial Campaign'}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="font-medium text-slate-700">Button: "{slide.buttonText || 'Shop Now'}"</span>
                        <span>•</span>
                        <span className="text-slate-400 truncate max-w-[200px]">Link: {slide.link || '/products'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 justify-end shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <button
                      onClick={() => handleToggleActive(index)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        isActive 
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isActive ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(index)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Edit Slide"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      onClick={() => handleDeleteSlide(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 relative my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="text-indigo-600" size={20} />
                {editingIndex !== null ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSlideForm} className="mt-5 space-y-4">
              {/* Image Input Section (Upload or URL) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Slide Banner Image *
                </label>

                {/* Upload or URL tabs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-xl cursor-pointer transition ${
                      isUploading 
                        ? 'bg-slate-50 border-slate-300 text-slate-400' 
                        : 'bg-indigo-50/50 border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                    }`}>
                      <UploadCloud size={18} />
                      <span className="text-xs font-bold">
                        {isUploading ? 'Uploading Image...' : 'Upload Image from Computer'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Or enter image URL (e.g. /hero_slide_gents_1.jpg or https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Image Live Thumbnail Preview */}
                {formData.image && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-950">
                    <img
                      src={formData.image}
                      alt="Slide preview"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-3 flex flex-col justify-end text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">
                        {formData.category || 'PREVIEW'}
                      </span>
                      <p className="text-xs font-medium text-white/90 truncate">
                        {formData.tagline || 'Tagline'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Category Pill Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Tag (Pill Badge) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. GENTS BESPOKE TAILORING, BRIDAL COLLECTION"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Editorial Tagline / Subtitle *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tailored Luxury & Modern Sartorial Elegance"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Button Text & Target Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Button Label *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Gents Wear"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Route / URL *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /products/mens or /products/bridal-wear"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="slideIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="slideIsActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Activate this slide immediately on the homepage carousel
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || isUploading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition text-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} /> Save Slide
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Simulation Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative">
            <button
              onClick={() => setPreviewSlide(null)}
              className="absolute top-4 right-4 z-30 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Simulated Hero Slide */}
            <div className="relative w-full h-[450px] overflow-hidden">
              <img
                src={previewSlide.image}
                alt="Live Preview"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/40 to-transparent"></div>
              
              <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-center max-w-xl text-white">
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-black/40 backdrop-blur-md border border-white/20 w-fit">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{previewSlide.category}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider font-cinzel">
                  AVRORA <span className="font-light">DAZZLE</span>
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-white/90 uppercase tracking-widest font-light">
                  {previewSlide.tagline}
                </p>

                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white text-slate-950 shadow-lg">
                    {previewSlide.buttonText} →
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
              Homepage Live Simulation Preview • Target URL: <code className="text-cyan-400">{previewSlide.link}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroSlidesPage;
