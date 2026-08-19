/* ========================================================= */
/* FILE: src/components/DealTable.jsx */
/* ========================================================= */

function DealTable({
  deals,
  onEditDeal,
  onDeleteDeal,
}) {
  function formatValue(value) {
    return Number(value || 0).toLocaleString(
      undefined,
      {
        style: "currency",
        currency: "USD",
      }
    );
  }

  return (
    <div className="deal-table-wrap">
      <table className="table table--striped">
        <thead>
          <tr>
            <th>Deal</th>
            <th>Company</th>
            <th>Email</th>
            <th>Value</th>
            <th>Stage</th>
            <th>Close Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {deals.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="deal-table__empty"
              >
                No deals found.
              </td>
            </tr>
          ) : (
            deals.map((deal) => (
              <tr key={deal.id}>
                <td>
                  <strong>{deal.name}</strong>
                </td>

                <td>
                  {deal.company || "—"}
                </td>

                <td>
                  {deal.email || "—"}
                </td>

                <td>
                  {formatValue(deal.value)}
                </td>

                <td>
                  <span className="deal-stage">
                    {deal.stage}
                  </span>
                </td>

                <td>
                  {deal.closeDate || "—"}
                </td>

                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="button button--sm button--ghost"
                      onClick={() =>
                        onEditDeal(deal)
                      }
                    >
                      Edit
                    </button>

                    {/* Delete button intentionally disabled */}

                    {/*
                    <button
                      type="button"
                      className="button button--sm button--danger"
                      onClick={() =>
                        onDeleteDeal(deal.id)
                      }
                    >
                      Delete
                    </button>
                    */}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DealTable;