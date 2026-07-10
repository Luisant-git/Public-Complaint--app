import { MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { CameraUpload } from "../components/CameraUpload";
import { Header } from "../components/Header";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useComplaint } from "../context/ComplaintContext";
import { complaintTypes } from "../data/complaints";

export function ComplaintFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const type = complaintTypes.find((item) => item.id === id) || complaintTypes[0];
  const { submitComplaint, isOnline } = useComplaint();
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onInvalid = () => toast.error("தேவையான விவரங்களை நிரப்பவும்.");
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const complaint = await submitComplaint({ ...values, images: images.map((image) => image.url) }, type.name);
    setIsSubmitting(false);
    toast.success(isOnline ? "உங்கள் குறை பதிவு செய்யப்பட்டது." : "இணையம் கிடைத்ததும் குறை அனுப்பப்படும்.");
    navigate(`/success/${complaint.number}`, { replace: true });
  };

  const Icon = type.Icon;
  return <main className="min-h-dvh bg-white pb-8"><Header title="குறை விவரங்கள்" back action="none" /><form className="page-enter px-4 pb-4 pt-5" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate><div className="flex items-center gap-3 rounded-2xl bg-government-50 px-3.5 py-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${type.color} text-white`}><Icon className="h-5 w-5" /></span><div><p className="text-[10px] font-bold text-government-700">தேர்ந்தெடுத்த குறை வகை</p><p className="mt-0.5 text-[13px] font-extrabold text-slate-700">{type.name}</p></div></div>
    <div className="mt-6 space-y-5">
      <label className="block">
        <span className="mb-2 block text-[13px] font-bold text-slate-700">இடம்</span>
        <input
          type="text"
          placeholder="உங்கள் குறை பதிவு செய்யும் இடம்"
          className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-government-500 focus:ring-4 focus:ring-government-100 ${errors.place ? "border-rose-400" : "border-slate-200"}`}
          {...register("place", { required: "இடத்தை உள்ளிடவும்." })}
        />
        {errors.place && <span className="mt-1.5 block text-xs font-medium text-rose-600">{errors.place.message}</span>}
      </label>
      <label className="block"><span className="mb-2 block text-[13px] font-bold text-slate-700">குறை விவரம்</span><textarea rows="4" placeholder="உங்கள் குறையை சுருக்கமாக விவரிக்கவும்" className={`w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-government-500 focus:ring-4 focus:ring-government-100 ${errors.remarks ? "border-rose-400" : "border-slate-200"}`} {...register("remarks", { required: "குறை விவரத்தை உள்ளிடவும்.", minLength: { value: 10, message: "குறைந்தது 10 எழுத்துகள் உள்ளிடவும்." } })} />{errors.remarks && <span className="mt-1.5 block text-xs font-medium text-rose-600">{errors.remarks.message}</span>}</label>
      <CameraUpload images={images} onChange={setImages} />
    </div><p className="mt-6 text-center text-[10px] leading-5 text-slate-400">பதிவு தேதியை தானாகவே சேர்க்கப்படும். நீங்கள் தேதி உள்ளிட தேவையில்லை.</p><Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>{isSubmitting ? <LoadingSpinner /> : <Send className="h-4 w-4" />}{isSubmitting ? "பதிவு செய்யப்படுகிறது" : "சமர்ப்பிக்கவும்"}</Button></form></main>;
}