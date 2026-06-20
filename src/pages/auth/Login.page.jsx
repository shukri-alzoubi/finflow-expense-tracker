import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";

const LoginPage = () => {

    const navigate = useNavigate();
    const { login, googleSignIn } = useAuth();

    const [formError, setFormError] = useState({})
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [formValues, setFormValues] = useState({ email: '', password: '' })


    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

        // Email Check
        if (!formValues?.email || formValues.email.trim() === '') return { email: "Email is Required" }
        if (!emailRegex.test(formValues.email)) return { email: "Enter A Valid Email" }

        // Password Check
        if (!formValues?.password || formValues.password.trim() === '') return { password: "Password is Required" }
        if (formValues.password.length < 8) return { password: "Password must be at least 8 characters long" }
        if (formValues.password.length > 20) return { password: "Password must be at max 20 characters long" }
        if (!passwordRegex.test(formValues.password)) return { password: "Password must include uppercase, lowercase and numbers" }

        return null;
    }

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const error = validateForm();
            if (error) {
                setFormError(error)
            } else {
                await login(formValues.email, formValues.password);
            }
        } catch (err) {
            setFormError({ root: err.message })
        }
        setLoading(false);
    }

    // Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error.message);
        }
    }

    return (<AuthLayout layout='start'>
        <form
            onSubmit={handleSubmit}
            className="p-4 p-md-5 border-0 rounded-4 position-relative"
            style={{ width: "100%", maxWidth: "420px", zIndex: 5 }}>

            <h2 className="fw-bold text-body mb-1 text-center display-5 nowrap">Welcome Back</h2>
            <p className="text-secondary text-center mb-4">
                Sign in to keep creating professional stuff
            </p>

            {/* Google Sign In */}
            <button
                type="button" onClick={handleGoogleSignIn}
                className="btn btn-dark w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" width="20" className="me-2" alt="Google" />
                Sign in with Google
            </button>

            <div className="text-center py-4">
                or sign in with email
            </div>

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

            {/* Pasword */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock" /></span>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="••••••••"
                        value={formValues.password}
                        onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                    />

                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ?
                            <i className="bi bi-eye-fill pointer"></i> :
                            <i className="bi bi-eye pointer"></i>}
                    </span>
                </div>

                {formError?.password && <div className="form-text text-danger fs-sm text-end">{formError.password}</div>}
                {formError?.root && <div className="form-text text-danger fs-sm text-end">{formError.root}</div>}
            </div>

            {/* Switch To Forgot Password Page */}
            <div className="d-flex justify-content-end mb-3">
                <Link to='/forgot-password' className="link-primary small">Forgot password?</Link>
            </div>

            {/* Login Button */}
            <button
                type="submit"
                className="btn btn-dark w-100 mb-3 py-2 fw-bold">
                {isLoading ? 'Authernitcating ...' : 'Login'}
            </button>


            <hr />

            {/* Switch To Sign Up Page */}
            <div className="text-center fw-300 mb-4 fa-sm">
                <span>Don't Have An Account?</span>
                <span
                    onClick={() => navigate('/signup')}
                    className="link-primary text-decoration-none fw-semibold ms-1 pointer">
                    Sign up
                </span>
            </div>

        </form>
    </AuthLayout>);

}

export default LoginPage;