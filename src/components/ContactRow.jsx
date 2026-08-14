function ContactRow ( {contact, onDeleteContact, onEditContact} ){
    return (
            <tr>
                <td>{contact.name}</td>
                <td>{contact.company}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>

                <td>
                    <button onClick={() => onDeleteContact(contact.id)}>Delete</button>
                    <button onClick={() => onEditContact(contact.id)}>Edit</button>
                </td>
            </tr>

    );
}

export default ContactRow;