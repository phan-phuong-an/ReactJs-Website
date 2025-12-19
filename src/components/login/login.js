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
            const resp = await apiFetch.post('/api/auth/login', { userid, password }, { includeCredentials: false });  
            console.log('LOGIN Response: ', resp);
            const token =
                resp?.data?.accessToken ||
                resp?.data?.token ||
                resp?.data?.data?.token ||
                resp?.accessToken ||
                resp?.token;

            if (token) {
                console.log("Token received:", token);
                if (typeof apiFetch.setToken === 'function') {
                    apiFetch.setToken(token, { persist: true });
                } else {
                    localStorage.setItem('accessToken', token);
                }

                if (typeof onSuccess === 'function') onSuccess({ userid, token });
                try { window.dispatchEvent(new Event('authChange')); } catch (e) {}
                navigate('/app', { replace: true, state: { tab: 'studentmanagement' } });
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
        <div className="container py-5">
            <div className="row justify-content-center mt-5">
                <div className="col-lg-8 col-xl-7">
                    <div className="row g-0 shadow rounded overflow-hidden bg-white">
                        <div className="col-md-6 d-none d-md-block bg-light">
                            <img
                                src={Illus}
                                alt="Illustration"
                                className="img-fluid w-100 h-100"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        <div className="col-md-6 p-4 p-lg-5">
                            <h2 className="h4 mb-1">Member Login</h2>
                            <p className="text-muted mb-4">Sign in to your account</p>

                            {error && (
                                <div className="alert alert-danger py-2" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={submit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="userid" className="form-label">User ID</label>
                                    <input
                                        id="userid"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your user ID"
                                        value={userid}
                                        onChange={(e) => {
                                            setUserid(e.target.value);
                                            setError(null);
                                        }}
                                        required
                                        autoComplete="username"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError(null);
                                        }}
                                        required
                                        aria-label="Password"
                                        autoComplete="current-password"
                                    />
                                </div>

                                    <div className="mt-3">
                                        <button type="submit" className="btn btn-primary w-100 d-block rounded-3" disabled={loading}>
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        )}
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                        <div className="text-center mt-2">
                                            <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => {}}>
                                                Forgot Username / Password?
                                            </button>
                                        </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}