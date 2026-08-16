import { useMemo, useState } from "react";

import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";
import { useCRM } from "../context/CRMContext";

function Contacts() {
    const {
        contacts,
        saveRecord,
        deleteRecord
    } = useCRM();

    const [editingContact, setEditingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("name-asc");
    const [showForm, setShowForm] = useState(false);

    const visibleContacts = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        const [field, direction] = sortBy.split("-");

        return contacts
            .filter((contact) => {
                return (
                    statusFilter === "All" ||
                    contact.status === statusFilter
                );
            })
            .filter((contact) => {
                return [
                    contact.name,
                    contact.company,
                    contact.email,
                    contact.phone
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                );
            })
            .toSorted((first, second) => {
                const firstValue = String(first[field] ?? "");
                const secondValue = String(second[field] ?? "");

                const comparison =
                    firstValue.localeCompare(secondValue);

                return direction === "asc"
                    ? comparison
                    : -comparison;
            });
    }, [
        contacts,
        searchTerm,
        statusFilter,
        sortBy
    ]);

    function saveContact(contact) {
        saveRecord("contacts", contact);
        setEditingContact(null);
        setShowForm(false);
    }

    function handleDeleteContact(id) {
        deleteRecord("contacts", id);
    }

    function handleEditContact(contact) {
        setEditingContact(contact);
        setShowForm(true);
    }

    function handleAddContact() {
        setEditingContact(null);
        setShowForm(true);
    }

    function handleCancelEdit() {
        setEditingContact(null);
        setShowForm(false);
    }

    return (
        <section className="page contacts-content">

            {/* Page Header */}
            <header className="page-header">

                <div>
                    <h1 className="page-title">
                        Contacts
                    </h1>

                    <p className="body-text">
                        Manage the people and companies in your CRM.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddContact}
                >
                    + Add Contact
                </button>

            </header>


            {/* Contact Form */}
            {showForm && (
                <section className="card">

                    <div className="card-header">

                        <div>
                            <h2 className="card-title">
                                {editingContact
                                    ? "Edit Contact"
                                    : "Add Contact"}
                            </h2>

                            <p className="body-text">
                                {editingContact
                                    ? "Update the contact information."
                                    : "Add a new person to your CRM."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                        >
                            Close
                        </button>

                    </div>

                    <ContactForm
                        key={editingContact?.id ?? "new"}
                        editingContact={editingContact}
                        onAddContact={saveContact}
                        onUpdateContact={saveContact}
                        onCancelEdit={handleCancelEdit}
                    />

                </section>
            )}


            {/* Toolbar */}
            <section className="card">

                <div className="toolbar">

                    <div className="search-field">
                        <label htmlFor="contact-search">
                            Search
                        </label>

                        <input
                            id="contact-search"
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />
                    </div>


                    <div>
                        <label htmlFor="contact-status">
                            Status
                        </label>

                        <select
                            id="contact-status"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="All">
                                All
                            </option>

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


                    <div>
                        <label htmlFor="contact-sort">
                            Sort
                        </label>

                        <select
                            id="contact-sort"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >
                            <option value="name-asc">
                                Name: A–Z
                            </option>

                            <option value="name-desc">
                                Name: Z–A
                            </option>

                            <option value="company-asc">
                                Company: A–Z
                            </option>

                            <option value="company-desc">
                                Company: Z–A
                            </option>
                        </select>
                    </div>

                </div>

            </section>


            {/* Contact Table */}
            <section className="card">

                <div className="card-header">

                    <div>
                        <h2 className="card-title">
                            Contact List
                        </h2>

                        <p className="body-text">
                            {visibleContacts.length}{" "}
                            {visibleContacts.length === 1
                                ? "contact"
                                : "contacts"}
                        </p>
                    </div>

                </div>

                <ContactTable
                    contacts={visibleContacts}
                    onDeleteContact={handleDeleteContact}
                    onEditContact={handleEditContact}
                />

            </section>

        </section>
    );
}

export default Contacts;