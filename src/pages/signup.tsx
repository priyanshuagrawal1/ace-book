import { useState, useEffect } from 'react'

import './login.css'
import { User, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { Snackbar } from '@mui/material';
import Right from './right'
import { Link } from 'react-router-dom'
import Checkbox from '../components/checkbox';
import Input from '../components/input';
import { doc, getDoc, setDoc } from 'firebase/firestore';
interface FormValues {
    email: string;
    password: string;
    repeatPass: string;
    name: string;
}
interface FormErrors {
    email?: string;
    password?: string;
    repeatPass?: string;
    name?: string;
    terms?: string;
}
export const Signup = () => {

    const [formValues, setFormValues] = useState<FormValues>({
        email: '',
        password: '',
        repeatPass: '',
        name: '',
    });

    useEffect(() => {
        if (formValues.repeatPass.length && formValues.password !== formValues.repeatPass) {
            setFormErrors(formErrors => ({ ...formErrors, repeatPass: "Passwords do not match" }));
        }
        else {
            setFormErrors(formErrors => ({ ...formErrors, repeatPass: "" }));
        }
        if (formValues.name) {
            setFormErrors(formErrors => ({ ...formErrors, name: "" }));
        }
        if (formValues.email && formValues.email.includes("@") && formValues.email.includes(".")) {
            setFormErrors(formErrors => ({ ...formErrors, email: "" }));
        }
        if (formValues.password) {
            setFormErrors(formErrors => ({ ...formErrors, password: "" }));
        }

    }, [formValues])

    function handleChange(name: string, value: string) {
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const [open, setOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [terms, setTerms] = useState(false);
    const [_, setUser] = useState<User | null>(null);

    const inputFields = {
        name: {
            label: "Name", name: "name", value: formValues.name, placeholder: 'Your name', error: formErrors.name ?? ""
        },
        email: {
            label: "Email", name: "email", value: formValues.email, placeholder: 'Your email', error: formErrors.email ?? ""
        },
        password: {
            label: "Password", name: "password", value: formValues.password, placeholder: 'Your password', type: "password", error: formErrors.password ?? ""
        },
        repeatPass: {
            label: "Repeat Password", name: "repeatPass", value: formValues.repeatPass, placeholder: 'Repeat your password', type: "password", error: formErrors.repeatPass ?? ""
        }
    }
    async function handleSubmit(event: any) {
        event.preventDefault();
        if (!validateForm(formValues)) {
            return
        }
        try {
            await createUserWithEmailAndPassword(auth, formValues.email, formValues.password).then(async (user) => {
                if (user.user) {
                    console.log(user.user, "user.user")
                    await updateProfile(user.user, { displayName: formValues.name })
                    await setDoc(doc(db, "users", user.user.uid), {
                        displayName: formValues.name,
                        email: formValues.email
                    });
                    setTimeout(() => {
                        window.location.href = "/welcome"
                    }, 1000);
                }
            });
        } catch (error: any) {
            setOpen(true)
            setErrorMessages(error?.message?.slice(9))
        }
    }

    useEffect(() => {
        console.log("terms changed")
        if (terms) {
            setFormErrors(formErrors => ({ ...formErrors, terms: "" }));
        }
    }, [terms]);

    function validateForm(formValues: FormValues) {
        const formErrors: FormErrors = {};
        let valid = true;
        if (formValues.password.length < 8) {
            formErrors.password = "Password must be at least 8 characters";
            valid = false;
        }
        if (!formValues.email.includes('@')) {
            formErrors.email = "Email is not valid";
            valid = false;
        }
        if (!formValues.name) {
            formErrors.name = "Name is required";
            valid = false;
        }
        if (!terms) {
            formErrors.terms = "You must agree to the terms and conditions";
            valid = false;
        }
        if (formValues.password !== formValues.repeatPass) {
            formErrors.repeatPass = "Passwords do not match";
            valid = false;
        }
        if (!valid) {
            setFormErrors(formErrors);
            return false
        }
        return true
    }

    useEffect(() => {
        async function signup() {
            onAuthStateChanged(auth, async (currentUser) => {
                console.log(formValues,"form values")
                setUser(currentUser);
            });
        }
        signup()
    }, [formValues])
    function checkErrors(formErrors: FormErrors) {
        let errors = Object.values(formErrors)
        let hasError = errors.filter(error => error.length > 0)
        if (hasError.length > 3) {
            return true
        }
        return false;
    }
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} message={errorMessages} />

            <div className="left" >
                <div className="header">
                    <h3>
                        <span style={{ color: "#8a5c8d", }}> Jetic</span>  Platform
                    </h3>
                </div>
                <div className='container'>
                    <h2 className='title' >Create account</h2><br></br>
                    <span className='subtitle'>Get access to exclusive features by creating an account</span><br /><br />
                    <form onSubmit={handleSubmit}>
                        <div className={(checkErrors(formErrors) ? "errorFields" : "") + " InputFields"}>
                            {Object.values(inputFields).map((inputField) => {
                                return <Input {...inputField} handleChange={handleChange} key={inputField.name} />

                            })}
                        </div>
                        <hr></hr>
                        <div className='Loginfields' >
                            <Checkbox label="I've read and accept the" onChange={setTerms} />
                            <a href="http://localhost:8000/terms" target="_blank" rel="noreferrer" style={{ color: "#8a5c8d", textDecoration: "none", fontSize: "11px" }}>Terms and Conditions</a>
                            <p className={!formErrors.terms ? "" : "errorText " + "termsError "} style={{
                                justifyContent: "flext-start !important", display: "flex"
                            }} >{formErrors.terms}</p>
                            <button className='login__button' style={{ position: "relative", left: "240px", bottom: "-10px" }}  >Create my account</button>
                            <span className='login__signup' style={{ justifyContent: "center", display: "flex", position: "relative", bottom: "-40px" }}>
                                Already have an account?  &nbsp;
                                <Link to="/" style={{ color: "#8a5c8d", textDecoration: "none" }}>Sign in</Link>
                            </span>
                        </div>
                    </form >
                </div >
            </div >
            <Right />
        </>
    )
}
