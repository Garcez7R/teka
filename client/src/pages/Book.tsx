import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import booksData from "@/data/books.json";
import { BookOpen, MapPin, Calendar, FileText, MessageCircle, ArrowLeft } from "lucide-react";

export default function Book() {
  const { id } = useParams<{ id: string }>();
  const book = booksData.find(b => b.id === parseInt(id || "0"));

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="container flex-1 py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="font-outfit font-bold text-2xl text-[#262969] mb-4">Livro não encontrado</p>
            <Link href="/" className="text-[#da4653] hover:underline font-inter font-medium">
              Voltar ao catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${book.whatsapp}?text=Olá! Tenho interesse no livro "${book.title}". Ainda está disponível?`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="container flex-1 py-12">
        {/* Back Button */}
        <Link href="/">
          <button className="flex items-center gap-2 text-gray-600 hover:text-[#262969] transition-colors font-inter text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Book Image Placeholder */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-12 flex flex-col items-center justify-center border border-gray-200 sticky top-24">
              <BookOpen className="w-24 h-24 text-[#262969] mb-4" />
              <p className="text-gray-600 text-sm font-inter text-center">Capa do livro</p>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            {/* Title and Category */}
            <h1 className="font-outfit font-bold text-3xl text-[#262969] mb-2">
              {book.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs font-inter bg-gray-100 px-3 py-1 rounded text-gray-700">
                {book.category}
              </span>
              <span className="text-xs font-inter bg-blue-50 px-3 py-1 rounded text-[#262969]">
                {book.condition}
              </span>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="font-inter text-sm text-gray-600 mb-2">Preço</p>
              <p className="font-outfit font-bold text-4xl text-[#da4653]">
                R$ {book.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="font-outfit font-semibold text-lg text-[#262969] mb-3">Descrição</h2>
              <p className="font-inter text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">ISBN</p>
                <p className="font-inter font-semibold text-gray-900">{book.isbn}</p>
              </div>
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">Páginas</p>
                <p className="font-inter font-semibold text-gray-900">{book.pages}</p>
              </div>
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">Ano de Publicação</p>
                <p className="font-inter font-semibold text-gray-900">{book.year}</p>
              </div>
              <div>
                <p className="font-inter text-sm text-gray-600 mb-1">Condição</p>
                <p className="font-inter font-semibold text-gray-900">{book.condition}</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h3 className="font-outfit font-semibold text-lg text-[#262969] mb-4">Informações do Sebo</h3>
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-[#da4653]" />
                <div>
                  <p className="font-inter text-sm text-gray-600">Sebo</p>
                  <p className="font-inter font-semibold text-gray-900">{book.sebo}</p>
                </div>
              </div>
              <p className="font-inter text-sm text-gray-600 mb-3">
                Entre em contato diretamente via WhatsApp para confirmar disponibilidade e negociar.
              </p>
            </div>

            {/* CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#da4653] hover:bg-[#c23a45] text-white font-outfit font-bold py-4 px-6 rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contatar via WhatsApp
            </a>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-inter text-sm text-blue-900">
                <span className="font-semibold">Dica:</span> Confirme a disponibilidade antes de se deslocar até o sebo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
