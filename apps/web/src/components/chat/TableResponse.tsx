export default function TableResponse({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto my-10">
      <table className="table-auto border-collapse border border-gray-500 text-sm text-gray-200">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="border border-gray-500 px-3 py-2 bg-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-500 px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
