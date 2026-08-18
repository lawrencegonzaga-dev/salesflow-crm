/* ========================================================= */
/* FILE: src/components/ContactForm.jsx */
/* ========================================================= */

import { useState, useEffect, useRef } from "react";

function ContactForm({
    editingContact,
    onAddContact,
    onUpdateContact,
    onCancelEdit
}) {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "Prospect"
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});
    
    // Track if this is the initial mount
    const isInitialMount = useRef(true);

    // Reset form when editingContact changes - but use a key instead
    useEffect(() => {
        // Skip on initial mount to prevent double render
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Only update when editingContact changes from null to a value
        if (editingContact) {
            setFormData({
                name: editingContact.name ?? "",
                company: editingContact.company ?? "",
                email: editingContact.email ?? "",
                phone: editingContact.phone ?? "",
                status: editingContact.status ?? "Prospect"
            });
            setErrors({});
            setTouched({});
        }
    }, [editingContact]); // Only re-run when editingContact changes

    // Alternative: Use a key on the component instead
    // This is actually the better approach - we can remove the useEffect entirely
    // and let React handle the reset via the key prop in the parent

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        
        if (errors[name]) {
            setErrors((current) => ({ ...current, [name]: "" }));
        }
    }

    function handleBlur(event) {
        const { name } = event.target;
        setTouched((current) => ({ ...current, [name]: true }));
        
        const fieldErrors = validateField(name, formData[name]);
        if (fieldErrors) {
            setErrors((current) => ({ ...current, [name]: fieldErrors }));
        }
    }

    function validateField(name, value) {
        switch (name) {
            case "name":
                if (!value?.trim()) return "Name is required";
                if (value?.trim().length < 2) return "Name must be at least 2 characters";
                return null;
            case "email":
                if (!value?.trim()) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Please enter a valid email address";
                }
                return null;
            case "phone":
                if (value && !/^[0-9+\-\s()]+$/.test(value)) {
                    return "Please enter a valid phone number";
                }
                return null;
            default:
                return null;
        }
    }

    function validateForm() {
        const newErrors = {};
        const fields = ["name", "email"];
        
        fields.forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        return newErrors;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const allTouched = {};
        Object.keys(formData).forEach((key) => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstErrorField = document.querySelector('[class*="error"]');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }

        setIsSubmitting(true);

        try {
            if (editingContact) {
                await onUpdateContact({
                    ...editingContact,
                    ...formData
                });
            } else {
                await onAddContact({
                    ...formData,
                    id: Date.now()
                });
            }

            if (!editingContact) {
                resetForm();
            }
        } catch (error) {
            console.error("Error saving contact:", error);
            setErrors({ submit: "Failed to save contact. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    function resetForm() {
        setFormData({
            name: "",
            company: "",
            email: "",
            phone: "",
            status: "Prospect"
        });
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }

    function handleCancel() {
        resetForm();
        if (onCancelEdit) {
            onCancelEdit();
        }
    }

    function showError(fieldName) {
        return touched[fieldName] && errors[fieldName];
    }

    return (
        <form onSubmit={handleSubmit} className="record-form" noValidate>
            <div className="form-group">
                <label htmlFor="name" className="form-label form-label--required">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter full name"
                    className={showError("name") ? "error" : ""}
                    disabled={isSubmitting}
                    required
                    aria-describedby={showError("name") ? "name-error" : undefined}
                />
                {showError("name") && (
                    <span id="name-error" className="form-error" role="alert">
                        {errors.name}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="company" className="form-label">
                    Company
                </label>
                <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email" className="form-label form-label--required">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter email address"
                    className={showError("email") ? "error" : ""}
                    disabled={isSubmitting}
                    required
                    aria-describedby={showError("email") ? "email-error" : undefined}
                />
                {showError("email") && (
                    <span id="email-error" className="form-error" role="alert">
                        {errors.email}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="phone" className="form-label">
                    Phone
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    className={showError("phone") ? "error" : ""}
                    disabled={isSubmitting}
                    aria-describedby={showError("phone") ? "phone-error" : undefined}
                />
                {showError("phone") && (
                    <span id="phone-error" className="form-error" role="alert">
                        {errors.phone}
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="status" className="form-label">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isSubmitting}
                >
                    <option value="Prospect">Prospect</option>
                    <option value="Customer">Customer</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {errors.submit && (
                <div className="form-error" role="alert" style={{ gridColumn: "1 / -1" }}>
                    {errors.submit}
                </div>
            )}

            <div className="form-actions form-actions--right" style={{ gridColumn: "1 / -1" }}>
                {editingContact && (
                    <button 
                        type="button" 
                        className="button button--ghost" 
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    className="button button--primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner" aria-hidden="true"></span>
                            {editingContact ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        editingContact ? "Update Contact" : "Add Contact"
                    )}
                </button>
            </div>
        </form>
    );
}

export default ContactForm;