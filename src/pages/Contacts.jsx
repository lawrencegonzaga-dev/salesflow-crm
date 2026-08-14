import { useState } from "react";
import ContactTable from "../components/ContactTable";
import ContactForm from "../components/ContactForm";

function Contact() {
    const [contacts, setContacts] = useState([
        {
            id:1,
            name: "John Smith",
            company: "Acme Corp",
            email: "john@example.com",
            phone: "09171234567"
        },
        {
            id:2,
            name: "Sarah Jane",
            company: "Tech Advise",
            email: "sarah@example.com",
            phone: ""
        }
    ]);
    const [editingContact, setEditingContact] = useState(null);

    function addContact(newContacts) {
            setContacts((currentContacts) => [...currentContacts, 
            {
                ...newContacts,
                id: Date.now()

            }
        ]);
        }

    function deleteContact(id) {
        setContacts((currentContacts) => 
             currentContacts.filter((contact) => contact.id !== id)
        );
    }

    function updateContact(updatedContact) {
        setContacts((currentContacts) =>
             currentContacts.map((contact) =>
             contact.id === updatedContact.id
                    ? updatedContact 
                    : contact
         ) );
         setEditingContact(null);
    }

    function editContact(id) {  
        const editContact = contacts.find((contact) => contact.id === id
    );

        setEditingContact(editContact);
    }

    return(
        <div>
            <h1>Contacts</h1>
            <ContactForm key={editingContact?.id ?? "new"} onAddContact={addContact}  onUpdateContact={updateContact} contact={editingContact}/>
            <ContactTable contacts={contacts} onDeleteContact={deleteContact} onEditContact={editContact} />
        </div>
    );
}

export default Contact;