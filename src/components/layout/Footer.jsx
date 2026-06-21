import app from '../../assets/app.json';
import { useTheme } from '../../context/Theme.context';

const Footer = () => {
    const {theme, toggleTheme} = useTheme();

    return (<footer className="bg-body-secondary border-top pt-5 pb-4 mt-auto">
        <div className="container">
            <div className="row g-4 mb-5 justify-content-between">

                {/* Branding Block */}
                <div className="col-12 col-md-4">
                    <span className="fw-bold tracking-tight mb-2 d-block text-body-emphasis">
                        <i className={`${app.icon} text-${app.color} me-2`}></i>{app.full_name}
                    </span>
                    <p className="small text-secondary lh-base mb-0">
                        {app.description}
                    </p>
                </div>

                {/* Sitemap Anchor Array */}
                <div className="col-6 col-sm-4 col-md-2">
                    <h6 className="small text-uppercase tracking-wider text-body fw-bold mb-3">Sitemap</h6>
                    <ul className="list-unstyled d-flex flex-column gap-2 small">
                        <li><a href="/#hero" className="text-secondary text-decoration-none link-primary">Home</a></li>
                        <li><a href="/#features" className="text-secondary text-decoration-none link-primary">Feaures</a></li>
                        <li><a href="/#pricing" className="text-secondary text-decoration-none link-primary">Pricing</a></li>
                    </ul>
                </div>

                {/* Communication Direct Links */}
                <div className="col-6 col-sm-4 col-md-2">
                    <h6 className="small text-uppercase tracking-wider text-body fw-bold mb-3">Connect</h6>
                    <ul className="list-unstyled d-flex flex-column gap-2 small">
                        {app.links.map((link) => <li key={link.id}>
                            <a href={link.path} target="_blank" rel="noreferrer" className="text-secondary text-decoration-none link-primary d-inline-flex align-items-center">
                                <i className={`${link.icon} me-2`}></i> {link.name}
                            </a>
                        </li>)}
                    </ul>
                </div>

                {/* Secure Management Panel Path */}
                <div className="col-6 col-sm-4 col-md-2">
                    <h6 className="small text-uppercase tracking-wider text-body fw-bold mb-3">System</h6>
                    <ul className="list-unstyled d-flex flex-column gap-2 small">
                        <li>
                            <a href="/dashboard" className="text-secondary text-decoration-none link-primary d-inline-flex align-items-center fw-medium">
                                <i className="bi bi-speedometer2 me-2"></i> Dashboard
                            </a>

                        </li>
                        <li>
                            <a href="#theme" onClick={toggleTheme} className="text-body text-decoration-none d-inline-flex align-items-center fw-medium">
                                <i className={`bi bi-${theme === "light" ? "moon" : "sun"}-fill me-2 text-body`}></i> {theme === 'light' ? "Dark Theme" : "Light Theme"}
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Copyright Sub-Bar */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-4 border-top border-secondary-subtle">
                <p className="mb-0 text-muted small">&copy; {new Date().getFullYear()} FinFlow. Built for makers, by makers.</p>
                <div className="small">
                    <button
                    onClick={() => window.scrollTo({top: 0})}
                     className="btn border-0 text-decoration-none link-primary d-inline-flex align-items-center">
                        Return to Top <i className="bi bi-arrow-up-short fs-5 ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    </footer>);
}

export default Footer;