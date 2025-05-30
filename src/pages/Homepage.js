import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    imageRendering: 'crisp-edges',
    WebkitBackdropFilter: 'blur(0px)',
    backdropFilter: 'blur(0px)'
  };

  const handleExploreClick = () => {
    if (isLoggedIn) {
      navigate(`/${userRole.toLowerCase()}/courses`);
    } else {
      navigate('/available-courses');
    }
  };

  return (
    <div className="home-container" style={backgroundStyle}>
      {!isLoggedIn && (
        <div className="nav-buttons">
          <button 
            className="button nav-button" 
            onClick={() => navigate('/login')}
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Login
          </button>
          <button 
            className="button nav-button" 
            onClick={() => navigate('/register')}
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Register
          </button>
        </div>
      )}
      
      <div className="content-wrapper">
        <h1 className="title" style={{
          fontSize: '4rem',
          fontWeight: '700',
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          letterSpacing: '1px'
        }}>
          Welcome to EduSync
        </h1>
        <p className="subtitle" style={{
          fontSize: '1.5rem',
          color: '#e2e8f0',
          marginBottom: '2.5rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          {isLoggedIn ? 'Continue Your Learning Journey' : 'Your Gateway to Interactive Learning'}
        </p>
        
        <div className="button-container">
          {!isLoggedIn && (
            <button 
              className="button primary-button" 
              onClick={() => navigate('/register')}
              style={{
                padding: '15px 35px',
                fontSize: '1.2rem',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
            >
              Get Started
            </button>
          )}
          <button 
            className="button secondary-button" 
            onClick={handleExploreClick}
            style={{
              padding: '15px 35px',
              fontSize: '1.2rem',
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(45deg, #2196F3, #1976D2)',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            {isLoggedIn ? 'View My Courses' : 'Explore Courses'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage; 