
export default function NoInternetPage() {
    return (
        <div className="no-internet-wrapper d-flex justify-content-center align-items-center">
            <div className="no-internet-card text-center p-4 position-relative">

                <div className="icon-wrapper mb-3">
                    <i className="fa-solid fa-wifi-slash text-danger main-icon"></i>
                </div>

                <h2 className="fw-bold mb-2">No Internet Connection</h2>
                <p className="text-muted px-3">
                    It looks like you’re offline. Check your network and try again.
                </p>

                <button
                    className="btn bg-body-tertiary w-100 mt-3 animate-press"
                    onClick={() => window.location.reload()}
                >
                    <i className="fa-solid fa-rotate-right me-2"></i>
                    Retry
                </button>

                <div className="wifi-bars">
                    <span></span><span></span><span></span><span></span>
                </div>

            </div>
        </div>
    );
}
