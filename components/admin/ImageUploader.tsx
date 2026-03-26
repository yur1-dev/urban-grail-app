"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, ImagePlus, Clipboard } from "lucide-react";

interface Props {
  images: string[];
  onChange: (imgs: string[]) => void;
  maxImages?: number;
}

// Compress + convert any image to JPEG, max 1200px wide, 85% quality
async function compressImage(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX) {
        height = Math.round((height * MAX) / width);
        width = MAX;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function ImageUploader({ images, onChange, maxImages = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pasteReady, setPasteReady] = useState(false);
  const [error, setError] = useState("");

  // Listen for paste anywhere on the page
  useEffect(() => {
    async function onPaste(e: ClipboardEvent) {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItems = items.filter((i) => i.type.startsWith("image/"));
      if (imageItems.length === 0) return;
      e.preventDefault();
      if (images.length >= maxImages) {
        setError(`Max ${maxImages} images allowed`);
        return;
      }
      setProcessing(true);
      setError("");
      try {
        const blobs = imageItems
          .map((i) => i.getAsFile())
          .filter(Boolean) as File[];
        const compressed = await Promise.all(
          blobs.slice(0, maxImages - images.length).map(compressImage),
        );
        onChange([...images, ...compressed]);
      } catch {
        setError("Failed to process pasted image");
      } finally {
        setProcessing(false);
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [images, onChange, maxImages]);

  // Drag and drop
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (!files.length) return;
      if (images.length >= maxImages) {
        setError(`Max ${maxImages} images allowed`);
        return;
      }
      setProcessing(true);
      setError("");
      try {
        const compressed = await Promise.all(
          files.slice(0, maxImages - images.length).map(compressImage),
        );
        onChange([...images, ...compressed]);
      } catch {
        setError("Failed to process image");
      } finally {
        setProcessing(false);
      }
    },
    [images, onChange, maxImages],
  );

  // File input
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) return;
    if (images.length >= maxImages) {
      setError(`Max ${maxImages} images allowed`);
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const compressed = await Promise.all(
        files.slice(0, maxImages - images.length).map(compressImage),
      );
      onChange([...images, ...compressed]);
    } catch {
      setError("Failed to process image");
    } finally {
      setProcessing(false);
      e.target.value = "";
    }
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(from: number, to: number) {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  const canAdd = images.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        ref={dropRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => canAdd && inputRef.current?.click()}
        className={`relative border-2 border-dashed transition-all ${
          dragging
            ? "border-[#c9a84c] bg-[#c9a84c]/5"
            : canAdd
              ? "border-[#2a2a2a] hover:border-[#c9a84c]/50 cursor-pointer"
              : "border-[#1a1a1a] cursor-not-allowed opacity-60"
        } p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[140px]`}
      >
        {processing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#5a5a5a] tracking-widest uppercase">
              Processing image...
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center">
                <Upload size={16} className="text-[#5a5a5a]" />
              </div>
              <div className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center">
                <Clipboard size={16} className="text-[#5a5a5a]" />
              </div>
              <div className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center">
                <ImagePlus size={16} className="text-[#5a5a5a]" />
              </div>
            </div>
            <div>
              <p className="text-sm text-white font-medium">
                {dragging ? "Drop image here" : "Click, drag & drop, or paste"}
              </p>
              <p className="text-[11px] text-[#5a5a5a] mt-1">
                PNG, JPG, JPEG — auto-compressed · {images.length}/{maxImages}{" "}
                uploaded
              </p>
              <p className="text-[10px] text-[#c9a84c]/70 mt-1 tracking-wider">
                💡 Copy any image and press Ctrl+V / Cmd+V to paste directly
              </p>
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-[11px] flex items-center gap-1.5">
          <span className="text-red-400">✕</span> {error}
        </p>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative group aspect-square bg-[#1e1e1e] overflow-hidden"
            >
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Main badge */}
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-[#c9a84c] text-[#0a0a0a] text-[8px] font-black tracking-wider px-1.5 py-0.5 uppercase">
                  Main
                </div>
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="w-7 h-7 bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove"
                >
                  <X size={12} className="text-white" />
                </button>
                <div className="flex gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      className="w-6 h-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-[10px] text-white transition-colors cursor-pointer"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      className="w-6 h-6 bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center text-[10px] text-white transition-colors cursor-pointer"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {canAdd && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-[#2a2a2a] hover:border-[#c9a84c]/50 flex items-center justify-center text-[#3a3a3a] hover:text-[#c9a84c] transition-colors cursor-pointer"
            >
              <ImagePlus size={20} />
            </button>
          )}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-[10px] text-[#3a3a3a] tracking-wider">
          First image is the main display. Use ← → arrows to reorder.
        </p>
      )}
    </div>
  );
}
