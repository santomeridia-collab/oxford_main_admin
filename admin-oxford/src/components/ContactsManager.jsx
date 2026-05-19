// src/components/ContactsManager.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  Mail,
  Phone,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  BarChart3,
  Loader,
  RefreshCw,
  Users,
} from "lucide-react";
import { contactsService } from "../services/contacts.service";

const ContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, contact, suggestion, review, complaint
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all | reviews | summary
  const [reviewSummary, setReviewSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchContacts();
  }, [filterType, activeTab]);

  useEffect(() => {
    if (activeTab === "summary") {
      fetchReviewSummary();
    }
  }, [activeTab]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (activeTab === "reviews") {
        // Fetch only reviews
        response = await contactsService.getContacts("review");
      } else if (filterType !== "all") {
        // Fetch by specific submission type
        response = await contactsService.getContacts(filterType);
      } else {
        // Fetch all contacts
        response = await contactsService.getContacts();
      }

      console.log("Contacts API Response:", response);

      const responseData = response?.data;

      if (responseData) {
        if (Array.isArray(responseData)) {
          setContacts(responseData);
        } else {
          setContacts([]);
        }
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(err.response?.data?.message || "Failed to fetch contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewSummary = async () => {
    try {
      setSummaryLoading(true);
      const response = await contactsService.getReviewSummary();
      console.log("Review Summary Response:", response);

      // The API returns summary directly (not wrapped in data)
      const summaryData = response?.data || response;
      setReviewSummary(summaryData);
    } catch (err) {
      console.error("Error fetching review summary:", err);
      setError("Failed to fetch review summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  // Filter contacts based on search term (client-side)
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.first_name?.toLowerCase().includes(searchLower) ||
      contact.last_name?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.subject?.toLowerCase().includes(searchLower) ||
      contact.description?.toLowerCase().includes(searchLower) ||
      contact.telephone?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubmissionTypeIcon = (type) => {
    switch (type) {
      case "contact":
        return <MessageSquare className="w-4 h-4" />;
      case "suggestion":
        return <Lightbulb className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      case "complaint":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSubmissionTypeColor = (type) => {
    switch (type) {
      case "contact":
        return "bg-blue-100 text-blue-800";
      case "suggestion":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "complaint":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubmissionTypeBadgeColor = (type) => {
    switch (type) {
      case "contact":
        return "bg-blue-500";
      case "suggestion":
        return "bg-green-500";
      case "review":
        return "bg-yellow-500";
      case "complaint":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseInt(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= numRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />,
      );
    }
    return stars;
  };

  const renderRatingBar = (count, total, label, color) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 w-20">{label}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
      </div>
    );
  };

  const getSubmissionTypeLabel = (type) => {
    return type?.charAt(0).toUpperCase() + type?.slice(1) || "Unknown";
  };

  // Stats for current view
  const statsData = {
    total: contacts.length,
    reviews: contacts.filter((c) => c.submission_type === "review").length,
    contacts: contacts.filter((c) => c.submission_type === "contact").length,
    suggestions: contacts.filter((c) => c.submission_type === "suggestion")
      .length,
    complaints: contacts.filter((c) => c.submission_type === "complaint")
      .length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading contacts...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Contacts & Reviews
          </h2>
          <p className="text-gray-500 mt-1">
            Manage customer submissions and feedback
          </p>
        </div>
        <button
          onClick={fetchContacts}
          className="bg-white text-gray-600 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
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

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setActiveTab("all");
              setFilterType("all");
              setSearchTerm("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-4 h-4 inline mr-1" />
            All Submissions
          </button>
          <button
            onClick={() => {
              setActiveTab("reviews");
              setFilterType("review");
              setSearchTerm("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "reviews"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Star className="w-4 h-4 inline mr-1" />
            Reviews
          </button>
          <button
            onClick={() => {
              setActiveTab("summary");
              setSearchTerm("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "summary"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-1" />
            Summary
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {activeTab !== "summary" && contacts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-800">
              {statsData.total}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-yellow-100">
            <p className="text-sm text-gray-500">Reviews</p>
            <p className="text-2xl font-bold text-yellow-600">
              {statsData.reviews}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-100">
            <p className="text-sm text-gray-500">Contacts</p>
            <p className="text-2xl font-bold text-blue-600">
              {statsData.contacts}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-green-100">
            <p className="text-sm text-gray-500">Suggestions</p>
            <p className="text-2xl font-bold text-green-600">
              {statsData.suggestions}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100">
            <p className="text-sm text-gray-500">Complaints</p>
            <p className="text-2xl font-bold text-red-600">
              {statsData.complaints}
            </p>
          </div>
        </div>
      )}

      {/* Review Summary Section */}
      {activeTab === "summary" && (
        <>
          {summaryLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading summary...</span>
            </div>
          ) : reviewSummary ? (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Review Summary Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Rating */}
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                  <div className="text-5xl font-bold text-yellow-600 mb-2">
                    {reviewSummary.average_rating || 0}
                  </div>
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.round(reviewSummary.average_rating || 0))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Average Rating
                  </p>
                </div>

                {/* Total Reviews */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex flex-col justify-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {reviewSummary.total_count || 0}
                  </div>
                  <div className="flex justify-center mb-2">
                    <Star className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Total Reviews
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg space-y-3">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Rating Distribution
                  </p>
                  {renderRatingBar(
                    reviewSummary.rating_5 || 0,
                    reviewSummary.total_count || 0,
                    "5 Stars",
                    "bg-green-500",
                  )}
                  {renderRatingBar(
                    reviewSummary.rating_4 || 0,
                    reviewSummary.total_count || 0,
                    "4 Stars",
                    "bg-green-400",
                  )}
                  {renderRatingBar(
                    reviewSummary.rating_3 || 0,
                    reviewSummary.total_count || 0,
                    "3 Stars",
                    "bg-yellow-400",
                  )}
                  {renderRatingBar(
                    reviewSummary.rating_2 || 0,
                    reviewSummary.total_count || 0,
                    "2 Stars",
                    "bg-orange-400",
                  )}
                  {renderRatingBar(
                    reviewSummary.rating_1 || 0,
                    reviewSummary.total_count || 0,
                    "1 Star",
                    "bg-red-400",
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No summary data available</p>
            </div>
          )}
        </>
      )}

      {/* Search and Filter Bar */}
      {activeTab !== "summary" && contacts.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, subject, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {activeTab === "all" && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="review">Reviews</option>
                <option value="contact">Contacts</option>
                <option value="suggestion">Suggestions</option>
                <option value="complaint">Complaints</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Contacts List */}
      {activeTab !== "summary" && (
        <>
          {currentContacts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm
                  ? "No results match your search"
                  : "No submissions found"}
              </p>
              <p className="text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : `No ${filterType !== "all" ? filterType : ""} submissions yet`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getSubmissionTypeBadgeColor(contact.submission_type)}`}
                        >
                          {contact.first_name?.charAt(0)?.toUpperCase()}
                          {contact.last_name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {contact.first_name} {contact.last_name}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubmissionTypeColor(contact.submission_type)}`}
                          >
                            {getSubmissionTypeIcon(contact.submission_type)}
                            <span className="ml-1">
                              {getSubmissionTypeLabel(contact.submission_type)}
                            </span>
                          </span>
                        </div>

                        <h5 className="text-sm font-medium text-gray-700 mb-1 truncate">
                          {contact.subject}
                        </h5>

                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                          {contact.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          {contact.email && (
                            <span className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {contact.email}
                            </span>
                          )}
                          {contact.telephone && (
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.telephone}
                            </span>
                          )}
                          {contact.submission_type === "review" &&
                            contact.rating && (
                              <span className="flex items-center">
                                {renderStars(contact.rating)}
                              </span>
                            )}
                          <span>{formatDate(contact.createdAt)}</span>
                        </div>
                      </div>

                      {/* View button */}
                      <div className="flex-shrink-0 self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(contact);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredContacts.length)} of{" "}
                    {filteredContacts.length} submissions
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first, last, current, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis
                        const showEllipsis =
                          index > 0 && page - array[index - 1] > 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 hover:bg-gray-50 text-gray-600"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${getSubmissionTypeBadgeColor(selectedContact.submission_type)}`}
                  >
                    {selectedContact.first_name?.charAt(0)?.toUpperCase()}
                    {selectedContact.last_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedContact.first_name} {selectedContact.last_name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubmissionTypeColor(selectedContact.submission_type)}`}
                    >
                      {getSubmissionTypeIcon(selectedContact.submission_type)}
                      <span className="ml-1">
                        {getSubmissionTypeLabel(
                          selectedContact.submission_type,
                        )}
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Rating for reviews */}
              {selectedContact.submission_type === "review" &&
                selectedContact.rating && (
                  <div className="flex items-center space-x-2 mb-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex">
                      {renderStars(selectedContact.rating)}
                    </div>
                    <span className="text-lg font-semibold text-yellow-700">
                      {selectedContact.rating}/5
                    </span>
                  </div>
                )}

              {/* Subject */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  Subject
                </label>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedContact.subject}
                </p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  Description
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedContact.description}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {selectedContact.email && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Email
                    </label>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      {selectedContact.email}
                    </a>
                  </div>
                )}
                {selectedContact.telephone && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Phone
                    </label>
                    <a
                      href={`tel:${selectedContact.telephone}`}
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedContact.telephone}
                    </a>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    Submitted
                  </label>
                  <p className="text-gray-800">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
                {selectedContact.updatedAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-800">
                      {formatDate(selectedContact.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between">
              <span className="text-sm text-gray-500">
                ID: {selectedContact._id}
              </span>
              <button
                onClick={() => setSelectedContact(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsManager;
