import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/localStorageDB';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="animate-fade-in">
            <h2 className="page-title" style={{ textAlign: 'center' }}>Welcome Back</h2>
            <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign in to continue sharing</p>
            
            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: '#fee2e2', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

            <form onSubmit={onSubmit} className="card" style={{ padding: '2rem' }}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" required className="form-control" 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" required className="form-control" 
                           value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
