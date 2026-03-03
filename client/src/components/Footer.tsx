import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#262969] text-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-outfit font-bold text-lg mb-2">TEKA</h3>
            <p className="font-inter text-sm text-gray-300">
              Marketplace de livros usados. Encontre, busque e compre com segurança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-outfit font-semibold mb-4">Links</h4>
            <ul className="space-y-2 font-inter text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-outfit font-semibold mb-4">Informações</h4>
            <p className="font-inter text-sm text-gray-300 mb-2">
              MVP em validação
            </p>
            <p className="font-inter text-xs text-gray-400">
              Versão 1.0.0
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="font-inter text-sm text-gray-400 text-center">
            © {currentYear} TEKA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
