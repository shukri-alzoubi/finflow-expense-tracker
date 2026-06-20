import { formatCurrency } from "../../utils/formatCurrency.util";

const RestrictionModal = ({ type = "limit", name = "transactions", value = 50, onClose, onUpgrade, price }) => {
    return (<>
        {/* Header */}
        <div className="modal-header border-0 pb-0">
            {type === "limit" && <h5 className="modal-title fw-bold fs-4">🚀 Upgrade to Pro</h5>}
            {type === "permission" && <h5 className="modal-title fw-bold fs-4">🔒 Pro Feature Only</h5>}
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
            ></button>
        </div>

        {/* Body */}
        <div className="modal-body text-body-tertiary p-4">
            {type === "limit" && <p>
                You've reached the limit of <strong>{value} {name}</strong> on the Free plan.
                Upgrade to Pro today for unlimited tracking, custom categories, and data exports!
            </p>}

            {type === "permission" && <p>
                <strong>{name}</strong> permission are reserved for Pro users.
                Upgrade now to back up your data or migrate existing CSV/JSON transaction records.
            </p>}
        </div>

        {/* Actions */}
        <div className="modal-footer border-0 pt-0 d-flex flex-column gap-2">
            <button
                type="button"
                className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold"
                onClick={onUpgrade}
            >
                Unlock Unlimited Access (${price.amount}/mo)
            </button>
            <button
                type="button"
                className="btn btn-link text-muted text-decoration-none w-100 btn-sm"
                onClick={onClose}
            >
                Maybe Later
            </button>
        </div>
    </>);
}

export default RestrictionModal;