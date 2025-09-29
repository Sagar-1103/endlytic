export default function ListResponse({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-gray-200 space-y-1 my-8">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
