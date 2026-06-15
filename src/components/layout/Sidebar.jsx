import { Link } from "react-router-dom";
import { useNotifier } from "../../context/Notifier.context";
import { useTheme } from "../../context/Theme.context";

const SidebarContent = ({ menuItems = [], path = '/', onSignOut, user, isAdmin = false }) => {

    const { theme, toggleTheme } = useTheme()

    const {
        showLoadingModal,
        showModal,
        closeModal,
        showToast
    } = useNotifier();

    return (<>
        <div className="overflow-y-auto d-flex flex-column p-1 p-lg-3 h-100 sidebar">

            <div className="flex-grow-1 overflow-y-auto">

                <ul className="nav nav-pills flex-column gap-1 ">
                    {menuItems.map((item) =>
                        !item.path ?
                            <li key={item.name}>
                                <div className="small text-secondary my-2">{item.name}</div>
                            </li> :
                            (<li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`nav-link border-0 py-2 px-3 rounded-3 mb-1 transition-all
                                ${path === item.path && 'active bg-primary shadow-sm'}`}
                                >
                                    <i className={`bi ${item.icon} me-3`}></i> {item.name}
                                </Link>
                            </li>)
                    )}

                    <li>
                        <Link className="nav-link border-0 py-2 px-3 rounded-3 mb-1 transition-all text-danger" onClick={onSignOut}>
                            <i className="bi bi-box-arrow-right me-3"></i> Sign Out
                        </Link>
                    </li>
                </ul>
            </div>


            {isAdmin && <Link className="btn btn-outline-primary rounded mb-3" to='/admin'>
                <i className="bi bi-shield-fill me-2"></i>
                Admin Panel
            </Link>}

            <hr className="border-secondary opacity-25" />

            <div className="d-flex align-items-center gap-2">
                <div className="text-secondary input-group-sm" style={{ width: '250px' }}>
                    {user?.email ?? 'User Account'}
                </div>

                <button className='nav-link p-1' onClick={toggleTheme}>
                    {theme === 'light' ? <i className='bi bi-moon-fill'></i> : <i className='bi bi-sun-fill'></i>}
                </button>
            </div>
        </div>
    </>);
}

export default SidebarContent;