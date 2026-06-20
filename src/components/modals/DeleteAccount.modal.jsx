import { useState } from "react";

const DeleteAccountModal = ({ onConfirm, onClose }) => {
    const [formValues, setFormValues] = useState({
        password: '',
        showPassword: false,
        error: null,
    })

    const handleSubmitForm = async (e) => {
        e.preventDefault()

        // Validate Password
        if (formValues.password.trim() === '') {
            setFormValues({ ...formValues, error: 'Required' });
            return;
        }

        // Submit Form
        onConfirm?.(formValues.password);
        onClose?.();
    }

    return (<>
        <div className="p-4 text-center">
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-shield-exclamation fs-2"></i>
            </div>
            <h5 className="fw-bold text-white">Delete Account?</h5>
            <p className="text-secondary small">This action is irreversible. All your projects, tasks, and settings will be permanently erased from our servers.</p>

            {/* Password Form */}
            <form id="delete-account-modal-form" className="row g-3" onSubmit={handleSubmitForm}>

                {/* Current Password */}
                <div className="text-start">
                    <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-lock"></i></span>
                        <input
                            type={formValues.showPassword ? "text" : "password"}
                            className="form-control" placeholder="••••••••"
                            value={formValues.password}
                            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                        />
                        <span className="input-group-text pointer" onClick={() => setFormValues({ ...formValues, showPassword: !formValues.showPassword })}>
                            {formValues.showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                        </span>
                    </div>
                    {formValues.error && <div className="form-label text-end text-danger small m-1">{formValues.error}</div>}
                </div>
            </form>

            {/* Actions */}
            <div className="d-flex flex-column gap-3 mt-4">
                <button className={`btn btn-danger fw-bold`} onClick={onConfirm}>
                    Yes, Delete Everything
                </button>

                <button className="btn btn-link text-muted text-decoration-none w-100 btn-sm" onClick={onClose}>
                    Keep My Account
                </button>
            </div>
        </div>
    </>);
}

export default DeleteAccountModal;