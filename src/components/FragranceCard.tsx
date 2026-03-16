import Link from "next/link";
import Button from "./Button";

interface FragranceCardProps {
  id: string;
  name: string;
  tagline: string;
  price: number;
}

export default function FragranceCard({
  id,
  name,
  tagline,
  price,
}: FragranceCardProps) {
  return (
    <div className="py-6 border-b border-gray-200  hover:bg-gray-50  transition-colors duration-300 rounded-lg px-4">
      <div className="mb-4">
        <h3 className="text-lg font-serif font-normal mb-2 text-gray-900 ">{name}</h3>
        <p className="text-sm text-gray-600  mb-3">{tagline}</p>
        <p className="text-sm font-normal mb-4 text-gray-800 ">Rs {price}</p>
      </div>
      <Link href={`/product/${id}`}>
        <Button variant="primary">View</Button>
      </Link>
    </div>
  );
}
