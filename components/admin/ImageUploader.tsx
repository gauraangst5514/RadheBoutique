"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 6 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const uploaded: UploadedImage[] = [];

      for (const file of toUpload) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          toast.error(data.error || `Failed to upload ${file.name}`);
          continue;
        }

        uploaded.push(data.data);
      }

      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Upload area */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={cn(
          "border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-gold/50",
          uploading && "opacity-60 pointer-events-none"
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-ivory/60">
            <Loader2 size={20} className="animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="text-ivory/50">
            <Upload size={28} className="mx-auto mb-2 text-gold" />
            <p className="text-sm font-medium">Click to upload or drag images here</p>
            <p className="text-xs mt-1">JPG, PNG, WebP • Max {maxImages} images</p>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
          {images.map((img, i) => (
            <div key={img.publicId || i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
              <Image src={img.url} alt={`Product ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={14} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-gold text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
