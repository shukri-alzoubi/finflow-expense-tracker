import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../context/Auth.context";
import { useState } from "react";

const ForgetPasswordPage = () => {

    const [isLoading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formValues, setFormValues] = useState({ email: '' });
    const [formError, setFromError] = useState({});

    const {
        sendPasswordReset,
    } = useAuth();

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Email Check
        if (!formValues?.email || formValues.email.trim() === '') return { email: "Email is Required" }
        if (emailRegex.test(formValues.email)) return { email: "Enter A Valid Email" }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const error = validateForm();
            error ?
                setFromError(error) :
                await sendPasswordReset(data.email);
            setSuccess(true)
        } catch (err) {
            setFromError({ root: err.message })
        }

        setLoading(false);
    }

    return (<AuthLayout >
        <form
            onSubmit={handleSubmit}
            className="p-4 p-md-5 border-0 rounded-4 position-relative"
            style={{ width: "100%", maxWidth: "420px", zIndex: 5 }}>

            <p className="text-secondary text-center nowrap mb-4">
                Enter Your Email to receive a password rest link
            </p>

            {/* Email */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-at" /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Email Address"
                        value={formValues.email}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    />
                </div>
                {formError.email && <div className="form-text text-danger fs-sm text-end">{formError?.email}</div>}
            </div>


            {/* Login Button */}
            <button
                type="submit"
                className="btn btn-dark w-100 mb-3 py-2 fw-bold">
                {success ? <span>Check your email<i className="bi bi-check-lg ms-2"></i></span> : 'Send Reset Link'}
            </button>

            <Link to='/login' className="text-body small">Back to login</Link>

        </form>
    </AuthLayout>);
}

export default ForgetPasswordPage;