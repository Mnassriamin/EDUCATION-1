import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Auth.css';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        telephone: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, telephone } = signupInfo;

        if (!name || !email || !password || !telephone) {
            toast.error('All fields are required.');
            return;
        }

        const phoneRegex = /^\d{8}$/;
        if (!phoneRegex.test(telephone)) {
            toast.error('The phone number must be exactly 8 digits.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'An error occurred.');
                return;
            }

            if (result.success) {
                toast.success('Signup successful! Redirecting...');
                navigate('/login');
            } else {
                toast.error(result.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('Cannot connect to the server. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            onChange={handleChange}
                            type="text"
                            name="name"
                            placeholder="Enter your name..."
                            value={signupInfo.name}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={signupInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={signupInfo.password}
                        />
                    </div>
                    <div>
                        <label htmlFor="telephone">Telephone</label>
                        <input
                            onChange={handleChange}
                            type="tel"
                            name="telephone"
                            placeholder="Enter your 8-digit telephone..."
                            value={signupInfo.telephone}
                            pattern="\d{8}"
                            title="Telephone number must be exactly 8 digits"
                        />
                    </div>
                    <button type="submit">Signup</button>
                    <span>
                        Already have an account? <Link to="/login">Login</Link>
                    </span>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Signup;
