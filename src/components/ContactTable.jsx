/* ========================================================= */
/* FILE: src/components/ContactTable.jsx */
/* ========================================================= */

import ContactRow from "./ContactRow";

function ContactTable({
    contacts,
    onDeleteContact,
    onEditContact
}) {
    if (contacts.length === 0) {
        return (
            <div className="table-empty">
                <div className="empty-icon">📭</div>
                <div className="empty-title">No contacts found</div>
                <div className="empty-description">
                    Try adjusting your search or filters
                </div>
            </div>
        );
    }

    return (
        <div className="table-wrap">
            <table className="table table--striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <ContactRow
                            key={contact.id}
                            contact={contact}
                            onDeleteContact={onDeleteContact}
                            onEditContact={onEditContact}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ContactTable;