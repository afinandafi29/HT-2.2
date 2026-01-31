import './Ballpit.css';

// Placeholder Ballpit component - can be replaced with actual implementation later
const Ballpit = () => {
    return (
        <div className="ballpit-container">
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 30% 50%, rgba(255, 0, 150, 0.3), transparent 50%), radial-gradient(circle at 70% 50%, rgba(0, 150, 255, 0.3), transparent 50%)',
                animation: 'ballpitPulse 4s ease-in-out infinite'
            }} />
            <style>{`
        @keyframes ballpitPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
        </div>
    );
};

export default Ballpit;
