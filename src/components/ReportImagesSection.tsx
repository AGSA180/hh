import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { AttachedImage } from '../types';

interface ReportImagesSectionProps {
  images: AttachedImage[];
  onImagesChange: (images: AttachedImage[]) => void;
  isReadOnly?: boolean;
}

export const ReportImagesSection: React.FC<ReportImagesSectionProps> = ({
  images = [],
  onImagesChange,
  isReadOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If in read-only or print mode and no images exist, don't display anything to preserve page layout
  if (isReadOnly && images.length === 0) {
    return null;
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const fileList = Array.from(files);
    const validImageFiles = fileList.filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      setErrorMessage('يرجى اختيار ملفات صور صالحة (PNG, JPG, WebP)');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const newImg: AttachedImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            dataUrl: result,
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
          };
          onImagesChange([...images, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = (idToRemove: string) => {
    onImagesChange(images.filter((img) => img.id !== idToRemove));
  };

  const handleCaptionChange = (id: string, newCaption: string) => {
    onImagesChange(
      images.map((img) => (img.id === id ? { ...img, caption: newCaption } : img))
    );
  };

  return (
    <section className={`mt-6 pt-4 border-t-2 border-slate-300 print:mt-1.5 print:pt-1.5 print:border-slate-400 ${images.length === 0 ? 'no-print' : ''}`}>
      <div className="flex items-center justify-between mb-3 print:mb-1">
        <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 print:text-[8.5pt]">
          <ImageIcon className="w-4 h-4 text-emerald-800" />
          <span>الشواهد والصور التوثيقية الميدانية</span>
          {images.length > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold print:text-[7pt] print:py-0 print:px-1">
              {images.length} {images.length === 1 ? 'صورة' : 'صور'}
            </span>
          )}
        </h2>

        {!isReadOnly && images.length > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="no-print inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 transition"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            <span>إضافة صورة أخرى</span>
          </button>
        )}
      </div>

      {/* Hidden File Input for click-to-upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Inline Error Message */}
      {errorMessage && (
        <div className="no-print mb-3 p-2.5 rounded bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold text-center">
          {errorMessage}
        </div>
      )}

      {/* Upload Drag & Drop Zone (Visible in edit mode) */}
      {!isReadOnly && images.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`no-print border-2 border-dashed rounded-lg p-5 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-emerald-700 bg-emerald-50 scale-[0.99]'
              : 'border-slate-300 hover:border-emerald-600 hover:bg-slate-50/70 bg-slate-50/40'
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              اسحب وأفلت صور الشواهد الميدانية هنا، أو انقر للاختيار من الجهاز
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              يدعم ملفات JPG, PNG, WebP (يمكن إرفاق أكثر من صورة مع طباعتها داخل التقرير)
            </p>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2 print:grid-cols-2 print:gap-1.5 print:mt-1">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-2xs flex flex-col print:border-slate-300 print:shadow-none print:rounded"
            >
              {/* Image Frame */}
              <div className="relative bg-slate-100 aspect-16/10 sm:aspect-4/3 flex items-center justify-center overflow-hidden border-b border-slate-200 print:aspect-auto print:h-[55px] print:max-h-[55px]">
                <img
                  src={img.dataUrl}
                  alt={img.caption || `شاهد ميداني ${index + 1}`}
                  className="w-full h-full object-contain bg-white"
                  loading="lazy"
                />

                {/* Delete button (hidden in print and read-only) */}
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="no-print absolute top-2 left-2 p-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-md transition active:scale-95 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="حذف هذه الصورة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/75 text-white text-[11px] font-bold print:text-[6.5pt] print:py-0 print:px-1 print:top-1 print:right-1">
                  شاهد ({index + 1})
                </div>
              </div>

              {/* Caption */}
              <div className="p-2 sm:p-2.5 bg-slate-50 text-right print:p-0.5 print:bg-white">
                {isReadOnly ? (
                  <p className="text-xs font-semibold text-slate-800 py-0.5 print:text-[7pt] print:py-0">
                    {img.caption ? `البيان: ${img.caption}` : `الشاهد الميداني رقم (${index + 1})`}
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                      البيان / الوصف:
                    </label>
                    <input
                      type="text"
                      value={img.caption}
                      placeholder="اكتب وصفاً مختصراً للشاهد الميداني..."
                      onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                      className="w-full text-xs font-medium px-2 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
