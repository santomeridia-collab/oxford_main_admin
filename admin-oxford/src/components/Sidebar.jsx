// // // components/Sidebar.jsx
// // import React from 'react';
// // import { 
// //   LayoutDashboard, 
// //   Image, 
// //   BookOpen, 
// //   GalleryHorizontal, 
// //   CalendarDays,
// //   Settings
// // } from 'lucide-react';

// // const menuItems = [
// //   { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
// //   { id: 'hero', label: 'Hero Section', icon: Image },
// //   { id: 'courses', label: 'Courses', icon: BookOpen },
// //   { id: 'gallery', label: 'Gallery', icon: GalleryHorizontal },
// //   { id: 'events', label: 'Events', icon: CalendarDays },
// // ];

// // const Sidebar = ({ activeSection, setActiveSection }) => {
// //   return (
// //     <div className="w-64 bg-white shadow-lg flex flex-col">
// //       <div className="p-6 border-b">
// //         <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //           AdminPanel
// //         </h1>
// //         <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
// //       </div>
      
// //       <nav className="flex-1 p-4 space-y-2">
// //         {menuItems.map((item) => {
// //           const Icon = item.icon;
// //           return (
// //             <button
// //               key={item.id}
// //               onClick={() => setActiveSection(item.id)}
// //               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
// //                 activeSection === item.id
// //                   ? 'bg-blue-50 text-blue-600 shadow-sm'
// //                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
// //               }`}
// //             >
// //               <Icon className={`w-5 h-5 ${
// //                 activeSection === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
// //               }`} />
// //               <span className="font-medium">{item.label}</span>
// //             </button>
// //           );
// //         })}
// //       </nav>

// //       <div className="p-4 border-t">
// //         <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
// //           <Settings className="w-5 h-5" />
// //           <span>Settings</span>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Sidebar;




// // components/Sidebar.jsx (Updated with user info and logout)
// import React from 'react';
// import { 
//   LayoutDashboard, 
//   Image, 
//   BookOpen, 
//   GalleryHorizontal, 
//   CalendarDays,
//   Settings,
//   LogOut,
//   User,
//   ChevronDown,
//   MessageSquare,
//   Newspaper,
//   Video,
//   UserCheck,
//   Award
// } from 'lucide-react';

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
//   { id: 'hero', label: 'Hero Section', icon: Image },
//   { id: 'courses', label: 'Courses', icon: BookOpen },
//   { id: 'gallery', label: 'Gallery', icon: GalleryHorizontal },
//   { id: 'events', label: 'Events', icon: CalendarDays },
//     { id: 'contacts', label: 'Reviews', icon: MessageSquare }, // Add this
//     { id: 'news', label: 'News & Blog', icon: Newspaper },
// { id: 'demos', label: 'Demo Requests', icon: Video },
// { id: 'enrolls', label: 'Enrollments', icon: UserCheck },
// { id: 'instructors', label: 'Instructors', icon: Award },


// ];

// const Sidebar = ({ activeSection, setActiveSection, user, onLogout }) => {
//   return (
//     <div className="w-64 bg-white shadow-lg flex flex-col h-full">
//       {/* Logo */}
//       <div className="p-6 border-b">
//         <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           AdminPanel
//         </h1>
//         <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
//       </div>
      
//       {/* Navigation */}
//       <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.id}
//               onClick={() => setActiveSection(item.id)}
//               className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
//                 activeSection === item.id
//                   ? 'bg-blue-50 text-blue-600 shadow-sm'
//                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//               }`}
//             >
//               <Icon className={`w-5 h-5 ${
//                 activeSection === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
//               }`} />
//               <span className="font-medium">{item.label}</span>
//               {activeSection === item.id && (
//                 <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
//               )}
//             </button>
//           );
//         })}
//       </nav>

//       {/* User Section */}
//       <div className="border-t p-4">
//         <div className="flex items-center space-x-3 mb-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//             <span className="text-white font-semibold text-sm">
//               {user?.name?.charAt(0)?.toUpperCase() || 'A'}
//             </span>
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-700 truncate">{user?.name || 'Admin'}</p>
//             <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
//           </div>
//           <ChevronDown className="w-4 h-4 text-gray-400" />
//         </div>
        
//         <button
//           onClick={onLogout}
//           className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//         >
//           <LogOut className="w-5 h-5" />
//           <span className="font-medium">Sign Out</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;





// components/Sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, 
  Image, 
  BookOpen, 
  GalleryHorizontal, 
  CalendarDays,
  MessageSquare,
  Newspaper,
  Video,
  UserCheck,
  Award,
  Settings,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight, ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'hero', label: 'Hero Section', icon: Image },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'gallery', label: 'Gallery', icon: GalleryHorizontal },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'news', label: 'News & Blog', icon: Newspaper },
  { id: 'instructors', label: 'Instructors', icon: Award },
  { id: 'demos', label: 'Demo Requests', icon: Video },
  { id: 'enrolls', label: 'Enrollments', icon: UserCheck },
  { id: 'contacts', label: 'Reviews', icon: MessageSquare },
];

const Sidebar = ({ activeSection, setActiveSection, user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleVerificationClick = () => {
    window.open('https://verify.oxfordstudycenter.com/admin/login', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg flex flex-col h-full transition-all duration-300`}>
      {/* Logo */}
      <div className={`p-6 border-b ${isCollapsed ? 'text-center' : ''}`}>
        {isCollapsed ? (
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <span className="text-white font-bold text-lg">A</span>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AdminPanel
            </h1>
            <p className="text-sm text-gray-500 mt-1">Management Dashboard</p>
          </>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              {!isCollapsed && (
                <>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  )}
                </>
              )}
            </button>
          );
        })}
         <div className="my-3 border-t border-gray-200"></div>

        {/* Verification Link - External */}
        <button
          onClick={handleVerificationClick}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group text-gray-600 hover:bg-green-50 hover:text-green-700"
          title={isCollapsed ? 'Certificate Verification' : ''}
        >
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-green-600" />
          {!isCollapsed && (
            <>
              <span className="font-medium flex-1 text-left">Verification</span>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
            </>
          )}
        </button>
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.name || user?.email || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-20 -right-3 bg-white border rounded-full p-1 shadow-sm hover:shadow-md transition-shadow hidden md:block"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;