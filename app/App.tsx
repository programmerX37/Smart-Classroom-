
import React from 'react';
import { UserRole } from '../entities/user';
import Header from '../widgets/header';
import StudentDashboard from '../pages/student';
import TeacherScheduler, { TeacherLoginPage } from '../pages/teacher';
import AdminConsole from '../pages/admin';
import HomePage from '../pages/home';
import CalendarPage from '../pages/calendar';
import { useApp } from './useApp';
import NotificationsPage from '../pages/notifications';
import { Notification } from '../entities/notification';


const App: React.FC = () => {
  const {
    currentRole,
    notifications,
    currentView,
    currentTeacher,
    departments,
    events,
    schedule,
    conflicts,
    resources,
    setResources,
    setCurrentTeacher,
    setDepartments,
    updateSchedule,
    handleAddEvent,
    handleNavigateToCalendar,
    handleNavigateToDashboard,
    handleNavigateToNotifications,
    handleSetCurrentRole,
    handleRoleSelect,
    handleMarkNotificationAsRead,
    handleMarkAllAsRead,
    handleCreateNotification,
  } = useApp();


  const renderDashboard = () => {
    switch (currentRole) {
      case UserRole.Student:
        return <StudentDashboard schedule={schedule} conflicts={conflicts} notifications={notifications} />;
      case UserRole.Teacher:
        if (!currentTeacher) {
          const allTeachers = departments.flatMap(d => d.teachingStaff.map(s => s.name));
          return <TeacherLoginPage teachers={allTeachers} onLogin={setCurrentTeacher} />;
        }
        return <TeacherScheduler teacherName={currentTeacher} schedule={schedule} conflicts={conflicts} />;
      case UserRole.Admin:
        return <AdminConsole 
                    departments={departments} 
                    setDepartments={setDepartments}
                    schedule={schedule}
                    conflicts={conflicts}
                    updateSchedule={updateSchedule}
                    resources={resources}
                    setResources={setResources}
                    onCreateNotification={handleCreateNotification}
                />;
      default:
        return <StudentDashboard schedule={schedule} conflicts={conflicts} notifications={notifications} />;
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
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
            />
        default:
            return renderDashboard();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {currentView === 'home' ? (
        <HomePage onSelectRole={handleRoleSelect} />
      ) : (
        <>
          <Header
            currentRole={currentRole}
            setCurrentRole={handleSetCurrentRole}
            notifications={notifications}
            onNavigateToCalendar={handleNavigateToCalendar}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToNotifications={handleNavigateToNotifications}
            currentView={currentView}
          />
          <main className="p-4 sm:p-6 md:p-8">
            {renderMainContent()}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
