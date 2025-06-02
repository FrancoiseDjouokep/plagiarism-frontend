import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Home.css';
import '../styles/Layout.css';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Plagiarism Check',
            route: '/check',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0013.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
            )
        },
        {
            title: 'Compare One',
            route: '/compare-one',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 4.553a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414 0L12 13m3-3a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
            )
        },
        {
            title: 'Upload Document',
            route: '/upload',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
                </svg>
            )
        },
        {
            title: 'AI Detect',
            route: '/ai-detection',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 4a3 3 0 00-6 0v1H6a2 2 0 00-2 2v2.5a2 2 0 002 2V17a3 3 0 006 0m1-13a3 3 0 016 0v1h1a2 2 0 012 2v2.5a2 2 0 01-2 2V17a3 3 0 01-6 0" />
                </svg>
            )
        }

    ];

    return (
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