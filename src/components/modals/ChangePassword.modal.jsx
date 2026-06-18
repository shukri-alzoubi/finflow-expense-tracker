import { useState } from "react";

const ChangePasswordModal = ({ onSubmit, onCancel }) => {

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
        try {
            let error = validateForm();
            if (error) {
                setFormError(error)
                return;
            }

            error = onSubmit && await onSubmit(formValues);
            if (error) {
                setFormError(error);
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (<>
        <div className="modal-header">
            <h5 className="fw-bold mb-0">Change Password</h5>
            <button className="btn-close" onClick={onCancel}></button>
        </div>
        <div className="modal-body p-4">
            <form className="row g-3" id="change-password-form" onSubmit={handleSubmitForm}>
                <div className="col-12">
                    <label className="form-label small text-secondary fw-bold">CURRENT PASSWORD</label>
                    <input
                        type="password" className="form-control" placeholder="••••••••"
                        value={formValues.current} onChange={(e) => setFormValues({ ...formValues, current: e.target.value })} />
                    <div className="form-label text-end text-danger small m-1">{formError.current}</div>
                </div>
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
                <div className="col-12">
                    <label className="form-label small text-secondary fw-bold">CONFIRM NEW PASSWORD</label>
                    <input
                        type={formValues.showPassword ? "text" : "password"} className="form-control" placeholder="••••••••"
                        value={formValues.confirmPassword} onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })} />
                    <div className="form-label text-end text-danger small m-1">{formError.confirmPassword}</div>
                </div>
            </form>
        </div>
        <div className="modal-footer border-0 p-2 border-top px-4 row">
            <button className="btn btn-secondary px-4 fw-bold col-auto" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary fw-bold col-auto" type="submit" form="change-password-form">Update Password</button>
        </div>
    </>);
}

export default ChangePasswordModal;