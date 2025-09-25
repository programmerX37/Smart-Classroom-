import React, { Suspense, lazy, useState } from 'react';
import { UserRole } from '../entities/user';
import Header from '../widgets/header';
import { useApp } from './useApp';
import Sidebar from '../widgets/sidebar';
import Footer from '../widgets/footer';

// Lazy load pages for better performance
const StudentDashboard = lazy(() => import('../pages/student'));
const StudentLoginPage = lazy(() => import('../pages/student').then(module => ({ default: module.StudentLoginPage })));
const TeacherScheduler = lazy(() => import('../pages/teacher'));
const TeacherLoginPage = lazy(() => import('../pages/teacher').then(module => ({ default: module.TeacherLoginPage })));
const AdminConsole = lazy(() => import('../pages/admin'));
const AdminLoginPage = lazy(() => import('../pages/admin').then(module => ({ default: module.AdminLoginPage })));
const HomePage = lazy(() => import('../pages/home'));
const CalendarPage = lazy(() => import('../pages/calendar'));
const NotificationsPage = lazy(() => import('../pages/notifications'));
const CameraPage = lazy(() => import('../pages/camera'));


const PageLoader: React.FC = () => (
    <div className="flex-1 flex justify-center items-center h-full" role="status" aria-label="Loading page">
        <svg className="animate-spin text-emerald-400 h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);


const App: React.FC = () => {
  const {
    currentRole,
    appEntries,
    currentView,
    currentTeacher,
    currentStudent,
    departments,
    events,
    schedule,
    conflicts,
    resources,
    isAdminLoggedIn,
    setResources,
    setCurrentTeacher,
    setCurrentStudent,
    setDepartments,
    updateSchedule,
    handleAddEvent,
    handleAdminLoginSuccess,
    handleNavigateToCalendar,
    handleNavigateToDashboard,
    handleNavigateToNotifications,
    handleNavigateToCamera,
    handleSetCurrentRole,
    handleRoleSelect,
    handleMarkEntryAsRead,
    handleMarkAllEntriesAsRead,
    handleCreateEntry,
  } = useApp();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  const renderDashboard = () => {
    switch (currentRole) {
      case UserRole.Student:
        if (!currentStudent) {
          const allStudentGroups = Array.from(new Set(schedule.map(item => item.studentGroup)));
          return <StudentLoginPage studentGroups={allStudentGroups} onLogin={setCurrentStudent} />;
        }
        return <StudentDashboard 
                    studentGroup={currentStudent} 
                    schedule={schedule} 
                    conflicts={conflicts} 
                    appEntries={appEntries}
                />;
      case UserRole.Teacher:
        if (!currentTeacher) {
          const allTeachers = departments.flatMap(d => d.teachingStaff.map(s => s.name));
          return <TeacherLoginPage teachers={allTeachers} onLogin={setCurrentTeacher} />;
        }
        return <TeacherScheduler 
                    teacherName={currentTeacher} 
                    schedule={schedule} 
                    conflicts={conflicts} 
                    appEntries={appEntries}
                    resources={resources}
                    onCreateEntry={handleCreateEntry}
                />;
      case UserRole.Admin:
        if (!isAdminLoggedIn) {
          return <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />;
        }
        return <AdminConsole 
                    departments={departments} 
                    setDepartments={setDepartments}
                    schedule={schedule}
                    conflicts={conflicts}
                    updateSchedule={updateSchedule}
                    resources={resources}
                    setResources={setResources}
                    onCreateNotification={(message, type) => handleCreateEntry({type: 'alert', message, read: false})}
                />;
      default:
        // Fallback to student dashboard logic, which will show login if needed
        const allStudentGroups = Array.from(new Set(schedule.map(item => item.studentGroup)));
        return currentStudent 
            ? <StudentDashboard 
                studentGroup={currentStudent} 
                schedule={schedule} 
                conflicts={conflicts} 
                appEntries={appEntries}
              />
            : <StudentLoginPage studentGroups={allStudentGroups} onLogin={setCurrentStudent} />;
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
        case 'dashboard':
            return renderDashboard();
        case 'calendar':
            return <CalendarPage 
                events={events}
                onAddEvent={handleAddEvent}
                currentRole={currentRole}
              />;
        case 'notifications':
            return <NotificationsPage 
                notifications={appEntries}
                onMarkAsRead={handleMarkEntryAsRead}
                onMarkAllAsRead={handleMarkAllEntriesAsRead}
            />;
        case 'camera':
            return <CameraPage />;
        default:
            return renderDashboard();
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-2 sm:p-4 pb-8 sm:pb-12 flex flex-col relative">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob pointer-events-none z-0"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none z-0"></div>
      <div className="absolute -bottom-8 -right-20 w-72 h-72 bg-green-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-1000 pointer-events-none z-0"></div>

      <Suspense fallback={<PageLoader />}>
        {currentView === 'home' ? (
          <HomePage onSelectRole={handleRoleSelect} />
        ) : (
          <div className="flex flex-1 gap-4 relative z-10">
            {/* Backdrop for mobile sidebar */}
             {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/60 z-20 lg:hidden" 
                onClick={toggleSidebar}
                aria-hidden="true"
              ></div>
            )}
            <Sidebar
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToCalendar={handleNavigateToCalendar}
              onNavigateToNotifications={handleNavigateToNotifications}
              onNavigateToCamera={handleNavigateToCamera}
              currentView={currentView}
              isOpen={isSidebarOpen}
              onClose={toggleSidebar}
            />
            <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20">
              <Header
                currentRole={currentRole}
                setCurrentRole={handleSetCurrentRole}
                notifications={appEntries}
                onNavigateToNotifications={handleNavigateToNotifications}
                onToggleSidebar={toggleSidebar}
              />
              <main className="flex-1 overflow-x-hidden p-3 sm:p-4 lg:p-6">
                <Suspense fallback={<PageLoader />}>
                  {renderMainContent()}
                </Suspense>
              </main>
              <Footer />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default App;