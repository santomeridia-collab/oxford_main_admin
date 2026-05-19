// src/components/GalleryManager.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, Loader, Image, ZoomIn, Search } from "lucide-react";
import { galleryService } from "../services/gallery.service";

const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [formData, setFormData] = useState({
    caption: "",
    image: null,
    imagePreview: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await galleryService.getGallery();
      console.log("Gallery API Response:", response);

const responseData = response?.data;
      if (responseData) {
        if (Array.isArray(responseData)) {
          setGallery(responseData);
        } else {
          setGallery([]);
        }
      } else {
        setGallery([]);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError(err.response?.data?.message || "Failed to fetch gallery");
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setIsCreating(false);
    setFormData({
      caption: item.caption || "",
      image: null,
      imagePreview: item.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormData({
      caption: "",
      image: null,
      imagePreview: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.caption) {
      setError("Please enter a caption");
      return;
    }

    if (!editingId && !formData.image) {
      setError("Please select an image");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append("caption", formData.caption);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingId) {
        await galleryService.updateGallery(editingId, formDataToSend);
        setSuccess("Gallery item updated successfully!");
      } else if (isCreating) {
        await galleryService.createGallery(formDataToSend);
        setSuccess("Gallery item added successfully!");
      }

      // Reset form and refresh list
      setEditingId(null);
      setIsCreating(false);
      setFormData({
        caption: "",
        image: null,
        imagePreview: "",
      });
      await fetchGallery();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving gallery item:", err);
      setError(err.response?.data?.message || "Failed to save gallery item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) {
      return;
    }

    try {
      setError(null);
      await galleryService.deleteGallery(id);
      setSuccess("Gallery item deleted successfully!");
      await fetchGallery();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      setError(err.response?.data?.message || "Failed to delete gallery item");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      caption: "",
      image: null,
      imagePreview: "",
    });
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
  };

  // Filter gallery based on search term
  const filteredGallery = gallery.filter((item) =>
    item.caption?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading gallery...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gallery</h2>
          <p className="text-gray-500 mt-1">Manage your image gallery</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Image</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-600">{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="text-green-400 hover:text-green-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-600">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      {gallery.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by caption..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Form */}
      {(editingId !== null || isCreating) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            {editingId ? (
              <>
                <Edit2 className="w-5 h-5 mr-2 text-blue-600" />
                Edit Gallery Item
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2 text-green-600" />
                New Gallery Item
              </>
            )}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption *
              </label>
              <input
                type="text"
                placeholder="Enter image caption"
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {!editingId && "*"}
              </label>
              <div className="flex items-start space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {formData.image
                        ? formData.image.name
                        : "Click to upload image"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {formData.imagePreview && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-40 h-28 object-cover rounded-lg border"
                      onError={handleImageError}
                    />
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          image: null,
                          imagePreview: "",
                        })
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2 mt-6">
            <button
              onClick={handleSave}
              disabled={submitting || !formData.caption || (!editingId && !formData.image)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{submitting ? "Saving..." : "Save"}</span>
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 flex items-center space-x-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Gallery Content */}
      {!loading && filteredGallery.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? "No images match your search" : "No images in gallery"}
          </p>
          <p className="text-gray-400">
            {searchTerm
              ? "Try a different search term"
              : "Add your first image to get started!"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group border border-gray-100"
            >
              {/* Image */}
              <div className="relative  bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover"
                  onError={handleImageError}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="p-2 bg-white rounded-lg shadow text-blue-600 hover:bg-blue-50 transition-colors"
                      title="View"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-white rounded-lg shadow text-green-600 hover:bg-green-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-white rounded-lg shadow text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {item.caption}
                </p>
                {item.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredGallery.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4 hover:shadow-md transition-all duration-300 group border border-gray-100"
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {item.caption}
                </p>
                {item.createdAt && (
                  <p className="text-sm text-gray-400 mt-1">
                    Added: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setSelectedImage(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.caption}
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={handleImageError}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-lg font-medium text-gray-800">
                {selectedImage.caption}
              </p>
              {selectedImage.createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Added: {new Date(selectedImage.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Stats */}
      {gallery.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Total Images: <strong>{gallery.length}</strong>
            </span>
            {searchTerm && (
              <span>
                Showing: <strong>{filteredGallery.length}</strong> results
              </span>
            )}
          </div>
        </div>
      )}

     
    </div>
  );
};

export default GalleryManager;