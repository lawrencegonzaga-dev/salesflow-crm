/* ========================================================= */
/* FILE: src/components/ContactRow.jsx */
/* ========================================================= */

function ContactRow({ contact, onDeleteContact, onEditContact }) {
    function getStatusBadge(status) {
        const classes = {
            Prospect: "badge badge--warning",
            Customer: "badge badge--success",
            Inactive: "badge badge--neutral"
        };
        return classes[status] || "badge badge--neutral";
    }

    return (
        <tr>
            <td>
                <strong>{contact.name}</strong>
            </td>
            <td>{contact.company || "—"}</td>
            <td>
                <a href={`mailto:${contact.email}`} className="text-primary">
                    {contact.email}
                </a>
            </td>
            <td>{contact.phone || "—"}</td>
            <td>
                <span className={getStatusBadge(contact.status)}>
                    {contact.status}
                </span>
            </td>
            <td>
                <div className="row-actions">
                    <button
                        type="button"
                        className="button button--sm button--ghost"
                        onClick={() => onEditContact(contact)}
                    >
                        Edit
                    </button>
                    {/* <button
                        type="button"
                        className="button button--sm button--danger"
                        onClick={() => {
                            if (window.confirm(`Delete "${contact.name}"?`)) {
                                onDeleteContact(contact.id);
                            }
                        }}
                    >
                        Delete
                    </button> */}
                </div>
            </td>
        </tr>
    );
}

export default ContactRow;