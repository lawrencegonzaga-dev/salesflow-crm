import ContactRow from "./ContactRow";


function ContactTable ({contacts, onDeleteContact, onEditContact}) {
    return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                </tr>
                </thead> 
                <tbody>
                    {contacts.map((contact)=> (
                        <ContactRow 
                         key={contact.id}
                         contact={contact}
                         onDeleteContact={onDeleteContact}
                         onEditContact={onEditContact}
                        />
                    ))}
                </tbody>
            </table>

    );

}

export default ContactTable;