import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getDashboard, removeFood, claimFood } from '../utils/localStorageDB';
import FoodCard from '../components/FoodCard';
import { Award, Star } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [posted, setPosted] = useState([]);
    const [claimed, setClaimed] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await getDashboard(user.id);
                setPosted(res.data.posted);
                setClaimed(res.data.claimed);
                setUserStats(res.data.userStats);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await removeFood(id, user.id);
            setPosted(posted.filter(f => f._id !== id));
            // Trigger a refetch of stats since removing food penalizes points
            const res = await getDashboard(user.id);
            setUserStats(res.data.userStats);
            alert('Listing deleted successfully!');
        } catch (err) {
            alert(err.response?.data?.msg || 'Could not delete listing');
        }
    };

    const handleClaim = async (id) => {
        try {
            await claimFood(id, user.id);
            alert('Food perfectly collected and finalized!');
            // Refresh dashboard
            const res = await getDashboard(user.id);
            setClaimed(res.data.claimed);
        } catch (err) {
            alert(err.response?.data?.msg || 'Could not finalize claim');
        }
    };

    if (loading) return <div style={{ textAlign:'center', marginTop:'4rem' }}>Loading dashboard...</div>;

    return (
        <div className="animate-fade-in">
            <header className="page-header" style={{ textAlign: 'left', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="page-title">Welcome, {user.name}</h1>
                    <p className="page-subtitle">Your Plate2Purpose Dashboard</p>
                </div>
                {userStats && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ background: 'var(--surface)', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Star color="#eab308" fill="#eab308" size={24} />
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1 }}>{userStats.points} pts</div>
                            </div>
                        </div>
                        {userStats.badges?.includes('Hunger Hero') && (
                            <div style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                                <Award size={24} /> Hunger Hero
                            </div>
                        )}
                    </div>
                )}
            </header>

            {['donor', 'ngo'].includes(user.role) && (
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Food You've Posted</h2>
                    {posted.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>You haven't posted any food yet.</p>
                    ) : (
                        <div className="grid">
                            {posted.map(food => (
                                <FoodCard key={food._id} food={food} currentUserId={user.id} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </section>
            )}

            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Food You've Claimed</h2>
                {claimed.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>You haven't claimed any food yet.</p>
                ) : (
                    <div className="grid">
                        {claimed.map(food => (
                            <FoodCard key={food._id} food={food} currentUserId={user.id} onClaim={handleClaim} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
