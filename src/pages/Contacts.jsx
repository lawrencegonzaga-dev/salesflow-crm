import { useState } from "react";
import ContactTable from "../components/ContactTable";

function Contact() {
    const [contacts, setContacts] = useState([
        {
            id:1,
            name: "John Smith",
            company: "Acme Corp"
        },
        {
            id:2,
            name: "Sarah Jane",
            company: "Tech Advise"
        }
    ]);

    return(
        <div>
            <h1>Contacts</h1>
            <ContactTable 
                contacts={contacts}
            />

        </div>
    );

}

export default Contact;