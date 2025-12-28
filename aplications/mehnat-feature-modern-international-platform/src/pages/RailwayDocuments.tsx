import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Train, Search, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileViewer } from "@/components/FileViewer";
import { Pagination } from "@/components/Pagination";
import { smartDB } from "@/lib/smartDB";
import type { FileItem } from "@/lib/fileService";

const RailwayDocuments = () => {
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
      const res = await smartDB.select('temir_yol_hujjatlari', '*');
      const rows = res.data || [];
      const mapped: FileItem[] = rows.map((row: any) => {
        const path: string = row.file_path || "";
        const name: string = row.title || (path ? path.split('/').pop() : "Hujjat");
        return {
          id: String(row.id),
          name,
          path,
          size: 0,
          type: getExt(path),
          category: "Temir yo'l hujjatlari",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Temir yo'l hujjatlari
          </h1>
          <p className="text-muted-foreground text-lg">
            Temir yo'l transporti bo'yicha texnik hujjatlar va yo'riqnomalar
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Hujjatlarni qidirish..."
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
            <Train className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
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

export default RailwayDocuments;
