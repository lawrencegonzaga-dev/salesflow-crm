import ContactRow from "./ContactRow";

function ContactTable({
    contacts,
    onDeleteContact,
    onEditContact
}) {
    return (
        <div className="table-wrap">
        <table className="table">
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
