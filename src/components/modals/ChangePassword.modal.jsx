import { useState } from "react";

const ChangePasswordModal = ({ onSubmit, onClose }) => {

    const [formValues, setFormValues] = useState({
        current: '',
        newPassword: '',
        confirmPassword: '',
        showPassword: '',
    })

    const [formError, setFormError] = useState({});

    const validateForm = () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!formValues.current || formValues.current.trim() === '') return { current: 'required' }
        if (!formValues.newPassword || formValues.newPassword.trim() === '') return { newPassword: 'required' }
        if (!passwordRegex.test(formValues.newPassword)) return { passnewPasswordord: 'password must have at least 8 characters, 1 uppercase letter and 1 number' }
        if (!formValues.confirmPassword || formValues.confirmPassword.trim() === '') return { confirmPassword: 'required' }
        if (formValues.newPassword !== formValues.confirmPassword) return { confirmPassword: 'password does not match' }

        return null;
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        
        let error = validateForm();
        if (error) {
            setFormError(error)
            return;
        }

        onSubmit?.(formValues)
    }


    return (<div className="p-4">
        {/* Header */}
        <div className="text-center mb-4">
            <div
                className={`bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-shield-lock-fill fs-2"></i>
            </div>

            <p className="text-body-tertiary small">Change Your Password</p>
        </div>

        {/* Change Password Form */}
        <form className="row g-3" id="change-password-modal-form" onSubmit={handleSubmitForm}>

            {/* Current Password */}
            <div className="col-12">
                <label className="form-label small text-secondary fw-bold">CURRENT PASSWORD</label>
                <input
                    type="password" className="form-control" placeholder="••••••••"
                    value={formValues.current} onChange={(e) => setFormValues({ ...formValues, current: e.target.value })} />
                <div className="form-label text-end text-danger small m-1">{formError.current}</div>
            </div>

            {/* New Password */}
            <div className="col-12">
                <label className="form-label small text-secondary fw-bold">NEW PASSWORD</label>
                <div className="input-group px-2">
                    <input
                        type={formValues.showPassword ? "text" : "password"} className="form-control" placeholder="Min. 8 characters"
                        value={formValues.newPassword} onChange={(e) => setFormValues({ ...formValues, newPassword: e.target.value })} />
                    <span
                        className="input-group-text bg-dark text-secondary pointer"
                        onClick={() => setFormValues({ ...formValues, showPassword: !formValues.showPassword })}>
                        {formValues.showPassword ? <i className="bi bi-eye text-primary"></i> : <i className="bi bi-eye-slash"></i>}
                    </span>
                </div>
                <div className="form-label text-end text-danger small m-1">{formError.newPassword}</div>
            </div>

            {/* Confirm Password */}
            <div className="col-12">
                <label className="form-label small text-secondary fw-bold">CONFIRM NEW PASSWORD</label>
                <input
                    type={formValues.showPassword ? "text" : "password"} className="form-control" placeholder="••••••••"
                    value={formValues.confirmPassword} onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })} />
                <div className="form-label text-end text-danger small m-1">{formError.confirmPassword}</div>
            </div>
        </form>

        {/* Actions */}
        <div className="d-flex flex-column gap-3 mt-4">
            <button className={`btn btn-danger fw-bold`} type="submit" form="change-password-modal-form">
                Update Password
            </button>

            <button className="btn btn-link text-muted text-decoration-none w-100 btn-sm" onClick={onClose}>
                Discard
            </button>
        </div>
    </div>);
}

export default ChangePasswordModal;