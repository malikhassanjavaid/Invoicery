"use client";

import { useRef, useState } from "react";

const MAX_DIMENSION = 256;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB source limit

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process the image."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function LogoField({ defaultValue }: { defaultValue?: string | null }) {
  const [logo, setLogo] = useState<string>(defaultValue ?? "");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Image is too large. Please use a file under 5 MB.");
      return;
    }

    try {
      setLogo(await resizeToDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load that image.");
    }
  }

  function handleRemove() {
    setLogo("");
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-3 md:col-span-2">
      <span className="text-sm font-semibold">Logo</span>

      {/* Persists the resized image with the form's Server Action */}
      <input type="hidden" name="logoUrl" value={logo} />

      <div className="flex flex-wrap items-center gap-4">
        <div className="grid size-20 place-items-center overflow-hidden rounded-lg border border-[#cfd8ca] bg-[#f7f8f4]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Company logo preview" className="size-full object-contain" />
          ) : (
            <span className="text-xs font-semibold text-[#9aa79d]">No logo</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-[#1f6f56] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#195c48]"
          />
          {logo ? (
            <button
              type="button"
              onClick={handleRemove}
              className="w-fit text-sm font-semibold text-[#a13d3d] hover:underline"
            >
              Remove logo
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm font-semibold text-[#a13d3d]">{error}</p> : null}
    </div>
  );
}
