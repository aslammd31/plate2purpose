import { useState, useEffect, useContext } from 'react';
import FoodCard from '../components/FoodCard';
import { MapPin, Filter } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAvailableFoods, claimFood, bookFood } from '../utils/localStorageDB';

const Listings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [distanceFilter, setDistanceFilter] = useState('50000'); // Default 50km
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Try to get location first to sort by distance
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCoords({ lng: pos.coords.longitude, lat: pos.coords.latitude });
                },
                (err) => {
                    console.log('Location denied, fetching without geo-sorting');
                    fetchFoods(); // Proceed without coords
                }
            );
        } else {
            fetchFoods();
        }
    }, []);

    useEffect(() => {
        if (coords) {
            fetchFoods(coords);
        }
    }, [coords, categoryFilter, distanceFilter]);

    const fetchFoods = async (locationCoords = coords) => {
        setLoading(true);
        try {
            const filters = {
                category: categoryFilter,
                lng: locationCoords?.lng,
                lat: locationCoords?.lat,
                maxDistance: distanceFilter
            };

            const res = await getAvailableFoods(filters);
            setFoods(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch food listings');
            setLoading(false);
        }
    };

    const handleBook = async (id) => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            await bookFood(id, user.id);
            // Remove the booked food from immediate public listings (or update state)
            setFoods(foods.filter(f => f._id !== id));
            alert('Food RESERVED successfully! You must now go to your dashboard to confirm collection.');
        } catch (err) {
            alert(err.response?.data?.msg || 'Could not book food.');
        }
    };

    const handleClaim = async (id) => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            await claimFood(id, user.id);
            setFoods(foods.filter(f => f._id !== id));
            alert('Food claimed successfully!');
        } catch (err) {
            alert(err.response?.data?.msg || 'Could not claim food.');
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
                <div>
                    <h1 className="page-title">Available Food</h1>
                    <p className="page-subtitle">Find excess food shared by people nearby.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Filter size={18} />
                        <select className="form-control" style={{ padding: '0.25rem' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="veg">Vegetarian</option>
                            <option value="non-veg">Non-Vegetarian</option>
                            <option value="vegan">Vegan</option>
                        </select>
                    </div>
                </div>
            </header>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', margin: '4rem 0', color: 'var(--text-muted)' }}>Finding nearby food...</div>
            ) : foods.length === 0 ? (
                <div style={{ textAlign: 'center', margin: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <MapPin size={48} color="var(--border)" />
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>No food found nearby</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Check back later or expand your search distance.</p>
                </div>
            ) : (
                <div className="grid">
                    {foods.map(food => (
                        <FoodCard 
                            key={food._id} 
                            food={food} 
                            onBook={handleBook}
                            onClaim={handleClaim}
                            currentUserId={user?.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Listings;
