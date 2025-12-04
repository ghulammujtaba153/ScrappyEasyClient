import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./component/common/ProtectedRoute";
import AuthRedirect from "./component/common/AuthRedirect";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/dashboard/HomePage";
import LocationDetails from "./pages/dashboard/LocationDetails";
import NotFoundPage from "./pages/404Page";
import ForgetPassword from "./pages/ForgetPassword";
import CategoryPage from "./pages/dashboard/CategoryPage";
import DashboardLayout from "./component/dashboard/DashboardLayout";
import OperationsPage from "./pages/dashboard/OperationsPage";


function App() {
    return (
        <Router>
            <AuthProvider>
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
                    </Route>

                    {/* 404 Page - Must be last */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
