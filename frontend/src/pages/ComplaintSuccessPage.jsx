import { jsPDF } from "jspdf";
import { Check, Clipboard, Download, House } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { useComplaint } from "../context/ComplaintContext";

export function ComplaintSuccessPage() {
  const navigate = useNavigate();
  const { number } = useParams();
  const { currentComplaint } = useComplaint();
  const complaintNumber = currentComplaint?.number || number;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(complaintNumber);
      toast.success("குறை எண் நகலெடுக்கப்பட்டது.");
    } catch {
      toast.error("குறை எண்ணை நகலெடுக்க முடியவில்லை.");
    }
  };

  const downloadReceipt = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(9, 106, 53);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("குறை தீர்க்கும் பயணபாடு", pageWidth / 2, 16, { align: "center" });
    doc.setFontSize(10);
    doc.text("தமிழ்நாடு அரசு", pageWidth / 2, 26, { align: "center" });

    // Success message
    doc.setTextColor(9, 106, 53);
    doc.setFontSize(13);
    doc.text("குறை பதிவு வெற்றிகரமாக முடிந்தது", pageWidth / 2, 50, { align: "center" });

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 58, pageWidth - 15, 58);

    // Details
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    const details = [
      { label: "குறை எண்", value: complaintNumber },
      { label: "குறை வகை", value: currentComplaint?.type || "-" },
      { label: "கிராமம் / வார்டு", value: currentComplaint?.village || "-" },
      { label: "பதிவு நேரம்", value: new Date(currentComplaint?.submittedAt || Date.now()).toLocaleString("ta-IN") },
    ];
    let y = 68;
    details.forEach(({ label, value }) => {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(label, 15, y);
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(value, 15, y + 6);
      y += 18;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text("இது கணினியால் உருவாக்கப்பட்ட பதிவு ஆகும்.", pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: "center" });

    doc.save(`${complaintNumber}.pdf`);
    toast.success("குறை பதிவு விவரம் PDF ஆக பதிவிறக்கப்பட்டது.");
  };

  return <main className="min-h-dvh bg-white px-6 pb-8 pt-16 text-center"><div className="page-enter"><div className="pulse-ring mx-auto grid h-24 w-24 place-items-center rounded-full bg-government-600 text-white"><Check className="h-12 w-12" strokeWidth={3} /></div><p className="mt-10 text-sm font-bold text-government-600">வெற்றி!</p><h1 className="mt-2 text-2xl font-extrabold leading-relaxed text-slate-800">உங்கள் குறை வெற்றிகரமாக<br />பதிவேற்றப்பட்டது</h1><p className="mx-auto mt-3 max-w-[275px] text-xs leading-6 text-slate-500">குறையின் நிலையை அறிய இந்த குறை எண்ணை பாதுகாப்பாக வைத்துக்கொள்ளவும்.</p>
    <div className="mt-8 rounded-2xl border border-government-100 bg-government-50 px-4 py-4"><p className="text-[11px] font-bold text-government-700">குறை எண்</p><p className="font-number mt-2 text-[17px] font-extrabold tracking-wide text-government-700">{complaintNumber}</p></div>
    <div className="mt-3 grid grid-cols-2 gap-3"><Button variant="outline" onClick={copyNumber}><Clipboard className="h-4 w-4" />நகலெடுக்க</Button><Button variant="outline" onClick={downloadReceipt}><Download className="h-4 w-4" />பதிவிறக்க</Button></div>
    <Button className="mt-7 w-full" onClick={() => navigate("/dashboard")}><House className="h-4 w-4" />முகப்புக்கு செல்க</Button></div></main>;
}