import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";

const SignupPage = () => {

    const navigate = useNavigate();
    const { createUser, googleSignIn } = useAuth();

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
                await createUser(formValues.email, formValues.password);
            }
        } catch (err) {
            console.log(err)
            setFormError({ root: err.message })
        }
        setLoading(false);
    }

    // Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error.message);
    }
  }

    const showTerms = () => {
       
    }

    return (<AuthLayout layout='end'>
        <form
            onSubmit={handleSubmit}
            className="p-4 p-md-5 border-0 rounded-4 position-relative"
            style={{ width: "100%", maxWidth: "420px", zIndex: 5 }}>

            <h2 className="fw-bold mb-1 text-center fs-1 nowrap">Create An Account</h2>
            <p className="text-center mb-4">
                Sign up to start creating professional stuff
            </p>

            <button
                type="button" onClick={handleGoogleSignUp}
                className="btn btn-dark w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" width="20" className="me-2" alt="Google" />
                Sign Up with Google
            </button>

            <div className="text-center py-4">
                or sign up with email
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

                    <span className="input-group-text pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ?
                            <i className="bi bi-eye-fill "></i> :
                            <i className="bi bi-eye"></i>}
                    </span>
                </div>

                {formError?.password && <div className="form-text text-danger fs-sm text-end">{formError.password}</div>}
                {formError?.root && <div className="form-text text-danger fs-sm text-end">{formError.root}</div>}
            </div>

            <div className="form-check mb-3 small">
                <input className="form-check-input" type="checkbox" value="" id="termsCheck" />
                <label className="form-check-label">
                    I agree to the <a href="#terms-and-conditions" onClick={showTerms}>Terms & Conditions</a>
                </label>
            </div>

            <button
                type="submit"
                className="btn btn-dark w-100 mb-3">
                {isLoading ? 'Authernitcating ...' : 'Sign Up'}
            </button>
            <hr />

            <div className="text-center fw-300 mb-4 fa-sm">
                <span>Already Have An Account?</span>
                <span
                    onClick={() => navigate('/login')}
                    className="link-primary text-decoration-none fw-semibold ms-1 pointer">
                    Login
                </span>
            </div>

        </form>
    </AuthLayout>);

}

export default SignupPage;