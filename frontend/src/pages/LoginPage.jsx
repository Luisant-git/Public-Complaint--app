import { Megaphone, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useComplaint } from "../context/ComplaintContext";
import { authApi } from "../api/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { setUserProfile } = useComplaint();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onInvalid = () => toast.error("உள்நுழைவு விவரங்களை சரிபார்க்கவும்.");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await authApi.loginUser(data.name.trim(), data.mobile.trim());
      setUserProfile({ name: result.user.name, mobile: result.user.mobile });
      toast.success("வெற்றிகரமாக உள்நுழைந்தீர்கள்.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message || "உள்நுழைவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-canvas flex min-h-dvh flex-col bg-white">
      <section className="relative overflow-hidden bg-government-600 px-7 pb-8 pt-8 text-white">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10" />
        <div className="relative">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-government-600 shadow-lg">
            <Megaphone className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm font-bold text-white/70">தமிழ்நாடு அரசு</p>
          <h1 className="mt-2 text-[22px] font-extrabold leading-tight">குறை தீர்க்கும் பயண்பாடு</h1>
          <p className="mt-2 text-xs leading-5 text-white/75">உங்கள் குறைகளை பதிவு செய்து தீர்வைப் பெறுங்கள்.</p>
        </div>
      </section>

      <section className="-mt-5 flex-1 rounded-t-[28px] bg-white px-6 pb-8 pt-8">
        <h2 className="text-xl font-extrabold text-slate-800">வணக்கம்!</h2>
        <p className="mt-1.5 text-xs text-slate-500">தொடர உள்நுழையவும்</p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
          <Input
            label="பெயர்"
            icon={UserRound}
            placeholder="உங்கள் பெயரை உள்ளிடவும்"
            error={errors.name?.message}
            {...register("name", { required: "பெயர் அவசியம்." })}
          />
          <Input
            label="கைபேசி எண்"
            icon={Phone}
            inputMode="numeric"
            placeholder="உங்கள் கைபேசி எண்ணை உள்ளிடவும்"
            maxLength="10"
            error={errors.mobile?.message}
            {...register("mobile", {
              required: "கைபேசி எண் அவசியம்.",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்.",
              },
            })}
          />
          <Button type="submit" className="mt-5 w-full" disabled={isLoading}>
            {isLoading && <LoadingSpinner />}
            உள்நுழைக
          </Button>
        </form>
      </section>
    </main>
  );
}