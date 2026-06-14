import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/Auth.context';
import app from '../../assets/app.json'
import { useTheme } from '../../context/Theme.context';

const LandingPage = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleUpgradePlan = () => {

    }

    return (
        <div className="min-vh-100">

            {/* Navbar */}
            <nav class="navbar navbar-expand-lg fixed-top bg-body-secondary border-bottom shadow">
                <div class="container">
                    <a class="navbar-brand fw-extrabold" href="/#">
                        <i class={`${app.icon} text-${app.color} me-2`}></i>{app.full_name}
                    </a>
                    <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto align-items-center">
                            <li class="nav-item"><a class="nav-link px-3 text-secondary" href="#features">Features</a></li>
                            <li class="nav-item"><a class="nav-link px-3 text-secondary" href="#pricing">Pricing</a></li>

                            {!user && <li class="nav-item ms-lg-3">
                                <Link class="nav-link fw-bold" to={'/login'}>Sign In</Link>
                            </li>}
                            {!user && <li class="nav-item ms-lg-2">
                                <Link class="btn btn-primary rounded-pill px-4 fw-bold" to="/signup">Get Started</Link>
                            </li>}
                            {user && <li class="nav-item ms-lg-2">
                                <Link class="btn btn-primary rounded-pill px-4 fw-bold" to="/dashboard">Go to dashboard</Link>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header class="hero-section text-center" style={{ padding: "160px 0 100px" }}>
                <div class="container">
                    <div class="hero-badge">Now with Smart Budgeting</div>
                    <h1 class="display-3 fw-bolder mb-4">Master your spend.<br /><span class="text-primary">Without the effort.</span></h1>
                    <p class="lead text-muted mb-5 mx-auto" style={{ maxWidth: "650px" }}>
                        The minimalist expense tracker built for modern founders. Track transactions, set category budgets, and save time with one-click Google login.
                    </p>
                    <div class="d-flex justify-content-center gap-3 mb-5">
                        <Link to="/signup" class="btn btn-primary btn-lg px-5 rounded-pill shadow">
                            {!user && 'Start Tracking Free'}
                            {user && 'Open Dashboard'}
                        </Link>
                    </div>

                    <div class="d-flex justify-content-center">
                        <div class="btn-google-auth d-flex align-items-center px-4 shadow-sm">
                            <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" width="20" class="me-2" alt="Google" />
                            <span class="small text-muted">Join 1,000+ builders using Google Auth</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section id="features" class="py-5 bg-body-secondary">
                <div class="container py-5">
                    <div class="text-center mb-5">
                        <h2 class="fw-bold">Everything you need, nothing you don't</h2>
                    </div>
                    <div class="row g-4">
                        <div class="col-md-4 feature-card">
                            <div class="p-4">
                                <div class="feature-icon"><i class="bi bi-lightning-charge"></i></div>
                                <h5 class="fw-bold">Instant Logging</h5>
                                <p class="text-muted">No complicated forms. Log an expense in 5 seconds and get back to building your business.</p>
                            </div>
                        </div>
                        <div class="col-md-4 feature-card">
                            <div class="p-4">
                                <div class="feature-icon"><i class="bi bi-pie-chart"></i></div>
                                <h5 class="fw-bold">Budget Guardrails</h5>
                                <p class="text-muted">Set monthly limits for software, ads, or rent. We’ll alert you before you overspend.</p>
                            </div>
                        </div>
                        <div class="col-md-4 feature-card">
                            <div class="p-4">
                                <div class="feature-icon"><i class="bi bi-shield-lock"></i></div>
                                <h5 class="fw-bold">Pro Privacy</h5>
                                <p class="text-muted">Your data is yours. We use high-level encryption and secure Google OAuth by default.</p>
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

                        {/* Free Tier */}
                        <div className="col-md-5 col-lg-4">
                            <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <h3 className="fw-bold h4 mb-1">Free</h3>
                                        <p className="text-muted small">Perfect for getting started</p>
                                    </div>

                                    <div className="d-flex align-items-baseline mb-4">
                                        <span className="display-4 fw-extrabold">$0</span>
                                        <span className="text-muted ms-2">/ month</span>
                                    </div>

                                    <hr className="text-muted opacity-25 mb-4" />

                                    {/* Features */}
                                    <ul className="list-unstyled space-y-3 mb-5 flex-grow-1">
                                        <li className="d-flex align-items-center mb-3">
                                            <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                                            <span>Up to <strong>50 transactions</strong></span>
                                        </li>
                                        <li className="d-flex align-items-center mb-3">
                                            <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                                            <span>Up to <strong>10 custom categories</strong></span>
                                        </li>
                                        <li className="d-flex align-items-center mb-3 text-muted opacity-50">
                                            <i className="bi bi-x-circle-fill text-danger me-3 fs-5"></i>
                                            <del>Data Import / Export permissions</del>
                                        </li>
                                    </ul>

                                    <button
                                        className="btn btn-outline-primary w-100 py-2.5 rounded-3 fw-semibold mt-auto"
                                        onClick={() => handleUpgradePlan('free')}>
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Pro Tier (Highlighted) */}
                        <div className="col-md-5 col-lg-4">
                            <div className="card h-100 shadow border-primary border-2 rounded-4 p-4 position-relative">

                                {/* Popular Badge */}
                                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary px-3 py-2 text-uppercase fw-bold tracking-wider" style={{ fontSize: '0.75rem' }}>
                                    Most Popular
                                </span>

                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <h3 className="fw-bold h4 mb-1">Pro</h3>
                                        <p className="text-muted small">For serious financial tracking</p>
                                    </div>

                                    <div className="d-flex align-items-baseline mb-4">
                                        <span className="display-4 fw-bold">$8</span>
                                        <span className="text-muted ms-2">/ month</span>
                                    </div>

                                    <hr className="text-muted opacity-25 mb-4" />

                                    {/* Features */}
                                    <ul className="list-unstyled mb-5 flex-grow-1">
                                        <li className="d-flex align-items-center mb-3">
                                            <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                                            <span><strong>Unlimited</strong> transactions</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-3">
                                            <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                                            <span><strong>Unlimited</strong> custom categories</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-3">
                                            <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                                            <span>Full <strong>Import & Export</strong> permissions (CSV/JSON)</span>
                                        </li>
                                        <li className="d-flex align-items-center mb-3">
                                            <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                                            <span>Priority Support</span>
                                        </li>
                                    </ul>

                                    <button
                                        className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold shadow-sm mt-auto"
                                        onClick={() => handleUpgradePlan('pro')}>
                                        Upgrade to Pro
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer class="text-center bg-body-secondary">
                <div class="container">
                    <p class="text-body small mb-0">&copy; 2026 {app.name}. Built for makers, by makers.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;