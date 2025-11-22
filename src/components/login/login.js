import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/fetchClient';
import Illus from '../../assets/loginn.png';
import './login.css';

export default function Login({ onSuccess }) {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!userid || !password) {
            setError('Please enter userid and password');
            return;
        }

        setLoading(true);
        try {
            const resp = await apiFetch.post('/api/auth/login', { userid, password }, { includeCredentials: true });  
            console.log('LOGIN Response: ', resp);
            const token = 
            resp?.data?.accessTokentoken || 
            resp?.data?.token || 
            resp?.accessToken ||
            resp?.token ||
            resp?.data?.data?.token;

            if (token) {
                console.log("Token received:", token);
                if (typeof apiFetch.setToken === 'function') {
                    apiFetch.setToken(token, { persist: true });
                } else {
                    localStorage.setItem('accessToken', token);
                }

                if (typeof onSuccess === 'function') onSuccess({ userid, token });
                navigate('/dashboard');
                return;
            } 

                console.warn('No token found in login response. Response object: ', resp);
                setError('Cannot retrieve access token from server response');

            } catch (err) {
                const remote = err?.data || err;
                let msg = 'Login failed';
                if (remote.status === 401) {
                    msg = 'Invalid userid or password';
                } else if (remote.status) {
                    msg = 
                    remote.data?.message || 
                    remote.data?.error ||
                    remote.message ||
                    remote.error ||
                    msg;
                } else {
                    msg = 'Cannot connect server';
                }

                setError(msg);
                console.error('login error:', err);
            } finally {
             setLoading(false);
        }
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

                        {error && <div className="login-error">{error}</div>}

                        <form className="login-form" onSubmit={submit}>
                            <label className="field-label" htmlFor="userid">
                                <input
                                    id = "userid"
                                    type = "text"
                                    placeholder = "User ID"
                                    value = {userid}
                                    onChange={(e) => {
                                        setUserid(e.target.value);
                                        setError(null);
                                    }}
                                    required
                                />
                            </label>

                            <label className="field-label" htmlFor="password">
                                <input
                                    id = "password"
                                    type = "password"
                                    placeholder = "Password"
                                    value = {password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    required
                                    aria-label="Password"
                                />
                            </label>

                            <div className="login-actions">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </div>

                            <div className="login-footer">
                                <button type="button" className="forgot" onClick={() => {}}>
                                    Forgot Username / Password?
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}