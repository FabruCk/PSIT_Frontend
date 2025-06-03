import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const HomePage = () => {
    return (
        <div className="home">
            <div className="hero">
                <img src={logo} className="logo" alt="FluVent Logo" />
                <h1>FluVent</h1>
                <p>Sistema de Gestión de Inventario</p>
                <div className="cta-buttons">
                    <Link to="/login" className="cta-button primary">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;