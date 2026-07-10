import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import { Check, Clipboard, Download, House } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { useComplaint } from "../context/ComplaintContext";

export function ComplaintSuccessPage() {
  const navigate = useNavigate();
  const { number } = useParams();
  const { currentComplaint } = useComplaint();
  const complaintNumber = currentComplaint?.number || number || "பதிவு எண் கிடையாது";
  const receiptRef = useRef(null);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(complaintNumber);
      toast.success("குறை எண் நகலெடுக்கப்பட்டது.");
    } catch {
      toast.error("குறை எண்ணை நகலெடுக்க முடியவில்லை.");
    }
  };

  const downloadReceipt = async () => {
    const el = receiptRef.current;
    if (!el) return;

    // Make it briefly visible for html2canvas to capture correctly
    el.style.visibility = "visible";
    el.style.left = "-9999px";

    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      // Scale image to fill A5 width, maintain aspect ratio
      const imgW = pageW;
      const imgH = (canvas.height / canvas.width) * imgW;
      const finalH = Math.min(imgH, pageH);

      doc.addImage(imgData, "JPEG", 0, 0, imgW, finalH);
      doc.save(`குறை-${complaintNumber}.pdf`);
      toast.success("குறை பதிவு விவரம் PDF ஆக பதிவிறக்கப்பட்டது.");
    } catch (e) {
      console.error(e);
      toast.error("PDF உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      el.style.visibility = "hidden";
    }
  };

  const submittedAt = new Date(
    currentComplaint?.submittedAt || Date.now()
  ).toLocaleString("ta-IN");

  return (
    <>
      {/* ── Hidden receipt div captured by html2canvas ── */}
      <div
        ref={receiptRef}
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          visibility: "hidden",
          width: "560px",
          fontFamily: "'Noto Sans Tamil', serif",
          background: "#ffffff",
          borderRadius: "0",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: "#9f0100", padding: "24px", textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700, lineHeight: 1.7 }}>
            குறை தீர்க்கும் பயண்பாடு
          </div>
          <div style={{ color: "#c8f0da", fontSize: "13px", marginTop: "4px" }}>
            தமிழ்நாடு அரசு
          </div>
        </div>

        {/* Success badge */}
        <div style={{ textAlign: "center", padding: "20px 28px 14px", color: "#9f0100", fontSize: "15px", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>
          ✓ குறை பதிவு வெற்றிகரமாக முடிந்தது
        </div>

        {/* Body */}
        <div style={{ padding: "24px 32px", flex: 1 }}>
          {/* Complaint number */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "8px" }}>
              குறை எண்
            </div>
            <div style={{ display: "inline-block", fontSize: "20px", color: "#9f0100", fontWeight: 700, background: "#fff7e8", border: "1px solid #ffe7ad", borderRadius: "8px", padding: "10px 18px" }}>
              {complaintNumber}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 0 20px" }} />

          {/* Type */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "6px" }}>
              குறை வகை
            </div>
            <div style={{ fontSize: "15px", color: "#1f2937", fontWeight: 600, lineHeight: 1.7 }}>
              {currentComplaint?.type || "-"}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 0 20px" }} />

          {/* Time */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em", marginBottom: "6px" }}>
              பதிவு நேரம்
            </div>
            <div style={{ fontSize: "15px", color: "#1f2937", fontWeight: 600, lineHeight: 1.7 }}>
              {submittedAt}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "16px 28px 20px", fontSize: "11px", color: "#aaaaaa", borderTop: "1px solid #f3f4f6", marginTop: "20px" }}>
          இது கணினியால் உருவாக்கப்பட்ட பதிவு ஆகும்.
        </div>
      </div>

      {/* ── Visible success page (original look) ── */}
      <main className="min-h-dvh bg-white px-6 pb-8 pt-16 text-center">
        <div className="page-enter">
          <div className="pulse-ring mx-auto grid h-24 w-24 place-items-center rounded-full bg-government-600 text-white">
            <Check className="h-12 w-12" strokeWidth={3} />
          </div>
          <p className="mt-10 text-sm font-bold text-government-600">வெற்றி!</p>
          <h1 className="mt-2 text-2xl font-extrabold leading-relaxed text-slate-800">உங்கள் குறை வெற்றிகரமாக<br />பதிவேற்றப்பட்டது</h1>
          <p className="mx-auto mt-3 max-w-[275px] text-xs leading-6 text-slate-500">குறையின் நிலையை அறிய இந்த குறை எண்ணை பாதுகாப்பாக வைத்துக்கொள்ளவும்.</p>
          <div className="mt-8 rounded-2xl border border-[#ffe7ad] bg-[#fff7e8] px-4 py-4">
            <p className="text-[11px] font-bold text-[#7a0000]">குறை எண்</p>
            <p className="font-number mt-2 text-[17px] font-extrabold tracking-wide text-[#9f0100]">{complaintNumber}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={copyNumber}><Clipboard className="h-4 w-4" />நகலெடுக்க</Button>
            <Button variant="outline" onClick={downloadReceipt}><Download className="h-4 w-4" />பதிவிறக்க</Button>
          </div>
          <Button className="mt-7 w-full" onClick={() => navigate("/dashboard")}><House className="h-4 w-4" />முகப்புக்கு செல்க</Button>
        </div>
      </main>
    </>
  );
}