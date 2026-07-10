import { Crosshair, MapPin, Navigation, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { CameraUpload } from "../components/CameraUpload";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useComplaint } from "../context/ComplaintContext";
import { complaintTypes } from "../data/complaints";

export function ComplaintFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const type = complaintTypes.find((item) => item.id === id) || complaintTypes[0];
  const { submitComplaint, isOnline } = useComplaint();
  const [images, setImages] = useState([]);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ defaultValues: { latitude: "", longitude: "" } });

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setValue("latitude", position.coords.latitude.toFixed(6));
      setValue("longitude", position.coords.longitude.toFixed(6));
    }, () => undefined, { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 });
  }, [setValue]);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("இந்த சாதனத்தில் இருப்பிட வசதி இல்லை.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setValue("latitude", position.coords.latitude.toFixed(6));
      setValue("longitude", position.coords.longitude.toFixed(6));
      setGettingLocation(false);
      toast.success("இருப்பிடம் பெறப்பட்டது.");
    }, () => {
      setGettingLocation(false);
      toast.error("இருப்பிடத்தை பெற முடியவில்லை. அனுமதியை சரிபார்க்கவும்.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  };

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
    <div className="mt-6 space-y-5"><Input label="கிராமம் / வார்டு" icon={MapPin} placeholder="கிராமம் அல்லது வார்டின் பெயர்" error={errors.village?.message} {...register("village", { required: "கிராமம் / வார்டு அவசியம்." })} /><Input label="குறை உள்ள இடம்" icon={Navigation} placeholder="உதாரணம்: பேருந்து நிலையம் அருகில்" error={errors.location?.message} {...register("location", { required: "குறை உள்ள இடத்தை குறிப்பிடவும்." })} />
      <section><div className="mb-2 flex items-center justify-between"><p className="text-[13px] font-bold text-slate-700">இருப்பிடம்</p><button type="button" onClick={captureLocation} disabled={gettingLocation} className="flex items-center gap-1 text-[11px] font-extrabold text-government-600 disabled:opacity-60">{gettingLocation ? <LoadingSpinner className="h-3.5 w-3.5 border-government-200 border-t-government-600" /> : <Crosshair className="h-3.5 w-3.5" />}{gettingLocation ? "பெறப்படுகிறது" : "இருப்பிடத்தைப் பெறுக"}</button></div><div className="grid grid-cols-2 gap-2"><input readOnly placeholder="அட்சரேகை" className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-500 outline-none" {...register("latitude")} /><input readOnly placeholder="தீர்க்கரேகை" className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-500 outline-none" {...register("longitude")} /></div></section>
      <label className="block"><span className="mb-2 block text-[13px] font-bold text-slate-700">குறை விவரம்</span><textarea rows="4" placeholder="உங்கள் குறையை சுருக்கமாக விவரிக்கவும்" className={`w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-government-500 focus:ring-4 focus:ring-government-100 ${errors.remarks ? "border-rose-400" : "border-slate-200"}`} {...register("remarks", { required: "குறை விவரத்தை உள்ளிடவும்.", minLength: { value: 10, message: "குறைந்தது 10 எழுத்துகள் உள்ளிடவும்." } })} />{errors.remarks && <span className="mt-1.5 block text-xs font-medium text-rose-600">{errors.remarks.message}</span>}</label>
      <CameraUpload images={images} onChange={setImages} />
    </div><p className="mt-6 text-center text-[10px] leading-5 text-slate-400">பதிவு தேதியை தானாகவே சேர்க்கப்படும். நீங்கள் தேதி உள்ளிட தேவையில்லை.</p><Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>{isSubmitting ? <LoadingSpinner /> : <Send className="h-4 w-4" />}{isSubmitting ? "பதிவு செய்யப்படுகிறது" : "சமர்ப்பிக்கவும்"}</Button></form></main>;
}