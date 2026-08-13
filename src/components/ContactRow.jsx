function ContactRow ( {contact} ){
    return (
            <tr>
                <td>{contact.name}</td>
                <td>{contact.company}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
            </tr>
    );
}

export default ContactRow;