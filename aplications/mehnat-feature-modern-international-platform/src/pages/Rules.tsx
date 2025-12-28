import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { formatFileSize, type FileItem } from "@/lib/fileService";
import { smartDB } from "@/lib/smartDB";

const Rules = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper to infer file type
  const getExt = (path?: string): FileItem["type"] => {
    const ext = (path?.split(".").pop() || "").toLowerCase();
    if (["pdf","doc","docx","ppt","pptx","zip","xls","xlsx","jpg","png","jpeg"].includes(ext)) {
      return ext as FileItem["type"];
    }
    return "pdf";
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [qoidalarRes, qarorlarRes] = await Promise.all([
        smartDB.select('qoidalar', '*'),
        smartDB.select('qarorlar', '*'),
      ]);

      const qoidalar = (qoidalarRes.data || []).map((row: any): FileItem => {
        const path: string = row.file_path || "";
        const name: string = row.title || (path ? path.split('/').pop() : "Qoidalar hujjati");
        return {
          id: String(row.id),
          name,
          path,
          size: 0,
          type: getExt(path),
          category: "Qoidalar",
          lastModified: row.updated_at ? new Date(row.updated_at) : (row.created_at ? new Date(row.created_at) : undefined),
          description: row.content || undefined,
          tags: row.xavfsizlik_darajasi ? [row.xavfsizlik_darajasi] : undefined,
          dateCreated: row.created_at || undefined,
        };
      });

      const qarorlar = (qarorlarRes.data || []).map((row: any): FileItem => {
        const path: string = row.file_path || "";
        const name: string = row.titleblob || (path ? path.split('/').pop() : "Qaror hujjati");
        return {
          id: `qaror-${row.id}`,
          name,
          path,
          size: 0,
          type: getExt(path),
          category: "Qarorlar",
          lastModified: row.updated_at ? new Date(row.updated_at) : (row.created_at ? new Date(row.created_at) : undefined),
          description: row.content || undefined,
          tags: row.xavfsizlik_darajasi ? [row.xavfsizlik_darajasi] : undefined,
          dateCreated: row.created_at || undefined,
        };
      });

      const merged = [...qoidalar, ...qarorlar];
      setFiles(merged);
      setFilteredFiles(merged);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const filtered = files.filter(file =>
        file.name.toLowerCase().includes(s) ||
        file.description?.toLowerCase().includes(s) ||
        file.tags?.some(t => t.toLowerCase().includes(s))
      );
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(files);
    }
  }, [searchTerm, files]);

  const seoData = {
    "@context": "https://schema.org",
    "@type": "LegislativeDocument",
    "name": "Xavfsizlik Qoidalari va Qarorlar",
    "description": "Temir yo'l sohasidagi xavfsizlik qoidalari va rasmiy qarorlar to'plami",
    "url": "https://safedocs.uz/qoidalar",
    "datePublished": new Date().toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "SafeDocs"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEO 
        title="Qoidalar va Qarorlar - SafeDocs | Temir Yo'l Xavfsizlik Qoidalari"
        description="Temir yo'l sohasidagi xavfsizlik qoidalari, rasmiy qarorlar va normativ hujjatlar. Mehnat muhofazasi, elektr xavfsizligi, yong'in xavfsizligi bo'yicha to'liq qoidalar majmuasi."
        keywords="xavfsizlik qoidalari, temir yo'l qoidalari, mehnat muhofazasi qoidalari, elektr xavfsizligi qoidalari, yong'in xavfsizligi, sanoat xavfsizligi, qarorlar"
        type="article"
        structuredData={seoData}
      />
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Qoidalar va Qarorlar</h1>
          <p className="text-slate-600">Temir yo'l sohasidagi qoidalar va rasmiy qarorlar</p>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Qoidalarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="mb-4">
          <p className="text-slate-600">Jami {filteredFiles.length} ta hujjat topildi</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="truncate">{file.name}</span>
                </CardTitle>
                <Badge variant="outline">{file.category}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">
                    {formatFileSize(file.size)}
                  </span>
                  <Badge variant="secondary">{file.type.toUpperCase()}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => window.open(file.path, '_blank')}
                    className="flex-1"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ko'rish
                  </Button>
                  <Button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = file.path;
                      link.download = file.name;
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Yuklab olish
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Hech qanday hujjat topilmadi</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Rules;
