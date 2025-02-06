import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import JournalList from './components/Journal/JournalList';
import ComptesList from './components/ComptesComptable/ComptesList';
// Import Cours CRUD components
import CreateCours from './components/Cours/CreateCours';
import ListCours from './components/Cours/ListCours';
import UpdateCours from './components/Cours/UpdateCours';
import DeleteCours from './components/Cours/DeleteCours';
// Navbar and Sidebar components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidenav';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for token in localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    // Function to protect routes
    const PrivateRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/login" />;
    };

    // Routes where Navbar and Sidebar should not be displayed
    const noHeaderRoutes = ["/login", "/signup"];

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
    };

    return (
        <div className="App">
            {/* Display Navbar and Sidebar only if current route is not in noHeaderRoutes */}
            {!noHeaderRoutes.includes(location.pathname) && (
                <>
                    <Navbar handleLogout={handleLogout} />
                    <Sidebar />
                </>
            )}

            <div className="content">
                <Routes>
                    {/* Redirect root based on authentication */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
                        }
                    />

                    {/* Public Routes */}
                    <Route 
                        path="/login" 
                        element={<Login setIsAuthenticated={setIsAuthenticated} />} 
                    />
                    <Route 
                        path="/signup" 
                        element={<Signup />} 
                    />

                    {/* Protected Routes */}
                    <Route 
                        path="/home" 
                        element={<PrivateRoute element={<Home />} />} 
                    />
                    <Route 
                        path="/settings" 
                        element={<PrivateRoute element={<Settings />} />} 
                    />
                    <Route 
                        path="/about" 
                        element={<PrivateRoute element={<JournalList />} />} 
                    />
                    <Route 
                        path="/journaux" 
                        element={<PrivateRoute element={<JournalList />} />} 
                    />
                    <Route 
                        path="/comptescomptables" 
                        element={<PrivateRoute element={<ComptesList />} />} 
                    />

                    {/* Cours CRUD Routes */}
                    <Route 
                        path="/cours" 
                        element={<PrivateRoute element={<ListCours />} />} 
                    />
                    <Route 
                        path="/cours/create" 
                        element={<PrivateRoute element={<CreateCours />} />} 
                    />
                    <Route 
                        path="/cours/update/:id" 
                        element={<PrivateRoute element={<UpdateCours />} />} 
                    />
                    <Route 
                        path="/cours/delete/:id" 
                        element={<PrivateRoute element={<DeleteCours />} />} 
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
