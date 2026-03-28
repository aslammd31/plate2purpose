import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/localStorageDB';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'receiver' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registerUser(formData);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred');
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '4rem auto' }} className="animate-fade-in">
            <h2 className="page-title" style={{ textAlign: 'center' }}>Create Account</h2>
            <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Join the movement to end food waste</p>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: '#fee2e2', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}

            <form onSubmit={onSubmit} className="card" style={{ padding: '2rem' }}>
                <div className="form-group">
                    <label>Full Name or Org Name</label>
                    <input type="text" required className="form-control" 
                           value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" required className="form-control" 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" required className="form-control" minLength="6"
                           value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>I am a...</label>
                    <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="receiver">Receiver (Looking for food)</option>
                        <option value="donor">Donor (Sharing extra food)</option>
                        <option value="ngo">NGO (Bulk claims)</option>
                        <option value="volunteer">Volunteer (Delivery helper)</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
        </div>
    );
};

export default Register;
