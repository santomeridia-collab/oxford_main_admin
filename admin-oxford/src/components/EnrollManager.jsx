// src/components/EnrollManager.jsx
import React, { useState, useEffect } from "react";
import { 
  Search, Mail, Phone, User, BookOpen, Calendar, 
  ChevronLeft, ChevronRight, X, Eye, Loader, RefreshCw,
  Users, GraduationCap, Clock, Filter, TrendingUp,
  UserCheck, Download
} from "lucide-react";
import { enrollService } from "../services/enroll.service";

const EnrollManager = () => {
  const [enrolls, setEnrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnroll, setSelectedEnroll] = useState(null);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name, course
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEnrolls();
  }, []);

  const fetchEnrolls = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await enrollService.getEnrolls();
      console.log("Enrollments API Response:", response);

      const responseData = response?.data;

      if (responseData) {
        if (Array.isArray(responseData)) {
          setEnrolls(responseData);
        } else {
          setEnrolls([]);
        }
      } else {
        setEnrolls([]);
      }
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError(err.response?.data?.message || "Failed to fetch enrollments");
      setEnrolls([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique courses for filter
  const courses = [...new Set(enrolls.map(enroll => enroll.course).filter(Boolean))].sort();

  // Sort enrollments
  const sortedEnrolls = [...enrolls].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "name":
        return (a.fullName || '').localeCompare(b.fullName || '');
      case "course":
        return (a.course || '').localeCompare(b.course || '');
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Filter enrolls based on search and course
  const filteredEnrolls = sortedEnrolls.filter((enroll) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      enroll.fullName?.toLowerCase().includes(searchLower) ||
      enroll.email?.toLowerCase().includes(searchLower) ||
      enroll.phoneNumber?.toLowerCase().includes(searchLower) ||
      enroll.course?.toLowerCase().includes(searchLower);

    const matchesCourse = filterCourse === "all" || enroll.course === filterCourse;

    return matchesSearch && matchesCourse;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnrolls = filteredEnrolls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEnrolls.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCourse, sortBy]);

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
      'from-blue-500 to-blue-600', 'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 
      'from-pink-500 to-pink-600', 'from-teal-500 to-teal-600',
      'from-indigo-500 to-indigo-600', 'from-red-500 to-red-600'
    ];
    if (!name) return colors[0];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getCourseColor = (course) => {
    const colors = [
      'bg-blue-50 text-blue-700', 'bg-green-50 text-green-700',
      'bg-purple-50 text-purple-700', 'bg-orange-50 text-orange-700',
      'bg-pink-50 text-pink-700', 'bg-teal-50 text-teal-700',
    ];
    if (!course) return colors[0];
    const index = course.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Stats
  const today = new Date();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const statsData = {
    total: enrolls.length,
    todayCount: enrolls.filter(e => {
      const enrollDate = new Date(e.createdAt);
      return enrollDate.toDateString() === today.toDateString();
    }).length,
    thisWeekCount: enrolls.filter(e => {
      const enrollDate = new Date(e.createdAt);
      return enrollDate >= thisWeekStart;
    }).length,
    uniqueCourses: courses.length,
    recentEnrolls: enrolls.slice(0, 5),
  };

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone Number', 'Course', 'Enrollment Date'];
    const csvData = filteredEnrolls.map(enroll => [
      enroll.fullName,
      enroll.email,
      enroll.phoneNumber,
      enroll.course,
      formatDate(enroll.createdAt)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enrollments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading enrollments...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Course Enrollments</h2>
          <p className="text-gray-500 mt-1">View and manage student course enrollments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="bg-white text-gray-600 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
            title="Export to CSV"
            disabled={filteredEnrolls.length === 0}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={fetchEnrolls}
            className="bg-white text-gray-600 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
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
      {enrolls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{statsData.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{statsData.todayCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{statsData.thisWeekCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Courses</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{statsData.uniqueCourses}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      {enrolls.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
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
          
          {/* Course Filter */}
          {courses.length > 0 && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[180px]"
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

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">By Name</option>
              <option value="course">By Course</option>
            </select>
          </div>
        </div>
      )}

      {/* Enrollments Table */}
      {currentEnrolls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || filterCourse !== "all"
              ? "No enrollments match your filters"
              : "No enrollments found"}
          </p>
          <p className="text-gray-400">
            {searchTerm || filterCourse !== "all"
              ? "Try adjusting your search or filters"
              : "Enrollments will appear here when students enroll in courses"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentEnrolls.map((enroll, index) => (
                    <tr 
                      key={enroll._id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedEnroll(enroll)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(enroll.fullName)} flex items-center justify-center text-white font-semibold text-xs flex-shrink-0`}>
                            {getInitials(enroll.fullName)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{enroll.fullName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <a 
                            href={`mailto:${enroll.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 mr-1" />
                            <span className="truncate max-w-[200px]">{enroll.email}</span>
                          </a>
                          {enroll.phoneNumber && (
                            <a 
                              href={`tel:${enroll.phoneNumber}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 mr-1" />
                              <span>{enroll.phoneNumber}</span>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCourseColor(enroll.course)}`}>
                          <BookOpen className="w-3 h-3 mr-1" />
                          {enroll.course}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {formatDate(enroll.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEnroll(enroll);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {currentEnrolls.map((enroll, index) => (
              <div
                key={enroll._id}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedEnroll(enroll)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(enroll.fullName)} flex items-center justify-center text-white font-semibold text-sm`}>
                      {getInitials(enroll.fullName)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{enroll.fullName}</p>
                      <p className="text-xs text-gray-400">#{indexOfFirstItem + index + 1}</p>
                    </div>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCourseColor(enroll.course)}`}>
                    <BookOpen className="w-3 h-3 mr-1" />
                    {enroll.course}
                  </span>
                  <div className="space-y-1 text-sm text-gray-500">
                    <a href={`mailto:${enroll.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center hover:text-blue-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {enroll.email}
                    </a>
                    {enroll.phoneNumber && (
                      <a href={`tel:${enroll.phoneNumber}`} onClick={(e) => e.stopPropagation()} className="flex items-center hover:text-blue-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {enroll.phoneNumber}
                      </a>
                    )}
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(enroll.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination & Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100 gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastItem, filteredEnrolls.length)}</span> of{" "}
              <span className="font-medium">{filteredEnrolls.length}</span> enrollments
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-sm'
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
            )}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedEnroll && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEnroll(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {getInitials(selectedEnroll.fullName)}
                    </span>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{selectedEnroll.fullName}</h3>
                    <p className="text-blue-100 text-sm">Student Enrollment</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEnroll(null)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Course */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <label className="text-xs font-medium text-gray-500 block mb-1">Enrolled Course</label>
                <p className="text-xl font-bold text-blue-700 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  {selectedEnroll.course}
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs font-medium text-gray-500 block">Email Address</label>
                    <a 
                      href={`mailto:${selectedEnroll.email}`} 
                      className="text-blue-600 hover:text-blue-700 font-medium truncate block"
                    >
                      {selectedEnroll.email}
                    </a>
                  </div>
                </div>

                {selectedEnroll.phoneNumber && (
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-medium text-gray-500 block">Phone Number</label>
                      <a 
                        href={`tel:${selectedEnroll.phoneNumber}`} 
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {selectedEnroll.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block">Enrollment Date</label>
                    <p className="text-gray-800 font-medium">{formatDate(selectedEnroll.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Enrollment ID</p>
                    <p className="text-gray-700 font-mono text-xs truncate">{selectedEnroll._id}</p>
                  </div>
                  {selectedEnroll.updatedAt && (
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="text-gray-700">{formatDate(selectedEnroll.updatedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="flex space-x-2">
                <a
                  href={`mailto:${selectedEnroll.email}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </a>
                {selectedEnroll.phoneNumber && (
                  <a
                    href={`tel:${selectedEnroll.phoneNumber}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </a>
                )}
              </div>
              <button
                onClick={() => setSelectedEnroll(null)}
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

export default EnrollManager;