import { Link } from 'react-router-dom';
import authImage from '../../assets/images/auth.placeholder.jpg'
import { useTheme } from '../../context/Theme.context';

const AuthLayout = ({ children, layout = 'start' }) => {
    const { theme, toggleTheme } = useTheme()

    return (<div className="container-fluid vh-100">
        <div className="row h-100">
            <div className={`col-12 col-lg-7 ${layout === 'end' && 'order-2'} `}>
                <div className="d-flex flex-column h-100">
                    <div className="d-flex justify-content-between align-items-center p-3 px-1">
                        <Link to='/' className="text-body fs-4 text-decoration-none">
                            <i className="bi bi-arrow-left"></i>
                        </Link>

                        <div>
                            {/* Theme Toggle */}
                            <button className="btn" onClick={toggleTheme}>
                                {theme === 'light' ?
                                    <i className="bi bi-moon-stars-fill"></i> :
                                    <i className="bi bi-brightness-high-fill"></i>
                                }
                            </button>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center position-relative overflow-hidden flex-grow-1">
                        {children}
                    </div>


                </div>
            </div>

            {/* LEFT SIDE IMAGE */}
            <div className={`col-lg-5 ${layout === 'end' && 'order-1'} d-none d-lg-block vh-100 p-3`}>
                <div className="bg-body-secondary h-100 rounded-3 overflow-none">
                    <div className="auth-image" style={{ backgroundImage: `url(${authImage})` }}></div>
                </div>
            </div>

        </div>
    </div>);
}

export default AuthLayout;