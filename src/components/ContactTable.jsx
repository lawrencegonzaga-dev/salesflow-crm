import ContactRow from "./ContactRow";


function ContactTable ({contacts}) {
    return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                </tr>
                </thead>
                <tbody>
                    {contacts.map((contact)=> (
                        <ContactRow 
                         key={contact.id}
                         contact={contact}
                        />
                    ))}
                </tbody>
            </table>

    );

}

export default ContactTable;