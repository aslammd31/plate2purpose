import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, Utensils } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="animate-pop-in" style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.1, position: 'relative', zIndex: 10 }}>
          Share Your Food,<br /> <span className="text-gradient hover:scale-105 transition-transform">Share Your Love. 💚</span>
        </h1>
        <p className="animate-pop-in float-anim" style={{ fontSize: '1.35rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
          Join the modern community reducing food waste. Connect with local donors, collect excess food, and become a <strong className="text-gradient">Hunger Hero</strong>.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/listings" className="btn btn-primary animate-pop-in" style={{ fontSize: '1.25rem', padding: '1rem 2rem', animationDelay: '0.2s' }}>
            Find Food Nearby ✨
          </Link>
          <Link to="/register" className="btn btn-secondary animate-pop-in" style={{ fontSize: '1.25rem', padding: '1rem 2rem', animationDelay: '0.4s' }}>
            Become a Donor 🤝
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '6rem', position: 'relative', zIndex: 2 }}>
        <h2 className="text-gradient" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem', fontWeight: 800 }}>How It Magic Works 🪄</h2>
        <div className="grid">
          <div className="card glass-panel flex flex-col items-center" style={{ padding: '2.5rem', textAlign: 'center', alignItems: 'center' }}>
            <div className="float-anim" style={{ background: 'linear-gradient(135deg, var(--primary-light), white)', padding: '1.5rem', borderRadius: '50%', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
              <Utensils color="var(--primary-dark)" size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>1. Post Extra Food</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Got leftovers? Donors list quality food with an expiry time and instantly become heroes.</p>
          </div>
          
          <div className="card glass-panel flex flex-col items-center" style={{ padding: '2.5rem', textAlign: 'center', alignItems: 'center' }}>
            <div className="float-anim-delay" style={{ background: 'linear-gradient(135deg, var(--secondary-light), white)', padding: '1.5rem', borderRadius: '50%', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
              <MapPin color="var(--secondary-dark)" size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>2. Find Locally</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>People in need browse the glowing map, spotting hot deals and delicious, free local food!</p>
          </div>

          <div className="card glass-panel flex flex-col items-center" style={{ padding: '2.5rem', textAlign: 'center', alignItems: 'center' }}>
            <div className="float-anim" style={{ background: 'linear-gradient(135deg, var(--danger), #be123c)', padding: '1.5rem', borderRadius: '50%', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
              <Heart color="white" size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>3. Claim & Collect</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Reserve instantly. Grab directions. Meet your neighbors and help eliminate food waste!</p>
          </div>
        </div>
      </div>
      
      {/* Decorative Blob */}
      <div className="float-anim-delay" style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: 'var(--primary-glow)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div className="float-anim" style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--secondary-glow)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
    </div>
  );
};

export default Home;
