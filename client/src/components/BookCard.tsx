import { Link } from "wouter";
import { BookOpen, MapPin } from "lucide-react";

interface BookCardProps {
  id: number;
  title: string;
  category: string;
  price: number;
  sebo: string;
  condition: string;
}

export default function BookCard({ id, title, category, price, sebo, condition }: BookCardProps) {
  return (
    <Link href={`/book/${id}`}>
      <div className="group cursor-pointer">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 h-64 flex flex-col items-center justify-center border border-gray-200 group-hover:border-[#da4653] group-hover:shadow-lg transition-all duration-300">
          <BookOpen className="w-16 h-16 text-[#262969] mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-gray-600 text-sm font-inter">Visualizar detalhes</p>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-outfit font-bold text-[#262969] line-clamp-2 group-hover:text-[#da4653] transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xs font-inter bg-gray-100 px-2 py-1 rounded">{category}</span>
            <span className="text-xs font-inter px-2 py-1 rounded bg-blue-50 text-[#262969]">{condition}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-700 text-sm font-inter">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{sebo}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="font-outfit font-bold text-lg text-[#da4653]">
              R$ {price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
