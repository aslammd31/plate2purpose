import { useState, useEffect } from 'react';
import { getAnalytics } from '../utils/localStorageDB';
import { Users, Utensils, Award, TrendingUp } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAnalytics();
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading platform impact...</div>;

    return (
        <div className="animate-fade-in">
            <header className="page-header animate-pop-in">
                <h1 className="page-title text-gradient" style={{ fontSize: '3.5rem' }}>Our Global Impact 🌍</h1>
                <p className="page-subtitle">See how Plate2Purpose is actively reducing food waste and feeding communities.</p>
            </header>

            <div className="grid" style={{ marginTop: '3rem' }}>
                <div className="card glass-panel flex flex-col items-center" style={{ padding: '3rem', textAlign: 'center', alignItems: 'center' }}>
                    <div className="float-anim" style={{ background: 'linear-gradient(135deg, var(--primary-light), white)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                        <Utensils color="var(--primary-dark)" size={36} />
                    </div>
                    <h3 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                        {stats?.totalSaved || 0}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Meals Claimed</p>
                </div>

                <div className="card glass-panel flex flex-col items-center" style={{ padding: '3rem', textAlign: 'center', alignItems: 'center' }}>
                    <div className="float-anim-delay" style={{ background: 'linear-gradient(135deg, var(--secondary-light), white)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)' }}>
                        <Users color="var(--secondary-dark)" size={36} />
                    </div>
                    <h3 className="text-gradient-secondary" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                        {stats?.totalUsers || 0}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Active Members</p>
                </div>

                <div className="card glass-panel flex flex-col items-center" style={{ padding: '3rem', textAlign: 'center', alignItems: 'center' }}>
                    <div className="float-anim" style={{ background: 'linear-gradient(135deg, #e0e7ff, white)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(67, 56, 202, 0.2)' }}>
                        <TrendingUp color="#4338ca" size={36} />
                    </div>
                    <h3 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#4338ca', marginBottom: '0.25rem', textShadow: '0 4px 12px rgba(67, 56, 202, 0.3)' }}>
                        {stats?.activeListings || 0}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Live Listings</p>
                </div>

                <div className="card glass-panel flex flex-col items-center" style={{ padding: '3rem', textAlign: 'center', alignItems: 'center' }}>
                    <div className="float-anim-delay" style={{ background: 'linear-gradient(135deg, #fce7f3, white)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(190, 24, 93, 0.2)' }}>
                        <Award color="#be185d" size={36} />
                    </div>
                    <h3 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#be185d', marginBottom: '0.25rem', textShadow: '0 4px 12px rgba(190, 24, 93, 0.3)' }}>
                        {stats?.platformPoints || 0}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Hero Points</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
