import { useState } from "react";

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

    const [name, setName] = useState([""]);

    return(
        <div>
            <h1>Contacts</h1>

            <input
                value={name}
                 onChange={(event) =>{
                    setName(event.target.value);
                }}
            />

            <p>Type Name: {name}</p>

                {contacts.map((contacts) => (
                    <p key={contacts.id}> {contacts.name} </p>

                ))}
        </div>
    );

}

export default Contact;