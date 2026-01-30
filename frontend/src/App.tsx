import React from 'react';
import LoginForm from './components/auth/LoginForm';

function App() {
    const handleLogin = (email: string, password: string) => {
        console.log('Login attempt:', { email, password });
        // Here you would typically make an API call to your backend
        alert(`Login successful for ${email}!`);
    };

    return (
        <div className="App">
            <LoginForm onSubmit={handleLogin} />
        </div>
    );
}

export default App;
