import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import "../register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { saveAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validação de senha
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const validatePassword = (password) => {
    const validations = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(validations).filter(Boolean).length;
    
    setPasswordStrength({
      ...validations,
      score
    });
  };

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 4) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength.score <= 2) return 'strength-weak';
    if (passwordStrength.score <= 4) return 'strength-medium';
    return 'strength-strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (passwordStrength.score < 3) {
      setError('Please create a stronger password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const res = await api.register(formData.username, formData.password);
      
      if (res.token) {
        setSuccess('Account created successfully! Redirecting...');
        saveAuth(res.user, res.token);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Criar conta</h2>
          
        </div>
        
        <form onSubmit={submit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Escolha um username"
              required
              minLength="3"
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Crie uma password forte"
                required
                minLength="8"
                autoComplete="new-password"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {/* Indicador de força da senha */}
            {formData.password && (
              <>
                <div className="password-strength">
                  <span>Password strength: </span>
                  <strong>{getPasswordStrengthText()}</strong>
                  <div className="strength-meter">
                    <div className={`strength-meter-fill ${getPasswordStrengthClass()}`} />
                  </div>
                </div>
                
                <div className="password-requirements">
                  <h4>Password must contain:</h4>
                  <ul>
                    <li className={passwordStrength.hasMinLength ? 'valid' : ''}>
                      At least 8 characters
                    </li>
                    <li className={passwordStrength.hasUpperCase ? 'valid' : ''}>
                      One uppercase letter
                    </li>
                    <li className={passwordStrength.hasLowerCase ? 'valid' : ''}>
                      One lowercase letter
                    </li>
                    <li className={passwordStrength.hasNumber ? 'valid' : ''}>
                      One number
                    </li>
                    <li className={passwordStrength.hasSpecialChar ? 'valid' : ''}>
                      One special character
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirme a password"
                required
                autoComplete="new-password"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || passwordStrength.score < 3}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          {error && (
            <div className="message error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="message success-message">
              {success}
            </div>
          )}
        </form>
        
        <div className="register-footer">
          Já tem conta?
          <Link to="/login">Login aqui</Link>
        </div>
      </div>
    </div>
  );
}