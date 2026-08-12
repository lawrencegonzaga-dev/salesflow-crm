

function contactCard ({contact} ) {
    return(
        <article className="contact-card">
            <h3>{contact.name}</h3>
            <p>{contact.company}</p>
        </article>
    );
}

export default contactCard;