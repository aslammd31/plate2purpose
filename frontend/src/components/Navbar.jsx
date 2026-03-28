import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Leaf } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="brand">
          <Leaf color="var(--primary)" size={28} />
          Plate2Purpose
        </Link>
        <div className="nav-links">
          <Link to="/listings">Browse Food</Link>
          <Link to="/analytics">Impact</Link>
          {user ? (
            <>
              {['donor', 'ngo'].includes(user.role) && (
                <Link to="/add-food">Add Food</Link>
              )}
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', color: 'white' }}>
                Join Us
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
