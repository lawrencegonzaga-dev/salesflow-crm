import { useState } from "react";

function ContactForm({
    editingContact,
    onAddContact,
    onUpdateContact,
    onCancelEdit
}) {
    const [formData, setFormData] = useState({
        name: editingContact?.name ?? "",
        company: editingContact?.company ?? "",
        email: editingContact?.email ?? "",
        phone: editingContact?.phone ?? "",
        status: editingContact?.status ?? "Prospect"
    });

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (editingContact) {
            onUpdateContact({
                ...editingContact,
                ...formData
            });
        } else {
            onAddContact(formData);
        }

        setFormData({
            name: "",
            company: "",
            email: "",
            phone: "",
            status: "Prospect"
        });
    }

    function handleCancel() {
        setFormData({
            name: "",
            company: "",
            email: "",
            phone: "",
            status: "Prospect"
        });

        onCancelEdit();
    }

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label htmlFor="name">
                    Name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="company">
                    Company
                </label>

                <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="email">
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="phone">
                    Phone
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label htmlFor="status">
                    Status
                </label>

                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="Prospect">
                        Prospect
                    </option>

                    <option value="Customer">
                        Customer
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>
                </select>
            </div>

            <button type="submit">
                {editingContact
                    ? "Update Contact"
                    : "Add Contact"}
            </button>

            {editingContact && (
                <button
                    type="button"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            )}

        </form>
    );
}

export default ContactForm;