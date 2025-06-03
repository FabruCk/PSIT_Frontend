import React, { useState } from 'react';

import PropTypes from 'prop-types';

const Login = ({ onLogin, error }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login - Enviando datos:', formData);
        onLogin(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label htmlFor="username">Usuario</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    placeholder="Ingrese usuario"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="Ingrese contraseña"
                />
            </div>

            <button type="submit" className="login-button">
                Iniciar Sesión
            </button>
        </form>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
    error: PropTypes.string
};

Login.defaultProps = {
    error: null
};

export default Login;