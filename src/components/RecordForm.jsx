import { useState } from "react";

function RecordForm({ fields, record, onSave, onCancel, submitLabel }) {
    const [formData, setFormData] = useState(() => fields.reduce((values, field) => ({
        ...values,
        [field.name]: record?.[field.name] ?? field.defaultValue ?? ""
    }), {}));

    function handleSubmit(event) {
        event.preventDefault();
        onSave({ ...record, ...formData });
    }

    return (
        <form className="record-form" onSubmit={handleSubmit}>
            {fields.map((field) => (
                <label className="form-group" key={field.name} htmlFor={field.name}>
                    <span className="form-label">{field.label}</span>
                    {field.options ? (
                        <select
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
                        >
                            {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                    ) : (
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type ?? "text"}
                            value={formData[field.name]}
                            required={field.required}
                            min={field.min}
                            onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
                        />
                    )}
                </label>
            ))}
            <div className="form-actions">
                <button className="button button--primary" type="submit">{submitLabel}</button>
                {onCancel && <button className="button" type="button" onClick={onCancel}>Cancel</button>}
            </div>
        </form>
    );
}

export default RecordForm;
