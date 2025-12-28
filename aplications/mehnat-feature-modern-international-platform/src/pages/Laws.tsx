import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileViewer } from "@/components/FileViewer";
import { Pagination } from "@/components/Pagination";
import SEO from "@/components/SEO";
import { smartDB } from "@/lib/smartDB";
import type { FileItem } from "@/lib/fileService";

const Laws = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getExt = (path?: string): FileItem["type"] => {
    const ext = (path?.split(".").pop() || "").toLowerCase();
    if (["pdf","doc","docx","ppt","pptx","zip","xls","xlsx","jpg","png","jpeg"].includes(ext)) return ext as FileItem["type"];
    return "pdf";
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await smartDB.select('normativ_huquqiy_hujjatlar', '*');
      const rows = res.data || [];
      const mapped: FileItem[] = rows.map((row: any) => {
        const path: string = row.file_path || "";
        const name: string = row.title || (path ? path.split('/').pop() : "Qonun hujjati");
        return {
          id: String(row.id),
          name,
          path,
          size: 0,
          type: getExt(path),
          category: "Qonunlar",
          lastModified: row.updated_at ? new Date(row.updated_at) : (row.created_at ? new Date(row.created_at) : undefined),
          description: row.content || undefined,
          tags: row.kategoriya ? [row.kategoriya] : undefined,
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
    "@type": "LegislativeDocument",
    "name": "Qonunlar va Me'yoriy Hujjatlar",
    "description": "Mehnat muhofazasi va temir yo'l transporti sohasidagi qonunlar to'plami",
    "url": "https://safedocs.uz/qonunlar",
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
        title="Qonunlar va Me'yoriy Hujjatlar - SafeDocs | Mehnat Muhofazasi Qonunlari"
        description="Mehnat muhofazasi va temir yo'l transporti sohasidagi qonunlar, me'yoriy hujjatlar va normativ talablar. O'zbekiston Respublikasining xavfsizlik sohasidagi qonunchilik bazasi."
        keywords="mehnat muhofazasi qonunlari, temir yo'l qonunlari, xavfsizlik qonunlari, normativ hujjatlar, me'yoriy hujjatlar, O'zbekiston qonunlari"
        type="article"
        structuredData={seoData}
      />
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Qonunlar va me'yoriy hujjatlar
          </h1>
          <p className="text-muted-foreground text-lg">
            Mehnat muhofazasi va temir yo'l transporti sohasidagi qonunlar
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Qonunlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredFiles.length} ta hujjat topildi
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
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Hech qanday hujjat topilmadi</h3>
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

export default Laws;
