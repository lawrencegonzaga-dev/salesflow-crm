/* ========================================================= */
/* FILE: src/pages/Contacts.jsx */
/* ========================================================= */

import { useEffect, useMemo, useState } from "react";
import ContactForm from "../components/ContactForm";
import ContactTable from "../components/ContactTable";
import { useCRM } from "../context/CRMContext";

const CONTACTS_PER_PAGE = 10;

function Contacts() {
    const { contacts, saveRecord, deleteRecord } = useCRM();

    const [editingContact, setEditingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name-asc");
    const [contactTab, setContactTab] = useState("active");
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    /*
     * =====================================================
     * CONTACT COUNTS
     * =====================================================
     */

    const activeCount = contacts.filter(
        (contact) => contact.status !== "Inactive"
    ).length;

    const inactiveCount = contacts.filter(
        (contact) => contact.status === "Inactive"
    ).length;

    /*
     * =====================================================
     * TAB DATA
     * =====================================================
     *
     * Active:
     * Prospect + Customer
     *
     * Inactive:
     * Inactive
     */

    const tabContacts = useMemo(() => {
        return contacts.filter((contact) => {
            if (contactTab === "inactive") {
                return contact.status === "Inactive";
            }

            return contact.status !== "Inactive";
        });
    }, [contacts, contactTab]);

    /*
     * =====================================================
     * SEARCH + SORT
     * =====================================================
     */

    const filteredContacts = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        const [field, direction] = sortBy.split("-");

        return tabContacts
            .filter((contact) =>
                [
                    contact.name,
                    contact.company,
                    contact.email,
                    contact.phone,
                ].some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(search)
                )
            )
            .toSorted((first, second) => {
                const firstValue = String(
                    first[field] ?? ""
                );

                const secondValue = String(
                    second[field] ?? ""
                );

                const comparison =
                    firstValue.localeCompare(secondValue);

                return direction === "asc"
                    ? comparison
                    : -comparison;
            });
    }, [tabContacts, searchTerm, sortBy]);

    /*
     * =====================================================
     * PAGINATION
     * =====================================================
     */

    const totalPages = Math.ceil(
        filteredContacts.length / CONTACTS_PER_PAGE
    );

    const paginatedContacts = useMemo(() => {
        const startIndex =
            (currentPage - 1) * CONTACTS_PER_PAGE;

        return filteredContacts.slice(
            startIndex,
            startIndex + CONTACTS_PER_PAGE
        );
    }, [filteredContacts, currentPage]);

    /*
     * =====================================================
     * RESET PAGE
     * =====================================================
     *
     * If the user searches, sorts, or changes tabs,
     * go back to page 1.
     */

    useEffect(() => {
        setCurrentPage(1);
    }, [contactTab, searchTerm, sortBy]);

    /*
     * =====================================================
     * CONTACT ACTIONS
     * =====================================================
     */

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

    /*
     * =====================================================
     * PAGE
     * =====================================================
     */

    return (
        <section className="page contacts-page">
            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <header className="page-header">
                <div>
                    <h1 className="page-title">
                        Contacts
                    </h1>

                    <p className="body-text">
                        Manage the people and companies in
                        your CRM.
                    </p>
                </div>

                <div className="page-actions">
                    <button
                        className="button button--primary"
                        type="button"
                        onClick={handleAddContact}
                    >
                        + Add Contact
                    </button>
                </div>
            </header>

            {/* ================================================= */}
            {/* CONTACT TABS */}
            {/* ================================================= */}

            <div className="tabs">
                <button
                    type="button"
                    className={`tab ${
                        contactTab === "active"
                            ? "tab--active"
                            : ""
                    }`}
                    onClick={() => setContactTab("active")}
                >
                    Active
                    <span className="tab-count">
                        {activeCount}
                    </span>
                </button>

                <button
                    type="button"
                    className={`tab ${
                        contactTab === "inactive"
                            ? "tab--active"
                            : ""
                    }`}
                    onClick={() =>
                        setContactTab("inactive")
                    }
                >
                    Inactive
                    <span className="tab-count">
                        {inactiveCount}
                    </span>
                </button>
            </div>

            {/* ================================================= */}
            {/* TOOLBAR */}
            {/* ================================================= */}

            <section className="toolbar">
                {/* SEARCH */}
                <div className="search-field">
                    <span
                        className="search-field__icon"
                        aria-hidden="true"
                    >
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />
                </div>

                {/* SORT */}
                <div className="filter-group">
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
            </section>

            {/* ================================================= */}
            {/* CONTACT TABLE */}
            {/* ================================================= */}

            <section className="card">
                <div className="card-header card-header--center">
                    <div>
                        <h2 className="card-title">
                            {contactTab === "active"
                                ? "Active Contacts"
                                : "Inactive Contacts"}
                        </h2>

                        <p className="card-subtitle">
                            {filteredContacts.length}{" "}
                            {filteredContacts.length === 1
                                ? "contact"
                                : "contacts"}
                        </p>
                    </div>
                </div>

                <ContactTable
                    contacts={paginatedContacts}
                    onDeleteContact={
                        handleDeleteContact
                    }
                    onEditContact={
                        handleEditContact
                    }
                />

                {/* ================================================= */}
                {/* PAGINATION */}
                {/* ================================================= */}

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page - 1
                                )
                            }
                        >
                            ← Previous
                        </button>

                        <div className="pagination-pages">
                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={
                                        currentPage === page
                                            ? "pagination-page pagination-page--active"
                                            : "pagination-page"
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            page
                                        )
                                    }
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page + 1
                                )
                            }
                        >
                            Next →
                        </button>
                    </div>
                )}
            </section>

            {/* ================================================= */}
            {/* CONTACT MODAL */}
            {/* ================================================= */}

            {showForm && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCancelEdit();
                        }
                    }}
                >
                    <section
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="contact-modal-title"
                    >
                        <div className="modal-header">
                            <div>
                                <h2
                                    id="contact-modal-title"
                                    className="card-title"
                                >
                                    {editingContact
                                        ? "Edit Contact"
                                        : "Add Contact"}
                                </h2>

                                <p className="body-text">
                                    Add or update contact
                                    information.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    handleCancelEdit
                                }
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <ContactForm
                            key={
                                editingContact?.id ??
                                "new"
                            }
                            editingContact={
                                editingContact
                            }
                            onAddContact={saveContact}
                            onUpdateContact={
                                saveContact
                            }
                            onCancelEdit={
                                handleCancelEdit
                            }
                        />
                    </section>
                </div>
            )}
        </section>
    );
}

export default Contacts;