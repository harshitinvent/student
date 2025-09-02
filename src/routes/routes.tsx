import { Routes, Route } from 'react-router';
import PrivateRoute from '../utils/PrivateRoute';

import DefaultLayout from '../layouts/DefaultLayout';

import { useUserContext } from '../providers/user';
import { NAVIGATION, NAVIGATION_ADMIN } from '../constants/navigation';

import CanvasLayout from '../layouts/CanvasLayout';
import Canvas from '../pages/(canvas)/Canvas';
import Assignment from '../pages/(assigment)/Assignment';
import AssignmentCanvas from '../pages/(assigment)/AssignmentCanvas';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/(auth)/Login';
import SignupPage from '../pages/(auth)/Signup';
import ChatLayout from '../layouts/ChatLayout';
import ChatPage from '../pages/(chat)/Chat';
import StudentsChatPage from '../pages/(chat)/StudentsChat';
import CourseContentPage from '../pages/(course)/CourseContent';
import AccommodationPage from '../pages/(accommodation)/Accommodation';
import SettingsLayout from '../layouts/SettingsLayout';
import GeneralSettings from '../pages/(settings)/GeneralSettings';
import SecuritySettings from '../pages/(settings)/SecuritySettings';
import NotificationsSettings from '../pages/(settings)/NotificationsSettings';
import PersonalSettings from '../pages/(settings)/PersonalSettings';
import AiBaseSettings from '../pages/(settings)/AiBaseSettings';
import DepartmentsPage from '../pages/(department)/Departments';
import StudentsPage from '../pages/(students)/Students';
import TeachersPage from '../pages/(teachers)/Teachers';
import StreamsPage from '../pages/(streams)/Streams';
import SimplePrerequisitesPage from '../pages/(prerequisites)/SimplePrerequisites';
import ProgramDetailsPage from '../pages/(programs)/ProgramDetails';
import CoursesManagementPage from '../pages/(courses)/CoursesManagement';
import AcademicYearsPage from '../pages/(scheduling)/AcademicYears';
import SemesterManagementPage from '../pages/(scheduling)/SemesterManagement';
import CampusManagementPage from '../pages/(scheduling)/CampusManagement';
import VenueManagementPage from '../pages/(scheduling)/VenueManagement';
import ClassManagementPage from '../pages/(scheduling)/ClassManagement';
import ClassCalendarPage from '../pages/(scheduling)/ClassCalendar';
import FinancialTransactionsPage from '../pages/(financial)/FinancialTransactions';
import FinancialTransactionsModule from '../pages/(financial)/FinancialTransactionsModule';
import VendorManagementPage from '../pages/(financial)/VendorManagement';
import InvoiceManagementPage from '../pages/(financial)/InvoiceManagement';
import UsersPage from '../pages/(users)/Users';
import RolesPage from '../pages/(roles)/Roles';
import ApplicationsPage from '../pages/(applications)/Applications';

export default function RoutesConfig() {
  const { type } = useUserContext();

  return (
    <Routes>
      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DefaultLayout />}>
          {NAVIGATION.map(
            ({ component: Component, path, sublist, layout: Layout }) => (
              <>
                {Layout ? (
                  <>
                    <Route element={<Layout />}>
                      {Component && (
                        <Route path={path as string} element={<Component />} />
                      )}
                      {sublist &&
                        sublist.map(
                          ({ component: ChildComponent, path: childPath }) => {
                            return (
                              ChildComponent && (
                                <Route
                                  path={childPath as string}
                                  element={<ChildComponent />}
                                />
                              )
                            );
                          }
                        )}
                    </Route>
                  </>
                ) : (
                  <>
                    {Component && (
                      <Route path={path as string} element={<Component />} />
                    )}
                    {sublist &&
                      sublist.map(
                        ({ component: ChildComponent, path: childPath }) => {
                          return (
                            ChildComponent && (
                              <Route
                                path={childPath as string}
                                element={<ChildComponent />}
                              />
                            )
                          );
                        }
                      )}

                    {/* Chat Routes */}
                    <Route path="/students-chat" element={<StudentsChatPage />} />
                  </>
                )}
              </>
            )
          )}

          {NAVIGATION_ADMIN.map(
            ({ component: Component, path, sublist, layout: Layout }) => (
              <>
                {Layout ? (
                  <>
                    <Route element={<Layout />}>
                      {Component && (
                        <Route path={path as string} element={<Component />} />
                      )}
                      {sublist &&
                        sublist.map(
                          ({ component: ChildComponent, path: childPath }) => {
                            return (
                              ChildComponent && (
                                <Route
                                  path={childPath as string}
                                  element={<ChildComponent />}
                                />
                              )
                            );
                          }
                        )}
                    </Route>
                  </>
                ) : (
                  <>
                    {Component && (
                      <Route path={path as string} element={<Component />} />
                    )}
                    {sublist &&
                      sublist.map(
                        ({ component: ChildComponent, path: childPath }) => {
                          return (
                            ChildComponent && (
                              <Route
                                path={childPath as string}
                                element={<ChildComponent />}
                              />
                            )
                          );
                        }
                      )}
                  </>
                )}
              </>
            )
          )}

          <Route path={'courses/content'} element={<CourseContentPage />} />
          <Route path={'/assignment/:id'} element={<Assignment />} />
          <Route path={'chat'} element={<ChatLayout />}>
            <Route path={'/chat/:id'} element={<ChatPage />} />
          </Route>
          <Route path={'/accommodation/:id'} element={<AccommodationPage />} />
          <Route path={'/applications'} element={<ApplicationsPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/streams" element={<StreamsPage />} />
          <Route path="/prerequisites" element={<SimplePrerequisitesPage />} />
          <Route path="/program-management/:id" element={<ProgramDetailsPage />} />

          {/* Class Scheduling Routes */}
          <Route path="/scheduling/years" element={<AcademicYearsPage />} />
          <Route path="/scheduling/semesters" element={<SemesterManagementPage />} />
          <Route path="/scheduling/campuses" element={<CampusManagementPage />} />
          <Route path="/scheduling/venues" element={<VenueManagementPage />} />
          <Route path="/scheduling/classes" element={<ClassManagementPage />} />
          <Route path="/scheduling/calendar" element={<ClassCalendarPage />} />
          <Route path="/financial-transactions" element={<FinancialTransactionsPage />} />
          <Route path="/vendor-management" element={<VendorManagementPage />} />
          <Route path="/invoice-management" element={<InvoiceManagementPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route element={<SettingsLayout />}>
            <Route
              path={'/settings'}
              index
              element={
                type === 'Student' ? <GeneralSettings /> : <PersonalSettings />
              }
            />
            <Route path={'/settings/security'} element={<SecuritySettings />} />
            <Route
              path={'/settings/notifications'}
              element={<NotificationsSettings />}
            />
            <Route path={'/settings/ai-base'} element={<AiBaseSettings />} />
          </Route>
        </Route>
        <Route element={<CanvasLayout />}>
          <Route path={'/course/:id'} element={<Canvas />} />
          <Route path={'/canvas/:id'} element={<Canvas />} />
          <Route path={'/assignment/edit/:id'} element={<AssignmentCanvas />} />
        </Route>
      </Route>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path={'/login'} element={<LoginPage />} />
        <Route path={'/signup'} element={<SignupPage />} />
      </Route>
    </Routes>
  );
}
