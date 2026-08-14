import { useState,  } from "react";

function ContactForm ({onAddContact, onUpdateContact, contact}) {
    const [formData, setFormData] = useState(
      contact ||  {
            name: "",
            company: "",
            email: "",
            phone: ""
            }
    );

    const [error, setError] = useState("");




    function handleChange(event) {
        const {name , value} = event.target;
            
            setFormData({
                ...formData,
                [name]: value
            });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if(!formData.name) {
            setError("Name is required");
            return;
        }   
        if (!formData.email){
            setError("Email is required");
            return;
        }
            
        if(contact){
            onUpdateContact(formData)
        } else {
                onAddContact(formData);
        }
    
        setFormData({
            name: "",
            company: "",
            email: "",
            phone: ""
        });
    }


    return (
        <form onSubmit={handleSubmit}>
            {error && <p>{error}</p>}

            <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="Email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
            <button type="submit">Add Contact</button>
        </form>

    );

}

export default ContactForm;