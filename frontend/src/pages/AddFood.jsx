import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { postFood } from '../utils/localStorageDB';

const AddFood = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        food_name: '',
        quantity: '',
        category: 'veg',
        address: '',
        expiry_time: '',
    });
    const [file, setFile] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const getLocation = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCoordinates([pos.coords.longitude, pos.coords.latitude]);
                    setLoadingLocation(false);
                },
                (err) => {
                    setError('Failed to get location. Please input address accurately.');
                    setLoadingLocation(false);
                    // Default generic coords if failed (e.g. city center)
                    setCoordinates([72.8777, 19.0760]); // Mumbai as default for example
                }
            );
        } else {
            setError('Geolocation not supported by browser.');
            setLoadingLocation(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        if (coordinates.length === 0) {
            setError('Please get your location before submitting.');
            setIsSubmitting(false);
            return;
        }

        // Convert image to base64 for local storage
        let base64Image = null;
        if (file) {
            base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }

        const foodDataToSave = {
            ...formData,
            location: { coordinates },
            image_url: base64Image
        };

        try {
            await postFood(foodDataToSave, user.id);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to post food');
            setIsSubmitting(false);
        }
    };

    if (!['donor', 'ngo'].includes(user?.role)) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>You do not have permission to post food.</div>;
    }

    // Set min datetime for expiry to current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0,16);

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }} className="animate-fade-in">
            <h2 className="page-title">Share Your Food</h2>
            <p className="page-subtitle" style={{ marginBottom: '2rem' }}>Fill in the details to list food for donation.</p>

            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}

            <form onSubmit={onSubmit} className="card" style={{ padding: '2rem' }}>
                <div className="form-group">
                    <label>Food Title</label>
                    <input type="text" required className="form-control" placeholder="e.g. 5 boxes of Veg Biryani"
                           value={formData.food_name} onChange={e => setFormData({...formData, food_name: e.target.value})} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Category</label>
                        <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="veg">Vegetarian</option>
                            <option value="non-veg">Non-Vegetarian</option>
                            <option value="vegan">Vegan</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quantity (approx)</label>
                        <input type="text" required className="form-control" placeholder="e.g. Serves 10"
                               value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Expiry Time</label>
                    <input type="datetime-local" required className="form-control" min={minDateTime}
                           value={formData.expiry_time} onChange={e => setFormData({...formData, expiry_time: e.target.value})} />
                </div>

                <div className="form-group">
                    <label>Pickup Address</label>
                    <textarea required className="form-control" rows="2" placeholder="Building name, street, nearby landmark"
                              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                </div>

                <div className="form-group">
                    <button type="button" onClick={getLocation} className="btn btn-outline" style={{ width: '100%' }}>
                        <MapPin size={20} />
                        {loadingLocation ? 'Fetching...' : coordinates.length > 0 ? 'Location Saved (Update)' : 'Get Current Location (Required)'}
                    </button>
                    {coordinates.length > 0 && <small style={{ color: 'var(--primary)', marginTop: '0.5rem', display: 'block' }}>Coordinates captured: {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}</small>}
                </div>

                <div className="form-group">
                    <label>Food Image</label>
                    <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }} onClick={() => document.getElementById('food-img-upload').click()}>
                        {file ? (
                            <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{file.name} Selected</div>
                        ) : (
                            <div style={{ color: 'var(--text-muted)' }}>
                                <ImageIcon size={32} style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                                Click to upload image (Optional)
                            </div>
                        )}
                        <input id="food-img-upload" type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} accept="image/*" />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem', fontSize: '1.125rem' }}>
                    {isSubmitting ? 'Posting...' : 'Post Food for Donation'}
                </button>
            </form>
        </div>
    );
};

export default AddFood;
