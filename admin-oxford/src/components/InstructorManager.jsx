// src/components/InstructorManager.jsx
import React, { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Save, X, Upload, Loader, Search,
  Mail, Phone, User, BookOpen, ChevronLeft, ChevronRight, 
  Eye, RefreshCw, Users, Award, Briefcase
} from "lucide-react";
import { instructorService } from "../services/instructor.service";

const InstructorManager = () => {
  const [instructors, setInstructors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const itemsPerPage = 8;
  
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    bio: "",
    contact: "",
    photo: null,
    photoPreview: "",
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await instructorService.getAllInstructors();
      console.log("Instructors API Response:", response);

      const responseData = response?.data;

      if (responseData) {
        if (Array.isArray(responseData)) {
          setInstructors(responseData);
        } else {
          setInstructors([]);
        }
      } else {
        setInstructors([]);
      }
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setError(err.response?.data?.message || "Failed to fetch instructors");
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique sections for filter
  const sections = [...new Set(instructors.map(i => i.section).filter(Boolean))].sort();

  // Filter instructors based on search and section
  const filteredInstructors = instructors.filter((instructor) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      instructor.name?.toLowerCase().includes(searchLower) ||
      instructor.section?.toLowerCase().includes(searchLower) ||
      instructor.bio?.toLowerCase().includes(searchLower) ||
      instructor.contact?.toLowerCase().includes(searchLower);

    const matchesSection = filterSection === "all" || instructor.section === filterSection;

    return matchesSearch && matchesSection;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInstructors = filteredInstructors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSection]);

  const handleEdit = (instructor) => {
    setEditingId(instructor._id);
    setIsCreating(false);
    setFormData({
      name: instructor.name || "",
      section: instructor.section || "",
      bio: instructor.bio || "",
      contact: instructor.contact || "",
      photo: null,
      photoPreview: instructor.photo || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormData({
      name: "",
      section: "",
      bio: "",
      contact: "",
      photo: null,
      photoPreview: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.section || !formData.bio || !formData.contact) {
      setError("Please fill in all required fields");
      return;
    }

    if (!editingId && !formData.photo) {
      setError("Please select a photo");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("section", formData.section);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("contact", formData.contact);

      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      if (editingId) {
        await instructorService.updateInstructor(editingId, formDataToSend);
        setSuccess("Instructor updated successfully!");
      } else if (isCreating) {
        await instructorService.createInstructor(formDataToSend);
        setSuccess("Instructor added successfully!");
      }

      setEditingId(null);
      setIsCreating(false);
      setFormData({
        name: "",
        section: "",
        bio: "",
        contact: "",
        photo: null,
        photoPreview: "",
      });
      await fetchInstructors();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving instructor:", err);
      setError(err.response?.data?.message || "Failed to save instructor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this instructor?")) {
      return;
    }

    try {
      setError(null);
      await instructorService.deleteInstructor(id);
      setSuccess("Instructor deleted successfully!");
      await fetchInstructors();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting instructor:", err);
      setError(err.response?.data?.message || "Failed to delete instructor");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      name: "",
      section: "",
      bio: "",
      contact: "",
      photo: null,
      photoPreview: "",
    });
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gUGhvdG88L3RleHQ+PC9zdmc+";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  const statsData = {
    total: instructors.length,
    sections: sections.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading instructors...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Instructors</h2>
          <p className="text-gray-500 mt-1">Manage your teaching staff</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInstructors}
            className="bg-white text-gray-600 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Instructor</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-600">{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-600">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      {instructors.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Instructors</p>
                <p className="text-2xl font-bold text-gray-800">{statsData.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sections</p>
                <p className="text-2xl font-bold text-purple-600">{statsData.sections}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      {instructors.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, section, bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {sections.length > 0 && (
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[180px]"
            >
              <option value="all">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Form */}
      {(editingId !== null || isCreating) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            {editingId ? (
              <><Edit2 className="w-5 h-5 mr-2 text-blue-600" />Edit Instructor</>
            ) : (
              <><Plus className="w-5 h-5 mr-2 text-green-600" />New Instructor</>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="e.g., Dr. John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section *</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  list="sections-list"
                  required
                />
                <datalist id="sections-list">
                  {sections.map((sec) => (
                    <option key={sec} value={sec} />
                  ))}
                </datalist>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="e.g., +1 234 567 890"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
              <textarea
                placeholder="Write instructor biography..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo {!editingId && "*"}
              </label>
              <div className="flex items-start space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {formData.photo ? formData.photo.name : "Click to upload photo"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                {formData.photoPreview && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={handleImageError}
                    />
                    <button
                      onClick={() => setFormData({ ...formData, photo: null, photoPreview: "" })}
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
              disabled={submitting || !formData.name || !formData.section || !formData.bio || !formData.contact || (!editingId && !formData.photo)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{submitting ? "Saving..." : "Save Instructor"}</span>
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

      {/* Instructors Grid */}
      {currentInstructors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || filterSection !== "all" ? "No instructors match your filters" : "No instructors found"}
          </p>
          <p className="text-gray-400">
            {searchTerm || filterSection !== "all" ? "Try adjusting your search" : "Add your first instructor!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentInstructors.map((instructor) => (
              <div
                key={instructor._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group border border-gray-100"
              >
                {/* Photo */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={instructor.photo}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                  />
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedInstructor(instructor)}
                      className="p-2 bg-white rounded-lg shadow text-blue-600 hover:bg-blue-50"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(instructor)}
                      className="p-2 bg-white rounded-lg shadow text-green-600 hover:bg-green-50"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(instructor._id)}
                      className="p-2 bg-white rounded-lg shadow text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 truncate">{instructor.name}</h4>
                  <p className="text-sm text-blue-600 font-medium mb-2">{instructor.section}</p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{instructor.bio}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {instructor.contact}
                    </span>
                    <span>{formatDate(instructor.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInstructors.length)} of {filteredInstructors.length} instructors
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedInstructor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInstructor(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 bg-gray-100">
              <img
                src={selectedInstructor.photo}
                alt={selectedInstructor.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <button
                onClick={() => setSelectedInstructor(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">{selectedInstructor.name}</h3>
                <p className="text-blue-200">{selectedInstructor.section}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 block mb-1">Biography</label>
                <p className="text-gray-700 leading-relaxed">{selectedInstructor.bio}</p>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-4">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <label className="text-xs font-medium text-gray-500 block">Contact</label>
                  <p className="text-gray-800 font-medium">{selectedInstructor.contact}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => { setSelectedInstructor(null); handleEdit(selectedInstructor); }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Edit2 className="w-4 h-4 inline mr-1" />Edit
                </button>
                <button
                  onClick={() => setSelectedInstructor(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManager;