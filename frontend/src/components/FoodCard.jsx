import { Clock, MapPin, Award, Navigation } from 'lucide-react';

const FoodCard = ({ food, onBook, onClaim, onDelete, currentUserId }) => {
    // Check if the current user owns this food post
    const isOwner = food.donor_id?.id === currentUserId || food.donor_id === currentUserId;

    // Check expiry
    const expiryDate = new Date(food.expiry_time);
    const now = new Date();
    const diffHours = (expiryDate - now) / 3600000;
    
    let expiryText = '';
    let expiryColor = 'var(--text-muted)';
    if (diffHours < 0 || (food.status !== 'available' && food.status !== 'booked')) {
        expiryText = food.status === 'claimed' ? 'Claimed' : 'Expired';
        expiryColor = 'var(--text-muted)';
    } else if (diffHours < 2) {
        expiryText = `Expires in ${Math.round(diffHours * 60)} mins`;
        expiryColor = 'var(--danger)';
    } else {
        expiryText = `Expires in ${Math.round(diffHours)} hours`;
    }

    return (
        <div className="card">
            <div className="card-img-container" style={{ position: 'relative' }}>
                {food.image_url ? (
                    <img src={food.image_url.startsWith('data:') ? food.image_url : `http://localhost:5000${food.image_url}`} alt={food.food_name} className="card-img" />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--border)', color: 'var(--text-muted)' }}>
                        No Image
                    </div>
                )}
                {food.status === 'booked' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(234, 179, 8, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="badge badge-booked" style={{ fontSize: '1.2rem', padding: '0.5rem 1rem', boxShadow: 'var(--shadow-md)' }}>RESERVED</span>
                    </div>
                )}
            </div>
            
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{food.food_name}</h3>
                            {food.donor_id?.badges?.includes('Hunger Hero') && (
                                <Award size={18} color="var(--primary)" />
                            )}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Quantity: {food.quantity}</p>
                    </div>
                    <span className={`badge badge-${food.category.replace('-', '')}`}>{food.category}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <MapPin size={16} style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                            <span>{food.address}</span>
                        </div>
                        {food.location?.coordinates && (
                            <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${food.location.coordinates[1]},${food.location.coordinates[0]}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-outline"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem', border: '1px solid var(--border)', color: 'var(--primary)' }}
                                title="Get Directions"
                            >
                                <Navigation size={12} /> Directions
                            </a>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: expiryColor, fontSize: '0.875rem', fontWeight: 500 }}>
                        <Clock size={16} />
                        <span>{expiryText}</span>
                    </div>
                </div>

                {!isOwner && food.status === 'available' && diffHours > 0 && onBook && (
                    <button className="btn btn-primary" onClick={() => onBook(food._id)} style={{ width: '100%' }}>
                        Book Food
                    </button>
                )}
                
                {!isOwner && food.status === 'booked' && food.booked_by === currentUserId && onClaim && (
                    <button className="btn" onClick={() => onClaim(food._id)} style={{ width: '100%', background: '#ca8a04', color: 'white', border: 'none' }}>
                        Confirm Claimed
                    </button>
                )}
                
                {isOwner && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, color: food.status === 'available' ? 'var(--primary)' : 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                            {food.status.toUpperCase()}
                        </div>
                        {food.status !== 'claimed' && onDelete && (
                            <button className="btn btn-outline" onClick={() => onDelete(food._id)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.5rem 1rem' }}>
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodCard;
