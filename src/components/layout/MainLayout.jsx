import { Link, useLocation } from 'react-router-dom';
import app from '../../assets/app.json'
import { useNotifier } from '../../context/Notifier.context';
import ConfirmModal from '../modals/Confirm.modal';
import { useTheme } from '../../context/Theme.context';
import SidebarContent from './Sidebar';
import { useAuth } from '../../context/Auth.context';
import BackToTop from '../ui/BackToTopButton';
import { useEffect, useRef, useState } from 'react';

const MainLayout = ({ children, path = '/dashboard' }) => {

    const {
        user,
        logout,
        isAdmin,
    } = useAuth();

    const {
        showModal,
        closeModal,
    } = useNotifier();

    const {
        theme,
        toggleTheme
    } = useTheme();

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible)

    const menuItems = [
        { name: 'Main' },
        { name: 'Overview', path: '/dashboard', icon: 'bi-grid-1x2' },
        { name: 'Transactions', path: '/transactions', icon: 'bi-arrow-left-right' },
        { name: 'Categories', path: '/categories', icon: 'bi-tags' },

        { name: 'Account' },
        { name: 'Settings', path: '/settings', icon: 'bi-gear' },
    ];

    const handleSignOut = () => {
        showModal(<ConfirmModal
            title={'Sign Out'}
            message={'Do you want to sign out?'}
            confirmText={'Sign Out'}
            confirmColor={'danger'}
            onCancel={closeModal}
            onConfirm={() => {
                logout()
            }}
        />, { size: 'modal-sm' })
    }

    return (
        <div className="vh-100 d-flex flex-column flex-lg-row overflow-y-auto" >
            {/* Desktop Sidebar (Visible on LG screens and up) */}
            <aside className="d-none d-lg-flex flex-column border-end border-secondary border-opacity-25 position-sticky left-0 sidebar overflow-none nowrap"
                style={{ minWidth: isSidebarVisible ? '250px' : '0px', width: isSidebarVisible ? '250px' : '0px', height: '100vh', transition: '0.3s all ease' }}>

                <div className="d-flex align-items-center justify-content-between px-2 py-3">
                    <Link to="/dashboard" className="d-flex align-items-center text-body text-decoration-none gap-2 px-2">
                        <i className={`${app.icon} fs-4 text-${app.color}`}></i>
                        <span className="fs-4 fw-bold">{app.name}</span>
                    </Link>
                </div>

                <div className="flex-grow-1 overflow-y-auto">
                    <SidebarContent
                        isAdmin={isAdmin}
                        user={user}
                        menuItems={menuItems}
                        path={path}
                        onSignOut={handleSignOut}
                    />
                </div>
            </aside>

            {/* Mobile Offcanvas Sidebar (Triggered by Hamburger) */}
            <div className="mobile-offcanvas offcanvas offcanvas-start border-end border-secondary border-opacity-25 "
                tabIndex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel" style={{ width: '280px' }}>
                
                <div className="d-flex align-items-center justify-content-between px-2 py-3">
                    <Link to="/dashboard" className="d-flex align-items-center text-body text-decoration-none gap-2 px-2">
                        <i className={`${app.icon} fs-4 text-${app.color}`}></i>
                        <span className="fs-4 fw-bold">{app.name}</span>
                    </Link>

                    <button type="button" className="btn-close border-0 shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body vh-100">
                    <SidebarContent
                        isAdmin={isAdmin}
                        user={user}
                        menuItems={menuItems}
                        path={path}
                        onSignOut={handleSignOut}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="d-flex flex-column flex-grow-1 overflow-x-auto">

                {/* Navbar */}
                <nav className="navbar border-bottom border-secondary border-opacity-25 sticky-top px-3 px-md-4 py-2 bg-body e">
                    <div className="container-fluid p-0">
                        <div className="d-flex align-items-center gap-2">
                            {/* Hamburger Menu - Only visible on Mobile/Tablet */}
                            <button
                                className="btn btn-link text-body p-0 border-0 shadow-none"
                                type="button"
                                onClick={toggleSidebar}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#mobileSidebar"
                            >
                                <i className="bi bi-list fs-3"></i>
                            </button>

                            <div className="fs-5">
                                {app.name}
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <button className="btn btn-link text-body p-0 position-relative" onClick={toggleTheme}>
                                {theme === 'light' ? <i className="bi bi-moon-fill fs-5"></i> : <i className="bi bi-sun-fill fs-5"></i>}
                            </button>


                            {/* Mobile Branding (Only visible on small screens) */}
                            <div className="text-primary fs-4" onClick={() => document.location.reload()}>
                                <i className={app.icon}></i>
                            </div>
                        </div>
                    </div>
                </nav>


                <div className="p-2 py-3 p-md-4 w-100 flex-gow-1 overflow-y-auto" style={{ minWidth: 0 }}>
                    {children}
                </div>
            </div>

            {/* Back To Top */}
            <BackToTop />
        </div>
    );
};

export default MainLayout;