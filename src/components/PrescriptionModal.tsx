'use client';

import React, { useState } from 'react';
import { ExtractedMedicine, PrescriptionData } from '@/types';
import {
  Upload,
  Camera,
  FileCheck2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  Stethoscope,
  Calendar,
  ShieldCheck,
  Edit3,
} from 'lucide-react';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrescription: (prescriptionData: PrescriptionData) => void;
}

// Sample demo prescription image data (base64 SVG representation of a handwritten prescription)
const SAMPLE_PRESETS = [
  {
    id: 'sample-1',
    title: 'Dr. Verma (Chest & Fever Rx)',
    description: 'Augmentin 625 Duo, Pan-D, Dolo 650',
    doctor: 'Dr. Ramesh K. Verma (MD - General Medicine)',
    clinic: 'Apollo Healthcare Clinic, New Delhi',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23fffdf0"/><text x="20" y="40" font-family="serif" font-size="18" font-weight="bold" fill="%231e3a8a">Dr. Ramesh K. Verma, MD</text><text x="20" y="60" font-family="sans-serif" font-size="11" fill="%234b5563">Apollo Healthcare Clinic • Reg DL-88419</text><line x1="20" y1="75" x2="380" y2="75" stroke="%23cbd5e1" stroke-width="2"/><text x="20" y="100" font-family="serif" font-size="22" font-style="italic" fill="%23b91c1c">Rx</text><text x="40" y="130" font-family="cursive" font-size="16" fill="%231e293b">1. Tab. Augmentin 625mg (1-0-1) x 5 days</text><text x="40" y="165" font-family="cursive" font-size="16" fill="%231e293b">2. Cap. Pan-D (1-0-0 B/F) x 10 days</text><text x="40" y="200" font-family="cursive" font-size="16" fill="%231e293b">3. Tab. Dolo 650mg (SOS for fever)</text><text x="40" y="235" font-family="cursive" font-size="16" fill="%231e293b">4. Tab. Cetirizine 10mg (0-0-1 hs)</text><line x1="260" y1="280" x2="370" y2="280" stroke="%23334155" stroke-dasharray="3,3"/><text x="280" y="295" font-family="serif" font-size="12" fill="%23334155">Doctor Signature</text></svg>',
  },
  {
    id: 'sample-2',
    title: 'Dr. Gupta (Cardio & BP Rx)',
    description: 'Telma 40, Ecosprin 75',
    doctor: 'Dr. S. K. Gupta (MD - Cardiology)',
    clinic: 'Fortis Heart Institute, Okhla',
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f8fafc"/><text x="20" y="40" font-family="serif" font-size="18" font-weight="bold" fill="%230f172a">Dr. S. K. Gupta (Cardiologist)</text><text x="20" y="60" font-family="sans-serif" font-size="11" fill="%2364748b">Fortis Heart Institute • Reg DL-22104</text><line x1="20" y1="75" x2="380" y2="75" stroke="%23cbd5e1" stroke-width="2"/><text x="20" y="100" font-family="serif" font-size="22" font-style="italic" fill="%230284c7">Rx</text><text x="40" y="140" font-family="cursive" font-size="16" fill="%231e293b">1. Tab. Telma 40mg (1-0-0) OD x 30d</text><text x="40" y="180" font-family="cursive" font-size="16" fill="%231e293b">2. Tab. Ecosprin 75mg (0-1-0) x 30d</text><line x1="260" y1="280" x2="370" y2="280" stroke="%23334155" stroke-dasharray="3,3"/><text x="280" y="295" font-family="serif" font-size="12" fill="%23334155">Doctor Signature</text></svg>',
  },
];

export default function PrescriptionModal({
  isOpen,
  onClose,
  onConfirmPrescription,
}: PrescriptionModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Partial<PrescriptionData> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      runOcrAnalysis(reader.result as string, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedImage(preset.sampleImage);
    runOcrAnalysis(preset.sampleImage, 'image/svg+xml');
  };

  const runOcrAnalysis = async (imageBase64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/read-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      const resJson = await response.json();
      if (!response.ok) throw new Error(resJson.error || 'Failed to read prescription');

      setAnalysisResult(resJson.data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error processing image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalConfirm = () => {
    if (!analysisResult) return;

    const confirmed: PrescriptionData = {
      id: 'rx-' + Math.random().toString(36).substring(2, 9),
      imageUrl: selectedImage || '',
      doctorName: analysisResult.doctorName || 'Dr. Assigned',
      clinicHospital: analysisResult.clinicHospital || 'Medical Center',
      date: analysisResult.date || new Date().toISOString().split('T')[0],
      patientAge: analysisResult.patientAge || 42,
      extractedMedicines: analysisResult.extractedMedicines || [],
      rawText: analysisResult.rawText || '',
      verificationStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    onConfirmPrescription(confirmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Upload Doctor&apos;s Prescription
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Gemini Vision AI
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Our AI reads doctor handwriting and extracts medicine names for instant confirmation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prescription Selection Section */}
        {!analysisResult && !isAnalyzing && (
          <div className="mt-6 space-y-6">
            {/* Upload Box */}
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/30 transition group">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition duration-300">
                <Upload className="w-8 h-8" />
              </div>
              <p className="mt-3 font-semibold text-slate-800 dark:text-slate-200">
                Click to upload prescription photo or PDF
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
            </label>

            {/* Quick Demo Presets for SIH / Hackathon Evaluators */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Or Test with Sample Handwritten Prescriptions (1-Click Demo)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="text-left p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition group"
                  >
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
                      {preset.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {preset.description}
                    </p>
                    <span className="inline-block mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Analyze with AI →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State with AI Vision Animation */}
        {isAnalyzing && (
          <div className="my-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <Sparkles className="w-8 h-8 text-emerald-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Gemini Vision OCR in Progress...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Deciphering doctor handwriting, matching salt compositions, and extracting dosage instructions.
              </p>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {analysisResult && (
          <div className="mt-6 space-y-5">
            {/* Doctor & Clinic Header Banner */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {analysisResult.doctorName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {analysisResult.clinicHospital}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {analysisResult.date}</span>
              </div>
            </div>

            {/* Extracted Medicines Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Extracted Medicines ({analysisResult.extractedMedicines?.length || 0})
                </h4>
                <span className="text-[11px] text-slate-400">
                  Confirm the detected medicines below
                </span>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {analysisResult.extractedMedicines?.map((med: ExtractedMedicine, idx: number) => {
                  const isHighConfidence = med.confidence >= 85;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {med.name}
                          </span>
                          <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                            {med.dosage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Qty: <span className="font-medium text-slate-700 dark:text-slate-300">{med.qty}</span> • {med.frequency}
                        </p>
                      </div>

                      {/* Confidence Score Pill */}
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isHighConfidence
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {isHighConfidence ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {med.confidence}% Match
                        </span>
                        {!isHighConfidence && (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                            Handwriting unclear
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regulatory Safeguard Notice */}
            <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Human-in-the-Loop Compliance:</strong> A registered partner pharmacist will verify this prescription against your order before dispatch.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setSelectedImage(null);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Upload Different Image
              </button>
              <button
                onClick={handleFinalConfirm}
                className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Attach to Order</span>
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-xs flex items-center gap-2 border border-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
