import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Presentation, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileViewer } from "@/components/FileViewer";
import { Pagination } from "@/components/Pagination";
import SEO from "@/components/SEO";
import { smartDB } from "@/lib/smartDB";
import type { FileItem } from "@/lib/fileService";

const Slides = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper: infer file type from path
  const getExt = (path?: string): FileItem["type"] => {
    const ext = (path?.split(".").pop() || "").toLowerCase();
    if (["pdf","doc","docx","ppt","pptx","zip","xls","xlsx","jpg","png","jpeg"].includes(ext)) {
      return ext as FileItem["type"];
    }
    return "doc";
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await smartDB.select('slaydlar', '*');
      const rows = result.data || [];

      const mapped: FileItem[] = rows.map((row: any) => {
        const path: string = row.file_path || "";
        const name: string = row.title || (path ? path.split('/').pop() : "Noma'lum slayd");
        return {
          id: String(row.id),
          name,
          path,
          size: 0,
          type: getExt(path),
          category: "Slaydlar",
          lastModified: row.updated_at ? new Date(row.updated_at) : (row.created_at ? new Date(row.created_at) : undefined),
          description: row.description || undefined,
          tags: row.xavfsizlik_darajasi ? [row.xavfsizlik_darajasi] : undefined,
          dateCreated: row.created_at || undefined,
        };
      });

      setFiles(mapped);
      setLoading(false);
    };
    load();
  }, []);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const seoData = {
    "@context": "https://schema.org",
    "@type": "PresentationDigitalDocument",
    "name": "Slaydlar va Prezentatsiyalar",
    "description": "Mehnat muhofazasi bo'yicha o'quv prezentatsiyalari va slaydlar",
    "url": "https://safedocs.uz/slaydlar",
    "datePublished": new Date().toISOString(),
    "inLanguage": "uz",
    "publisher": {
      "@type": "Organization",
      "name": "SafeDocs"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SEO 
        title="Slaydlar va Prezentatsiyalar - SafeDocs | Xavfsizlik Ta'lim Prezentatsiyalari"
        description="Mehnat muhofazasi va xavfsizlik bo'yicha o'quv prezentatsiyalari, interaktiv slaydlar. Elektr xavfsizligi, yong'in xavfsizligi, temir yo'l harakati xavfsizligi bo'yicha taqdimotlar."
        keywords="prezentatsiyalar, slaydlar, xavfsizlik prezentatsiyalari, mehnat muhofazasi slaydlar, ta'lim prezentatsiyalari, interaktiv slaydlar"
        type="article"
        structuredData={seoData}
      />
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Slaydlar va prezentatsiyalar
          </h1>
          <p className="text-muted-foreground text-lg">
            Mehnat muhofazasi bo'yicha o'quv prezentatsiyalari
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Slaydlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredFiles.length} ta prezentatsiya topildi
          </Badge>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedFiles.map((file, index) => (
            <FileViewer key={index} file={file} />
          ))}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <Presentation className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hech qanday prezentatsiya topilmadi</h3>
            <p className="text-muted-foreground">
              Qidiruv shartlaringizni o'zgartiring yoki boshqa kategoriyani tanlang
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredFiles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={() => {}}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Slides;

