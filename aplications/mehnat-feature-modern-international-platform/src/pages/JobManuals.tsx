import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Users, Eye } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatFileSize, type FileItem } from "@/lib/fileService";
import { smartDB } from "@/lib/smartDB";

const JobManuals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getExt = (path?: string): FileItem["type"] => {
    const ext = (path?.split('.').pop() || '').toLowerCase();
    if (["pdf","doc","docx","ppt","pptx","zip","xls","xlsx","jpg","png","jpeg"].includes(ext)) return ext as FileItem["type"];
    return "doc";
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await smartDB.select('kasb_yoriqnomalari', '*');
      const rows = res.data || [];
      const mapped: FileItem[] = rows.map((row: any) => {
        const path: string = row.file_path || '';
        const name: string = row.kasb_nomi || (path ? path.split('/').pop() : "Yo'riqnoma");
        return {
          id: String(row.id),
          name,
          path,
          size: 0,
          type: getExt(path),
          category: "Kasb yo'riqnomalari",
          lastModified: row.updated_at ? new Date(row.updated_at) : (row.created_at ? new Date(row.created_at) : undefined),
          description: row.content || undefined,
          tags: row.xavfsizlik_darajasi ? [row.xavfsizlik_darajasi] : undefined,
          dateCreated: row.created_at || undefined,
        };
      });
      setFiles(mapped);
      setFilteredFiles(mapped);
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

  const categories = [...new Set(files.map(file => file.category))];

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "doc": return "bg-blue-100 text-blue-800";
      case "docx": return "bg-green-100 text-green-800";
      case "pdf": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Kasb Yo'riqnomalari</h1>
          <p className="text-slate-600">Turli kasblar bo'yicha professional yo'riqnomalar</p>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Yo'riqnomalarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Badge key={category} variant="secondary" className="cursor-pointer">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-slate-600">Jami {filteredFiles.length} ta yo'riqnoma topildi</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <span className="truncate text-sm">{file.name}</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{file.category}</Badge>
                  <Badge className={getFileTypeColor(file.type)}>
                    {file.type.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {formatFileSize(file.size)}
                  </span>
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
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Hech qanday yo'riqnoma topilmadi</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default JobManuals;
