/* ========================================================= */
/* FILE: src/components/RecordForm.jsx */
/* ========================================================= */

import { useState } from "react";

function RecordForm({ fields, record, onSave, onCancel, submitLabel }) {
    const [formData, setFormData] = useState(() => {
        return fields.reduce((values, field) => ({
            ...values,
            [field.name]: record?.[field.name] ?? field.defaultValue ?? ""
        }), {});
    });

    const [errors, setErrors] = useState({});

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        if (errors[name]) {
            setErrors((current) => ({ ...current, [name]: "" }));
        }
    }

    function validate() {
        const newErrors = {};
        fields.forEach((field) => {
            if (field.required && !formData[field.name]?.toString().trim()) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });
        return newErrors;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(formData);
    }

    return (
        <form className="record-form" onSubmit={handleSubmit}>
            {fields.map((field) => (
                <div className="form-group" key={field.name}>
                    <label htmlFor={field.name} className={`form-label ${field.required ? "form-label--required" : ""}`}>
                        {field.label}
                    </label>
                    {field.options ? (
                        <select
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className={errors[field.name] ? "error" : ""}
                        >
                            {field.options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type ?? "text"}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                            min={field.min}
                            className={errors[field.name] ? "error" : ""}
                        />
                    )}
                    {errors[field.name] && <span className="form-error">{errors[field.name]}</span>}
                </div>
            ))}
            <div className="form-actions form-actions--right">
                {onCancel && (
                    <button type="button" className="button button--ghost" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="button button--primary">
                    {submitLabel || "Save"}
                </button>
            </div>
        </form>
    );
}

export default RecordForm;