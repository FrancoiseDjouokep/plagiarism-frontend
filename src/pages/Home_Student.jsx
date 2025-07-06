import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Home.css';
import '../styles/Layout.css';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        { 
            title: 'Verification Plagiat', 
            route: '/check',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0013.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
            )
        },
        { 
            title: 'Detection IA', 
            route: '/ai-detection',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return(
        <div className="layout">
            <Navbar />
            <div className="home">
                <h2>Acceuil</h2>
                <section className="hfeatures">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="hfeature-box" 
                            onClick={() => navigate(feature.route)}
                        >
                            {feature.icon}
                            <h2>{feature.title}</h2>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Home;