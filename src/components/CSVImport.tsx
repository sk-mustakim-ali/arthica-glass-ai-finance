// src/components/CSVImport.tsx
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { parseFile } from "@/services/utils/parseFile";
import { normalizeTransactions, RawRow } from "@/services/utils/normalize";
import { uploadTransactions } from "@/services/utils/uploadToFirestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const CSVImport: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [fileName, setFileName] = useState<string>("");
  const [preview, setPreview] = useState<unknown[]>([]);
  const [fullData, setFullData] = useState<RawRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [invalidRows, setInvalidRows] = useState<number[] | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInvalidRows(null);
    try {
      const parsed = await parseFile(file);
      setFullData(parsed);
      setPreview(parsed.slice(0, 5));
      setFileName(file.name);
      toast({ title: "File loaded", description: `${parsed.length} rows ready` });
    } catch (err) {
      console.error(err);
      toast({ title: "Parse error", description: "Invalid CSV/Excel file", variant: "destructive" });
    }
  };

  const handleUpload = async () => {
    if (!user?.uid) {
      toast({ title: "Not signed in", description: "Please sign in to import", variant: "destructive" });
      return;
    }
    if (!fullData || fullData.length === 0) {
      toast({ title: "No data", description: "Please select a file first", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const normalized = normalizeTransactions(fullData, user.uid);
      const res = await uploadTransactions(normalized, user.uid);

      if (res.invalidCount > 0) {
        setInvalidRows(res.invalidRows);
        toast({
          title: "Partial import",
          description: `${res.uploaded} uploaded, ${res.invalidCount} invalid rows (see console for indexes)`,
        });
        console.warn("Invalid row indexes:", res.invalidRows);
      } else {
        toast({ title: "Import complete", description: `${res.uploaded} transactions uploaded.` });
        // clear
        setFileName("");
        setPreview([]);
        setFullData([]);
        setInvalidRows(null);
        if (onDone) onDone();
      }
    } catch (err: unknown) {
      console.error(err);
      const e = err as { message?: string };
      toast({ title: "Upload failed", description: e.message || "Could not upload to Firestore", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-white/60 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium">Import CSV / Excel</h3>
        </div>
        <div className="text-sm text-gray-500">{fileName || "No file selected"}</div>
      </div>

      <input type="file" accept=".csv,.xlsx" onChange={handleFile} className="mb-3" />

      {preview.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Preview (first 5 rows):</div>
          <pre className="text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}

      {invalidRows && invalidRows.length > 0 && (
        <div className="mb-3 text-sm text-yellow-700">
          Warning: {invalidRows.length} invalid rows (indexes): {invalidRows.join(", ")}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => { setFileName(""); setPreview([]); setFullData([]); setInvalidRows(null); }} disabled={loading}>
          Clear
        </Button>
        <Button onClick={handleUpload} disabled={loading || !fullData.length}>
          {loading ? "Uploading..." : "Upload to Firestore"}
        </Button>
      </div>
    </div>
  );
};

export default CSVImport;
