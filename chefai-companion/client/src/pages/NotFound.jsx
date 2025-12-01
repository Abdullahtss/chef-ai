import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="not-found-page" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/home" style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
            }}>
                Go to Home
            </Link>
        </div>
    );
}

export default NotFound;
