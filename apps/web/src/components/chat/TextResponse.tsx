export default function TextResponse({ value }: { value: string }) {
  return <p className="text-gray-200 text-sm sm:text-base leading-relaxed mt-4">{value}</p>;
}
