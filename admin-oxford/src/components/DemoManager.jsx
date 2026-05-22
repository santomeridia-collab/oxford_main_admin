// src/components/DemoManager.jsx
import React, { useState, useEffect } from "react";
import { 
  Search, Mail, Phone, User, BookOpen, Calendar, 
  ChevronLeft, ChevronRight, X, Eye, Loader, RefreshCw,
  Users, GraduationCap, Clock, Filter
} from "lucide-react";
import { demoService } from "../services/demo.service";

const DemoManager = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await demoService.getDemos();
      console.log("Demo Requests API Response:", response);

      const responseData = response?.data;

      if (responseData) {
        if (Array.isArray(responseData)) {
          setDemos(responseData);
        } else {
          setDemos([]);
        }
      } else {
        setDemos([]);
      }
    } catch (err) {
      console.error("Error fetching demo requests:", err);
      setError(err.response?.data?.message || "Failed to fetch demo requests");
      setDemos([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique courses for filter
  const courses = [...new Set(demos.map(demo => demo.course).filter(Boolean))].sort();

  // Filter demos based on search and course
  const filteredDemos = demos.filter((demo) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      demo.fullName?.toLowerCase().includes(searchLower) ||
      demo.email?.toLowerCase().includes(searchLower) ||
      demo.phoneNumber?.toLowerCase().includes(searchLower) ||
      demo.course?.toLowerCase().includes(searchLower);

    const matchesCourse = filterCourse === "all" || demo.course === filterCourse;

    return matchesSearch && matchesCourse;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDemos = filteredDemos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDemos.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCourse]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
      'bg-indigo-500', 'bg-red-500'
    ];
    if (!name) return colors[0];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Stats
  const statsData = {
    total: demos.length,
    todayCount: demos.filter(d => {
      const today = new Date();
      const demoDate = new Date(d.createdAt);
      return demoDate.toDateString() === today.toDateString();
    }).length,
    uniqueCourses: courses.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading demo requests...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Demo Requests</h2>
          <p className="text-gray-500 mt-1">View and manage demo registration requests</p>
        </div>
        <button
          onClick={fetchDemos}
          className="bg-white text-gray-600 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
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

      {/* Stats Cards */}
      {demos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{statsData.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Requests</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{statsData.todayCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unique Courses</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{statsData.uniqueCourses}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      {demos.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {courses.length > 0 && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Demo Requests List */}
      {currentDemos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || filterCourse !== "all"
              ? "No demo requests match your filters"
              : "No demo requests found"}
          </p>
          <p className="text-gray-400">
            {searchTerm || filterCourse !== "all"
              ? "Try adjusting your search or filters"
              : "Demo requests will appear here when users submit them"}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
              <div className="col-span-3">Student</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-2">Course</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {currentDemos.map((demo) => (
                <div
                  key={demo._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Student Info */}
                  <div className="md:col-span-3 flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${getAvatarColor(demo.fullName)}`}>
                      {getInitials(demo.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{demo.fullName}</p>
                      <p className="text-xs text-gray-400 md:hidden">
                        {demo.course} • {formatDate(demo.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="md:col-span-3 space-y-1">
                    <a 
                      href={`mailto:${demo.email}`}
                      className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{demo.email}</span>
                    </a>
                    {demo.phoneNumber && (
                      <a 
                        href={`tel:${demo.phoneNumber}`}
                        className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{demo.phoneNumber}</span>
                      </a>
                    )}
                  </div>

                  {/* Course */}
                  <div className="md:col-span-2">
                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {demo.course}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400 md:hidden" />
                      {formatDate(demo.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex justify-end space-x-1">
                    <button
                      onClick={() => setSelectedDemo(demo)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards (Alternative view for small screens) */}
          <div className="md:hidden space-y-4 mt-4">
            {currentDemos.map((demo) => (
              <div
                key={demo._id}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(demo.fullName)}`}>
                    {getInitials(demo.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{demo.fullName}</p>
                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mt-1">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {demo.course}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDemo(demo)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  <a href={`mailto:${demo.email}`} className="flex items-center hover:text-blue-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {demo.email}
                  </a>
                  {demo.phoneNumber && (
                    <a href={`tel:${demo.phoneNumber}`} className="flex items-center hover:text-blue-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {demo.phoneNumber}
                    </a>
                  )}
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(demo.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDemos.length)} of {filteredDemos.length} requests
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50 text-gray-600'
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
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedDemo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDemo(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {getInitials(selectedDemo.fullName)}
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{selectedDemo.fullName}</h3>
                    <p className="text-blue-100 text-sm">Demo Request</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDemo(null)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Course */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <label className="text-xs font-medium text-gray-500 block mb-1">Requested Course</label>
                <p className="text-lg font-semibold text-blue-700 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  {selectedDemo.course}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <label className="text-xs font-medium text-gray-500 block">Email</label>
                    <a href={`mailto:${selectedDemo.email}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {selectedDemo.email}
                    </a>
                  </div>
                </div>

                {selectedDemo.phoneNumber && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <label className="text-xs font-medium text-gray-500 block">Phone</label>
                      <a href={`tel:${selectedDemo.phoneNumber}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        {selectedDemo.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <label className="text-xs font-medium text-gray-500 block">Submitted</label>
                    <p className="text-gray-800 font-medium">{formatDate(selectedDemo.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                <p>Request ID: {selectedDemo._id}</p>
                {selectedDemo.updatedAt && (
                  <p className="mt-1">Last Updated: {formatDate(selectedDemo.updatedAt)}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="flex space-x-2">
                <a
                  href={`mailto:${selectedDemo.email}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Send Email
                </a>
                {selectedDemo.phoneNumber && (
                  <a
                    href={`tel:${selectedDemo.phoneNumber}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedDemo(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
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

export default DemoManager;