import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { SocketProvider } from "./context/SocketContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthRedirect from "./components/common/AuthRedirect";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/dashboard/HomePage";
import LocationDetails from "./pages/dashboard/LocationDetails";
import NotFoundPage from "./pages/404Page";
import ForgetPassword from "./pages/ForgetPassword";
import CategoryPage from "./pages/dashboard/CategoryPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import OperationsPage from "./pages/dashboard/OperationsPage";
import OperationDetailPage from "./pages/dashboard/OperationDetailPage";
import 'leaflet/dist/leaflet.css';
import HeatMapPage from "./pages/dashboard/HeatMapPage";
import ColdCallerPage from "./pages/dashboard/ColdCallerPage";
import ColdCallerDetailPage from "./pages/dashboard/ColdCallerDetailPage";
import WhatsAppConnectPage from "./pages/dashboard/WhatsAppConnectPage";
import MessageAutomationPage from "./pages/dashboard/MessageAutomationPage";
import CallPage from "./pages/dashboard/CallPage";
import TwilioSettingsPage from "./pages/dashboard/TwilioSettingsPage";
import { OperationsProvider } from "./context/operationsContext";
import { ScreenshotProvider } from "./context/screenshotContext";
import SupportPage from "./pages/dashboard/SupportPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import SubscriptionSuccessPage from "./pages/dashboard/SubscriptionSuccessPage";
import LocationPage from "./pages/dashboard/LocationPage";
import CollaborationPage from "./pages/dashboard/CollaborationPage";


function App() {
    return (
        <Router>
            <AuthProvider>
                <SocketProvider>
                    <OperationsProvider>
                        <ScreenshotProvider>
                            <Routes>
                                <Route path="/" element={<AuthRedirect />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/forgot-password" element={<ForgetPassword />} />

                                {/* Protected Routes */}
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <DashboardLayout />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route index element={<HomePage />} />
                                    <Route
                                        path="location/:category/:country/:state/:city?"
                                        element={<LocationDetails />}
                                    />
                                    <Route path="category" element={<CategoryPage />} />
                                    <Route path="operations" element={<OperationsPage />} />
                                    <Route path="operations/:operationId" element={<OperationDetailPage />} />
                                    <Route path="heat-map" element={<HeatMapPage />} />
                                    <Route path="cold-caller" element={<ColdCallerPage />} />
                                    <Route path="cold-caller/:id" element={<ColdCallerDetailPage />} />
                                    <Route path="whatsapp-automation" element={<WhatsAppConnectPage />} />
                                    <Route path="message-automation" element={<MessageAutomationPage />} />
                                    <Route path="call" element={<CallPage />} />
                                    <Route path="twilio-settings" element={<TwilioSettingsPage />} />
                                    <Route path="support" element={<SupportPage />} />
                                    <Route path="profile-settings" element={<ProfilePage />} />
                                    <Route path="subscription" element={<SubscriptionPage />} />
                                    <Route path="subscription/success" element={<SubscriptionSuccessPage />} />
                                    <Route path="location" element={<LocationPage />} />
                                    <Route path="collaboration" element={<CollaborationPage />} />
                                </Route>

                                {/* 404 Page - Must be last */}
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </ScreenshotProvider>
                    </OperationsProvider>
                </SocketProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
