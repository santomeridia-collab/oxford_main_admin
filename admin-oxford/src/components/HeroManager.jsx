// // components/HeroManager.jsx
// import React, { useState } from 'react';
// import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

// const HeroManager = () => {
//   const [heroes, setHeroes] = useState([
//     { id: 1, title: 'Welcome to Our Platform', subtitle: 'Learn and grow with us', buttonText: 'Get Started', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97' },
//     { id: 2, title: 'Innovation Hub', subtitle: 'Building the future together', buttonText: 'Learn More', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa' },
//   ]);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({ title: '', subtitle: '', buttonText: '', image: '' });

//   const handleEdit = (hero) => {
//     setEditingId(hero.id);
//     setFormData(hero);
//   };

//   const handleSave = () => {
//     if (editingId) {
//       setHeroes(heroes.map(h => h.id === editingId ? { ...formData, id: editingId } : h));
//     } else {
//       setHeroes([...heroes, { ...formData, id: Date.now() }]);
//     }
//     setEditingId(null);
//     setFormData({ title: '', subtitle: '', buttonText: '', image: '' });
//   };

//   const handleDelete = (id) => {
//     setHeroes(heroes.filter(h => h.id !== id));
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-800">Hero Section</h2>
//           <p className="text-gray-500 mt-1">Manage your hero banners</p>
//         </div>
//         <button
//           onClick={() => {
//             setEditingId(null);
//             setFormData({ title: '', subtitle: '', buttonText: '', image: '' });
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
//         >
//           <Plus className="w-4 h-4" />
//           <span>Add Hero</span>
//         </button>
//       </div>

//       {/* Form */}
//       {editingId !== null ? (
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Hero' : 'New Hero'}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Title"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="Subtitle"
//               value={formData.subtitle}
//               onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="Button Text"
//               value={formData.buttonText}
//               onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="Image URL"
//               value={formData.image}
//               onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex space-x-2 mt-4">
//             <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
//               <Save className="w-4 h-4" />
//               <span>Save</span>
//             </button>
//             <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center space-x-2">
//               <X className="w-4 h-4" />
//               <span>Cancel</span>
//             </button>
//           </div>
//         </div>
//       ) : null}

//       {/* Heroes List */}
//       <div className="space-y-4">
//         {heroes.map((hero) => (
//           <div key={hero.id} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
//             <img src={hero.image} alt={hero.title} className="w-24 h-16 object-cover rounded-lg" />
//             <div className="flex-1">
//               <h4 className="font-semibold text-gray-800">{hero.title}</h4>
//               <p className="text-gray-500 text-sm">{hero.subtitle}</p>
//               <span className="text-blue-600 text-sm font-medium">{hero.buttonText}</span>
//             </div>
//             <div className="flex space-x-2">
//               <button onClick={() => handleEdit(hero)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
//                 <Edit2 className="w-4 h-4" />
//               </button>
//               <button onClick={() => handleDelete(hero.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeroManager;

// components/HeroManager.jsx

// src/components/HeroManager.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, Loader } from "lucide-react";
import { heroService } from "../services/hero.service";

const HeroManager = () => {
  const [heroes, setHeroes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    image: null,
    imagePreview: "",
  });

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await heroService.getHero();
      console.log("API Response:", response);

      const responseData = response?.data;

      // Handle both single object and array responses
      if (responseData) {
        if (Array.isArray(responseData)) {
          setHeroes(responseData);
        } else if (typeof responseData === "object" && responseData._id) {
          setHeroes([responseData]);
        } else {
          setHeroes([]);
        }
      } else {
        setHeroes([]);
      }
    } catch (err) {
      console.error("Error fetching heroes:", err);
      setError(err.response?.data?.message || "Failed to fetch heroes");
      setHeroes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hero) => {
    setEditingId(hero._id);
    setIsCreating(false);
    setFormData({
      title: hero.title || "",
      subTitle: hero.subTitle || "",
      image: null,
      imagePreview: hero.image || "",
    });
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormData({
      title: "",
      subTitle: "",
      image: null,
      imagePreview: "",
    });
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
    try {
      setSubmitting(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subTitle", formData.subTitle);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingId) {
        await heroService.updateHero(editingId, formDataToSend);
      } else if (isCreating) {
        await heroService.createHero(formDataToSend);
      }

      // Reset form and refresh list
      setEditingId(null);
      setIsCreating(false);
      setFormData({ title: "", subTitle: "", image: null, imagePreview: "" });
      await fetchHeroes();
    } catch (err) {
      console.error("Error saving hero:", err);
      setError(err.response?.data?.message || "Failed to save hero");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero?")) {
      return;
    }

    try {
      setError(null);
      await heroService.deleteHero(id);
      await fetchHeroes();
    } catch (err) {
      console.error("Error deleting hero:", err);
      setError(err.response?.data?.message || "Failed to delete hero");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: "", subTitle: "", image: null, imagePreview: "" });
  };

  // Image error handler
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading heroes...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Hero Section</h2>
          <p className="text-gray-500 mt-1">Manage your hero banners</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero</span>
        </button>
      </div>

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

      {/* Form */}
      {(editingId !== null || isCreating) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Hero" : "New Hero"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                placeholder="Enter hero title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle *
              </label>
              <input
                type="text"
                placeholder="Enter hero subtitle"
                value={formData.subTitle}
                onChange={(e) =>
                  setFormData({ ...formData, subTitle: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex items-start space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
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
                      className="w-32 h-20 object-cover rounded-lg border"
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
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSave}
              disabled={submitting || !formData.title || !formData.subTitle}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center space-x-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Heroes List */}
      {!loading && heroes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No heroes found</p>
          <p className="text-gray-400">
            Create your first hero banner to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {heroes.map((hero) => (
            <div
              key={hero._id}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={hero.image}
                  alt={hero.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 truncate">
                  {hero.title}
                </h4>
                <p className="text-gray-500 text-sm truncate">
                  {hero.subTitle}
                </p>
                {hero.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Created: {new Date(hero.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(hero)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit hero"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(hero._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete hero"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

     
    </div>
  );
};

export default HeroManager;