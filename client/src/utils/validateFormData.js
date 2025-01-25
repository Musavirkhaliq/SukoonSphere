export const validateFormData = (formData) => {
    let errors = {};

    if (!formData.name || formData.name.trim() === "") {
        errors.name = "Name is required.";
    }

    if (!formData.email || formData.email.trim() === "") {
        errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Invalid email format.";
    }

    if (!formData.password || formData.password.trim() === "") {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    return errors;
};
