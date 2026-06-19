import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth.context';
import app from '../../assets/app.json'
import { useTheme } from '../../context/Theme.context';
import plans from '../../assets/mock/plans.mock.json'
import { formatCurrency } from '../../utils/formatCurrency.util';
import Footer from '../../components/ui/Footer';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleUpgradePlan = (planId) => {
        if(user){
            if(planId === 'free'){
                navigate('/dashboard')
            }else{
                alert('Redirecting to checkout...')
            }
        }else{
            navigate('/signup')
        }
    }

    return (
        <div className="min-vh-100">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg fixed-top bg-body-secondary border-bottom shadow">
                <div className="container">
                    <a className="navbar-brand fw-extrabold" href="/#">
                        <i className={`${app.icon} text-${app.color} me-2`}></i>{app.full_name}
                    </a>
                    <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item"><a className="nav-link px-3 text-secondary" href="#features">Features</a></li>
                            <li className="nav-item"><a className="nav-link px-3 text-secondary" href="#pricing">Pricing</a></li>

                            {!user && <li className="nav-item ms-lg-3">
                                <Link className="nav-link fw-bold" to={'/login'}>Sign In</Link>
                            </li>}

                            {!user && <li className="nav-item ms-lg-2">
                                <Link className="btn btn-primary rounded-pill px-4 fw-bold" to="/signup">Get Started</Link>
                            </li>}

                            {user && <li className="nav-item ms-lg-2">
                                <Link className="btn btn-primary rounded-pill px-4 fw-bold" to="/dashboard">Go to dashboard</Link>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header id="hero" className="hero-section text-center" style={{ padding: "160px 0 100px" }}>
                <div className="container">
                    <div className="hero-badge">Now with Smart Budgeting</div>
                    <h1 className="display-3 fw-bolder mb-4">Master your spend.<br /><span className="text-primary">Without the effort.</span></h1>
                    <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: "650px" }}>
                        The minimalist expense tracker built for modern founders. Track transactions, set category budgets, and save time with one-click Google login.
                    </p>
                    <div className="d-flex justify-content-center gap-3 mb-5">
                        <Link to="/signup" className="btn btn-primary btn-lg px-5 rounded-pill shadow">
                            {!user && 'Start Tracking Free'}
                            {user && 'Open Dashboard'}
                        </Link>
                    </div>

                    <div className="d-flex justify-content-center">
                        <div className="btn-google-auth d-flex align-items-center px-4 shadow-sm">
                            <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" width="20" className="me-2" alt="Google" />
                            <span className="small text-muted">Join 1,000+ builders using Google Auth</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section id="features" className="py-5 bg-body-secondary">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Everything you need, nothing you don't</h2>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4 feature-card">
                            <div className="p-4">
                                <div className="feature-icon"><i className="bi bi-lightning-charge"></i></div>
                                <h5 className="fw-bold">Instant Logging</h5>
                                <p className="text-muted">No complicated forms. Log an expense in 5 seconds and get back to building your business.</p>
                            </div>
                        </div>
                        <div className="col-md-4 feature-card">
                            <div className="p-4">
                                <div className="feature-icon"><i className="bi bi-pie-chart"></i></div>
                                <h5 className="fw-bold">Budget Guardrails</h5>
                                <p className="text-muted">Set monthly limits for software, ads, or rent. We’ll alert you before you overspend.</p>
                            </div>
                        </div>
                        <div className="col-md-4 feature-card">
                            <div className="p-4">
                                <div className="feature-icon"><i className="bi bi-shield-lock"></i></div>
                                <h5 className="fw-bold">Pro Privacy</h5>
                                <p className="text-muted">Your data is yours. We use high-level encryption and secure Google OAuth by default.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-5">
                <div className="container">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold display-5">Simple, Transparent Pricing</h2>
                        <p className="text-muted lead">
                            Choose the plan that fits your financial tracking needs. Upgrade or cancel anytime.
                        </p>
                    </div>

                    {/* Pricing Cards Grid */}
                    <div className="row justify-content-center align-items-center g-4">

                        {Object.values(plans).map((plan) =>
                            <div key={plan.planId} className="col-md-5 col-lg-4">
                                <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
                                    {/* Popular Badge */}
                                    {plan.badge && <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary px-3 py-2 text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.75rem' }}>
                                        {plan.badge}
                                    </span>}

                                    <div className="card-body d-flex flex-column">
                                        <div className="mb-3">
                                            <h3 className="fw-bold h4 mb-1">{plan.name}</h3>
                                            <p className="text-muted small">{plan.description}</p>
                                        </div>

                                        <div className="d-flex align-items-baseline mb-4">
                                            <span className="display-4 fw-bold">${plan.price.amount}</span>
                                            <span className="text-muted ms-2">/ month</span>
                                        </div>

                                        <hr className="text-muted opacity-25 mb-4" />

                                        {/* Features */}
                                        <ul className="list-unstyled space-y-3 mb-5 flex-grow-1">
                                            {plan.features.map((feature, index) => <li key={index} className="d-flex align-items-center mb-3">
                                                <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                                                <span>{feature}</span>
                                            </li>)}

                                        </ul>

                                        {plan.planId == 'free' ? <button
                                            className="btn btn-outline-primary w-100 py-2.5 rounded-3 fw-semibold mt-auto"
                                            onClick={() => handleUpgradePlan(plan.planId)}>
                                            Get Started
                                        </button> : <button
                                            className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold mt-auto"
                                            onClick={() => handleUpgradePlan(plan.planId)}>
                                            Upgrade to Pro
                                        </button>}
                                    </div>
                                </div>
                            </div>)}

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;