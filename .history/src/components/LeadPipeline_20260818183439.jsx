const stages = ["New", "Contacted", "Qualified"];

function LeadPipeline({ leads, onEditLead }) {
  return (
    <div className="lead-pipeline">
      {stages.map((stage) => {
        const stageLeads = leads.filter((lead) => lead.stage === stage);

        return (
          <section className="lead-pipeline__stage" key={stage}>
            <header>
              <h2>{stage}</h2>
              <span>{stageLeads.length}</span>
            </header>

            <div className="lead-pipeline__items">
              {stageLeads.map((lead) => (
                <button
                  type="button"
                  className="lead-pipeline__card"
                  key={lead.id}
                  onClick={() => onEditLead(lead)}
                  title={`Edit ${lead.name}`}
                >
                  <h3>{lead.name}</h3>
                  <p>{lead.company}</p>
                  <p>
                    {Number(lead.value || 0).toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default LeadPipeline;