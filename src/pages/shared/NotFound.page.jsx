import { useAuth } from "../../context/Auth.context";

const NotFound = () => {
    const { user } = useAuth();

    return (<>
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center">
            <div className="error-container">
                <h1 className="error-code">404</h1>
                <p className="error-message">
                    The page you're looking for has been moved or doesn't exist. Let's get you back to your workspace.
                </p>
                <div className="fs-5">
                    {user ?
                        <a href="/dashboard" className="link-secondary">Back to Dashboard</a> :
                        <a href="/" id="dynamic-home-btn" className="link-secondary">Back to Home</a>
                    }
                </div>
            </div>
        </div>
    </>);
}

export default NotFound;