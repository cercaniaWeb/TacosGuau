import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import '../styles/Login.css';

// Importa el logo directamente desde la carpeta public
const logo = '/logopanda.png';
const googleIcon = 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError("No se pudo iniciar sesión con Google. Inténtalo más tarde.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Logo Don Panda" className="login-logo" />
        <h2>Bienvenido</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Iniciar Sesión</button>
        </form>

        <div className="separator">o</div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img src={googleIcon} alt="Google Icon" className="google-icon" />
          Continuar con Google
        </button>

        
      </div>
    </div>
  );
};

export default Login;