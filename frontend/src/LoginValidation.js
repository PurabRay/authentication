function Validation(values) {
    let error = {};
    const email_pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    // Validation for name
    if (values.name === "") {
        error.name = "Name should not be empty";
    }

    // Validation for email
    if (values.email === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email format is incorrect";
    }

    // Validation for password
    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password should be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one number.";
    }

    return error;
}

export default Validation;
