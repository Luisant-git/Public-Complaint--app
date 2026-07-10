import { Camera, ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";

export function CameraUpload({ images, onChange }) {
  const addFiles = (files) => {
    const selected = Array.from(files || []);
    const available = 3 - images.length;
    if (!selected.length) return;
    if (available <= 0) {
      toast.warning("அதிகபட்சம் 3 புகைப்படங்கள் மட்டுமே சேர்க்க முடியும்.");
      return;
    }
    const validFiles = selected.slice(0, available).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("புகைப்பட கோப்புகளை மட்டும் சேர்க்கவும்.");
        return false;
      }
      return true;
    });
    const newImages = validFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));
    onChange([...images, ...newImages]);
    if (selected.length > available) toast.info("முதல் 3 புகைப்படங்கள் மட்டும் சேர்க்கப்பட்டன.");
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].url);
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <section>
      <div className="mb-2 flex items-center justify-between"><p className="text-[13px] font-bold text-slate-700">புகைப்படம் சேர்க்கவும்</p><p className="font-number text-[11px] font-bold text-slate-400">{images.length}/3</p></div>
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((image, index) => <div key={image.url} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"><img src={image.url} alt={`புகைப்படம் ${index + 1}`} className="h-full w-full object-cover" /><button type="button" onClick={() => removeImage(index)} className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-slate-900/75 text-white" aria-label="புகைப்படத்தை நீக்கவும்"><X className="h-3.5 w-3.5" /></button></div>)}
        {images.length < 3 && <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-government-300 bg-government-50 text-government-700 transition active:bg-government-100"><Camera className="h-5 w-5" /><span className="text-[10px] font-extrabold">புகைப்படம்</span><input className="sr-only" type="file" accept="image/*" capture="environment" multiple onChange={(event) => addFiles(event.target.files)} /></label>}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500"><ImagePlus className="h-3.5 w-3.5 text-government-600" /><span>குறை தொடர்பான புகைப்படங்களை சேர்க்கலாம்.</span></div>
    </section>
  );
}