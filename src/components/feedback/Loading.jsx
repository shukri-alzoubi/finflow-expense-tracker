import app from '../../assets/app.json';

const Loading = ({className, message = 'Loading ...'}) => {
    return (<>
        <div className={className ?? 'vh-100 d-flex flex-column align-items-center justify-content-center bg-body'}>
            <div className="loading-wrapper">
                <div className="loader-icon">
                    <i className={`${app.icon} text-${app.color}`}></i>
                </div>

                <span className="brand-name">{app.name}</span>

                <div className="loading-bar-container bg-body-secondary">
                    <div className="loading-bar-progress"></div>
                </div>

                <p className="loading-status" id="status-text">{message}</p>
            </div>
        </div>
        
    </>);
}

export default Loading;