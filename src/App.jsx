import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { trackMetaEvent } from "./utils/analytics";
import { ConfigProvider } from "antd";
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
import { NotificationProvider } from "./context/NotificationContext";
import SupportPage from "./pages/dashboard/SupportPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import SubscriptionSuccessPage from "./pages/dashboard/SubscriptionSuccessPage";
import LocationPage from "./pages/dashboard/LocationPage";
import CollaborationPage from "./pages/dashboard/CollaborationPage";
import InviteUserResetPage from "./pages/InviteUserResetPage";
import QualifiedLeadsPage from "./pages/dashboard/QualifiedLeadsPage";
import QualifiedLeadsDetailPage from "./pages/dashboard/QualifiedLeadsDetailPage";
import TeamPage from "./pages/dashboard/TeamPage";
import TeamDetailPage from "./pages/dashboard/TeamDetailPage";
import InviteConfirmPage from "./pages/InviteConfirmPage";
import PrivacyPage from "./pages/PrivacyPage";
import LemonSqueezy from "./pages/LemonSqueezy";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import WhoWinsPage from "./pages/WhoWinsPage";
import AboutPage from "./pages/AboutPage";
import TermsCondition from "./pages/TermsConditionPage";
import DemoPresentationPage from "./pages/DemoPresentationPage";
import GetExtensionPage from "./pages/GetExtensionPage";
import PendingReviewPage from "./pages/PendingReviewPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";

// Initialize GA4
const TRACKING_ID = import.meta.env.VITE_GOOGLE_ANLYTICS_ID;
if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
}

// Initialize Meta Pixel
const PIXEL_ID = import.meta.env.VITE_PIXEL_ID;
if (PIXEL_ID) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
}

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Track GA4
        if (TRACKING_ID) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
        // Track Meta Pixel via helper
        trackMetaEvent('PageView');
    }, [location]);

    return null;
};


function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#0F792C",
                    fontSize: 12, // Decreases font size for all Ant Design components (buttons, tables, etc)
                },
            }}
        >
            <div className="text-xs">
                <Router>
                    <AnalyticsTracker />
                    <AuthProvider>
                        <SocketProvider>
                            <NotificationProvider>
                                <OperationsProvider>
                                    <ScreenshotProvider>
                                        <Routes>
                                        {/* <Route path="/" element={<AuthRedirect />} /> */}
                                        <Route path="/" element={<LandingPage />} />
                                        <Route path="/register" element={<RegisterPage />} />
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/forgot-password" element={<ForgetPassword />} />
                                        <Route path="/reset-password" element={<InviteUserResetPage />} />
                                        <Route path="/invite/confirm" element={<InviteConfirmPage />} />
                                        <Route path="/lead-buddy-privacy" element={<PrivacyPage />} />
                                        <Route path="/lead-buddy-support" element={<SupportPage />} />
                                        <Route path="/lemon-squeezy" element={<LemonSqueezy />} />
                                        
                                        <Route path="/pricing" element={<PricingPage />} />
                                        <Route path="/demo-presentation" element={<DemoPresentationPage />} />
                                        <Route path="/get-extension" element={<GetExtensionPage />} />
                                        <Route path="/blogs" element={<BlogPage />} />
                                        <Route path="/blog/:id" element={<BlogDetailPage />} />

                                        <Route path="/who-wins" element={<WhoWinsPage />} />
                                        <Route path="/about" element={<AboutPage />} />
                                        <Route path="/term-conditions" element={<TermsCondition/>} />
                                        <Route path="/term-conditions" element={<TermsCondition/>} />



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
                                            <Route path="qualified-leads" element={<QualifiedLeadsPage />} />
                                            <Route path="qualified-leads/:id" element={<QualifiedLeadsDetailPage />} />
                                            <Route path="team" element={<TeamPage />} />
                                            <Route path="team/:id" element={<TeamDetailPage />} />
                                            <Route path="under-review" element={<PendingReviewPage />} />


                                        </Route>

                                        {/* 404 Page - Must be last */}
                                        <Route path="*" element={<NotFoundPage />} />
                                    </Routes>
                                </ScreenshotProvider>
                            </OperationsProvider>
                        </NotificationProvider>
                    </SocketProvider>
                </AuthProvider>
            </Router>
            </div>
        </ConfigProvider>
    );
}

export default App;
