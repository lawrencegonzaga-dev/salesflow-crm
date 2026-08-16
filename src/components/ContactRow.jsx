function ContactRow({ contact, onDeleteContact, onEditContact }) {
    return (
        <tr>
            <td>{contact.name}</td>
            <td>{contact.company}</td>
            <td>{contact.email}</td>
            <td>{contact.phone}</td>
            <td>{contact.status}</td>

            <td>
                <button
                    type="button"
                    onClick={() => onEditContact(contact)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDeleteContact(contact.id)}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default ContactRow;
