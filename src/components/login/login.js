import React, { useState } from 'react';
import Illus from '../../assets/loginn.png';
import './login.css';

export default function Login({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (typeof onSuccess === 'function') {
                onSuccess(email);
            } else {
                alert('Login successful: ' + email);
            }
        }, 800);
    };

    return (
        <div className="login-layout">
            <div className="login-card">
                <div className="login-left">
                    <img src={Illus} alt="Illustration" className="login-illus" />
                </div>

                <div className="login-right">
                    <div className="login-content">
                        <h2 className="login-title">Member Login</h2>
                        <p className="login-sub">Sign in to your account</p>

                        <form className="login-form" onSubmit={submit}>
                            <label className="field-label">
                                <span className="visually-hidden">Email</span>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    aria-label="Email"
                                />
                            </label>

                            <label className="field-label">
                                <span className="visually-hidden">Password</span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    aria-label="Password"
                                />
                            </label>

                            <div className="login-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'logging in...' : 'Login'}
                                </button>
                            </div>

                            <div className="login-footer">
                                <a href="#" className="forgot">
                                    Forgot Username / Password?
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}