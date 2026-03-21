"use client";
import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader, Clipboard } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pasteHint, setPasteHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Ctrl+V paste anywhere on the page ────────────────────────────────────
  useEffect(() => {
    async function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItems = Array.from(items).filter((item) =>
        item.type.startsWith("image/"),
      );
      if (imageItems.length === 0) return;

      e.preventDefault();
      const files = imageItems
        .map((item) => item.getAsFile())
        .filter(Boolean) as File[];

      if (files.length > 0) {
        setPasteHint(true);
        setTimeout(() => setPasteHint(false), 1500);
        await uploadFiles(files);
      }
    }

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [images]); // re-register when images changes so closure is fresh

  async function uploadFiles(files: File[]) {
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    for (const file of files) {
      if (
        ![
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ].includes(file.type)
      ) {
        setError(`"${file.name}" is not a supported image type`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" is too large (max 5MB)`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) uploaded.push(data.url);
      else setError(data.error || "Upload failed");
    }

    if (uploaded.length > 0) onChange([...images, ...uploaded]);
    setUploading(false);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    uploadFiles(Array.from(files));
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function moveImage(from: number, to: number) {
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square bg-[#1e1e1e] overflow-hidden group border border-[#1e1e1e] hover:border-[#c9a84c]/40 transition-colors"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={10} />
              </button>

              {/* Main badge */}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-[#c9a84c] text-[#0a0a0a] text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                  Main
                </span>
              )}

              {/* Move left/right arrows */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-colors"
                  >
                    ←
                  </button>
                )}
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    className="bg-black/70 text-white text-[10px] px-1.5 py-0.5 hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-colors ml-auto"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed transition-colors p-8 text-center cursor-pointer group relative ${
          pasteHint
            ? "border-[#c9a84c] bg-[#c9a84c]/5"
            : "border-[#3a3a3a] hover:border-[#c9a84c]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-[#5a5a5a]">
            <Loader size={20} className="animate-spin text-[#c9a84c]" />
            <p className="text-xs tracking-widest uppercase">Uploading...</p>
          </div>
        ) : pasteHint ? (
          <div className="flex flex-col items-center gap-2 text-[#c9a84c]">
            <Clipboard size={20} />
            <p className="text-xs tracking-widest uppercase">Image pasted!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-[#5a5a5a] group-hover:text-white transition-colors">
            <Upload size={20} />
            <div>
              <p className="text-xs tracking-widest uppercase font-medium">
                Click or drag images here
              </p>
              <p className="text-[10px] text-[#3a3a3a] mt-1">
                JPG, PNG, WebP · Max 5MB each
              </p>
            </div>
            {/* Ctrl+V hint */}
            <div className="flex items-center gap-2 mt-1 border border-[#2a2a2a] px-3 py-1.5">
              <Clipboard size={11} className="text-[#3a3a3a]" />
              <span className="text-[10px] tracking-[2px] text-[#3a3a3a]">
                Or press{" "}
                <kbd className="bg-[#1e1e1e] text-[#5a5a5a] px-1.5 py-0.5 text-[9px] font-mono">
                  Ctrl+V
                </kbd>{" "}
                to paste a copied image
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <p className="text-[10px] text-[#3a3a3a]">
          💡 First image = main product photo
        </p>
        <p className="text-[10px] text-[#3a3a3a]">↔ Hover image to reorder</p>
        <p className="text-[10px] text-[#3a3a3a]">
          📋 Ctrl+V works anywhere on the page
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1.5">
          <X size={11} /> {error}
        </p>
      )}
    </div>
  );
}
