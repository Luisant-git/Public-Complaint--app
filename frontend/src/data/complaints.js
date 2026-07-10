import { Bolt, BusFront, Droplets, HeartPulse, Landmark, MoreHorizontal, Road } from "lucide-react";

export const complaintTypes = [
  { id: "water", name: "குடிநீர் தொடர்பான குறை", Icon: Droplets, color: "bg-sky-500", iconColor: "text-sky-500", soft: "bg-sky-50" },
  { id: "electricity", name: "மின்சாரம் / தெருவிளக்கு குறை", Icon: Bolt, color: "bg-amber-500", iconColor: "text-amber-500", soft: "bg-amber-50" },
  { id: "road", name: "சாலை குறை", Icon: Road, color: "bg-orange-500", iconColor: "text-orange-500", soft: "bg-orange-50" },
  { id: "health", name: "சுகாதார குறை", Icon: HeartPulse, color: "bg-rose-500", iconColor: "text-rose-500", soft: "bg-rose-50" },
  { id: "building", name: "கட்டிட வசதி குறை", Icon: Landmark, color: "bg-violet-500", iconColor: "text-violet-500", soft: "bg-violet-50" },
  { id: "transport", name: "பொது போக்குவரத்து குறை", Icon: BusFront, color: "bg-indigo-500", iconColor: "text-indigo-500", soft: "bg-indigo-50" },
  { id: "other", name: "மற்றவை", Icon: MoreHorizontal, color: "bg-slate-500", iconColor: "text-slate-500", soft: "bg-slate-50" },
];

export const complaintTimeline = [
  { title: "குறை பதிவு செய்யப்பட்டது", detail: "உங்கள் குறை வெற்றிகரமாக பெறப்பட்டது.", state: "done" },
  { title: "சம்பந்தப்பட்ட துறைக்கு அனுப்பப்பட்டது", detail: "குறையை அதிகாரி பரிசீலித்து வருகிறார்.", state: "current" },
  { title: "குறை தீர்வு", detail: "தீர்வு நிறைவடைந்ததும் உங்களுக்கு அறிவிக்கப்படும்.", state: "upcoming" },
];