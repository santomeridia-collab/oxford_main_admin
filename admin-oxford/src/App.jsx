// App.jsx
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import HeroManager from "./components/HeroManager";
import CoursesManager from "./components/CoursesManager";
import GalleryManager from "./components/GalleryManager";
import EventsManager from "./components/EventsManager";
import ContactsManager from "./components/ContactsManager";
import { authService } from "./services/auth.service";
import NewsManager from "./components/NewsManager";
import DemoManager from './components/DemoManager';
import EnrollManager from './components/EnrollManager';
import InstructorManager from './components/InstructorManager';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection("dashboard");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "hero":
        return <HeroManager />;
      case "courses":
        return <CoursesManager />;
      case "gallery":
        return <GalleryManager />;
      case "events":
        return <EventsManager />;
      case "contacts":
        return <ContactsManager />;
      case "news":
        return <NewsManager />;
        case 'demos':
  return <DemoManager />;
  case 'enrolls':
  return <EnrollManager />;
  case 'instructors':
  return <InstructorManager />;

      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto p-8">{renderSection()}</main>
    </div>
  );
};

export default App;
