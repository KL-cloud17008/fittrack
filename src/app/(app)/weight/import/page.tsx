"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, ArrowLeft, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { parseCSV, getHeaders, getDataRows } from "@/lib/csv";
import { parseCSVDate } from "@/lib/weight";
import { importWeightCSV } from "@/actions/weight";

type ParsedRow = {
  status: string;
  date: string;
  parsedDate: string;
  weight: number;
  bodyFatPercent: number | null;
  valid: boolean;
  error?: string;
};

type ImportState =
  | { step: "idle" }
  | { step: "preview"; rows: ParsedRow[]; rawCsv: string; fileName: string }
  | { step: "importing" }
  | { step: "done"; imported: number; errors: string[] };

export default function WeightImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ImportState>({ step: "idle" });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text) {
        toast.error("Could not read file");
        return;
      }

      const rows = parseCSV(text);
      const headers = getHeaders(rows);
      const dataRows = getDataRows(rows);

      const headerLower = headers.map((h) => h.toLowerCase());
      const statusCol = headerLower.findIndex((h) => h.includes("status"));
      const dateCol = headerLower.findIndex((h) => h.includes("date"));
      const weightCol = headerLower.findIndex((h) => h.includes("weight"));
      const bfCol = headerLower.findIndex((h) => h.includes("body fat"));

      if (dateCol === -1 || weightCol === -1) {
        toast.error("CSV must have Date and Weight columns");
        return;
      }

      const parsed: ParsedRow[] = dataRows.map((row, i) => {
        const rawDate = row[dateCol]?.trim() ?? "";
        const parsedDate = parseCSVDate(rawDate);
        const rawWeight = row[weightCol]?.trim() ?? "";
        const weight = parseFloat(rawWeight);

        let status = "NORMAL";
        if (statusCol !== -1) {
          const raw = row[statusCol]?.trim().toUpperCase() ?? "";
          if (raw === "BASELINE" || raw === "FASTING" || raw === "NORMAL") {
            status = raw;
          }
        }

        let bodyFatPercent: number | null = null;
        if (bfCol !== -1) {
          const rawBf = row[bfCol]?.trim() ?? "";
          if (rawBf) {
            const bf = parseFloat(rawBf);
            if (!isNaN(bf) && bf > 0 && bf < 100) {
              bodyFatPercent = bf;
            }
          }
        }

        const valid = !!parsedDate && !isNaN(weight) && weight > 0;

        return {
          status,
          date: rawDate,
          parsedDate: parsedDate ?? "",
          weight: isNaN(weight) ? 0 : weight,
          bodyFatPercent,
          valid,
          error: !valid
            ? `Row ${i + 2}: ${!parsedDate ? "Invalid date" : "Invalid weight"}`
            : undefined,
        };
      });

      setState({
        step: "preview",
        rows: parsed,
        rawCsv: text,
        fileName: file.name,
      });
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (state.step !== "preview") return;

    setState({ step: "importing" });
    try {
      const formData = new FormData();
      formData.set("csv", state.rawCsv);
      const result = await importWeightCSV(formData);

      if (result.error) {
        toast.error(result.error);
        setState(state); // back to preview
        return;
      }

      setState({
        step: "done",
        imported: result.imported,
        errors: result.errors,
      });
      toast.success(`Imported ${result.imported} entries!`);
    } catch {
      toast.error("Import failed");
      setState(state);
    }
  }

  const validCount =
    state.step === "preview" ? state.rows.filter((r) => r.valid).length : 0;
  const errorCount =
    state.step === "preview" ? state.rows.filter((r) => !r.valid).length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
          <Link href="/weight">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Import Weight Data
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload a CSV from Google Sheets
          </p>
        </div>
      </div>

      {/* Upload / Preview / Done */}
      {state.step === "idle" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Choose CSV File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Expected format: columns for Status, Date (M/D/YYYY), Weight
              (Scale), and optionally Body Fat % (Scale).
            </p>
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Drag and drop or click to select
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step === "preview" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">
                Preview: {state.fileName}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">{validCount} valid</Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive">{errorCount} invalid</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview table */}
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              {/* Header */}
              <div className="sticky top-0 grid grid-cols-4 gap-2 bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                <span>Date</span>
                <span>Weight</span>
                <span>Status</span>
                <span>Body Fat</span>
              </div>
              {/* Rows */}
              {state.rows.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-4 gap-2 border-t border-border px-3 py-2 text-sm ${
                    !row.valid
                      ? "bg-destructive/10 text-destructive"
                      : "text-foreground"
                  }`}
                >
                  <span className="truncate">{row.date}</span>
                  <span>{row.valid ? `${row.weight} lbs` : "Invalid"}</span>
                  <span className="truncate">{row.status}</span>
                  <span>
                    {row.bodyFatPercent != null ? `${row.bodyFatPercent}%` : "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setState({ step: "idle" });
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Choose Different File
              </Button>
              <Button onClick={handleImport} disabled={validCount === 0}>
                Import {validCount} Entries
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.step === "importing" && (
        <Card>
          <CardContent className="space-y-4 py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Importing entries...
            </p>
            <Progress className="mx-auto max-w-xs" />
          </CardContent>
        </Card>
      )}

      {state.step === "done" && (
        <Card>
          <CardContent className="space-y-4 py-12 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
            <div>
              <p className="text-lg font-semibold text-foreground">
                Import Complete
              </p>
              <p className="text-sm text-muted-foreground">
                Successfully imported {state.imported} entries
              </p>
            </div>
            {state.errors.length > 0 && (
              <div className="mx-auto max-w-md rounded-lg border border-border bg-muted/30 p-3 text-left">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Skipped rows:
                </p>
                <ul className="space-y-0.5 text-xs text-muted-foreground">
                  {state.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {state.errors.length > 10 && (
                    <li>...and {state.errors.length - 10} more</li>
                  )}
                </ul>
              </div>
            )}
            <Button onClick={() => router.push("/weight")}>
              View Weight Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
