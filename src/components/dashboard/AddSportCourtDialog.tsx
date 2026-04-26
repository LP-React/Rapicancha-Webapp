"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CloudUpload, X, Plus, ArrowRight, Check, Loader2 } from "lucide-react";
import { Dialog } from "@base-ui/react";
import {
  sportCourtSchema,
  type SportCourtFormValues,
} from "@/lib/validations/sportCourt";
import { SportCourtService } from "@/services/sport-court-service";
import {
  AvailabilityService,
  type AvailabilityRequest,
  type DayAvailability,
} from "@/services/availability-service";
import { Step2Availability } from "./Step2Availability";
import { cn } from "@/lib/utils";

interface AddCourtDialogProps {
  venueId: number;
  venueName: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddSportCourtDialog({
  venueId,
  trigger,
  onSuccess,
}: AddCourtDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCourtId, setCreatedCourtId] = useState<number | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<SportCourtFormValues>>({
    venueId: venueId,
    name: "",
    description: "",
    sportType: "Futbol",
    surfaceType: "Grass sintetico",
    capacity: 10,
    hasRoof: false,
    hasLighting: false,
    rules: "",
    rate: 0,
    slotMinutes: 60,
    playMinutes: 45,
  });

  // --- ESTADO PASO 2 ---
  const [repeatAll, setRepeatAll] = useState(false);
  const [days, setDays] = useState<DayAvailability[]>(
    Array.from({ length: 7 }).map((_, i) => ({
      weekday: i,
      startTime: "08:00",
      endTime: "23:00",
      isActive: i < 5,
    })),
  );

  const resetForm = () => {
    setStep(1);
    setCreatedCourtId(null);
    setSelectedFiles([]);
    setPreviews([]);
    setFormData({
      venueId: venueId,
      name: "",
      description: "",
      sportType: "Futbol",
      surfaceType: "Grass sintetico",
      capacity: 10,
      hasRoof: false,
      hasLighting: false,
      rules: "",
      rate: 0,
      slotMinutes: 60,
      playMinutes: 45,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ||
        e.target.inputMode === "numeric" ||
        e.target.inputMode === "decimal"
          ? Number(value)
          : val,
    }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data },
    );
    if (!res.ok) throw new Error("Error al subir imagen");
    const resData = await res.json();
    return resData.secure_url;
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationData = {
      ...formData,
      venueId: Number(venueId),
      imageUrls:
        selectedFiles.length > 0
          ? selectedFiles.map(() => "https://temp.url")
          : [],
    };

    const result = sportCourtSchema.safeParse(validationData);
    if (!result.success) return toast.error(result.error.issues[0].message);

    try {
      setIsSubmitting(true);
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedUrls = await Promise.all(selectedFiles.map(uploadToCloudinary));
      }

      const newCourt = await SportCourtService.create({
        ...result.data,
        imageUrls: uploadedUrls,
      });

      setCreatedCourtId(newCourt.idSportCourt);
      setStep(2);
      toast.success("Información base guardada correctamente.");
    } catch (error: any) {
      toast.error(error.message || "Error al registrar la cancha");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (!createdCourtId)
      return toast.error("Error: No se encontró el ID de la cancha.");

    setIsSubmitting(true);
    try {
      const activeDays = days.filter((d) => d.isActive);
      if (activeDays.length === 0) {
        toast.error("Debes seleccionar al menos un día.");
        setIsSubmitting(false);
        return;
      }

      const payload: AvailabilityRequest[] = activeDays.map((d) => ({
        sportCourtId: createdCourtId,
        weekday: d.weekday,
        startTime: d.startTime,
        endTime: d.endTime,
      }));

      await AvailabilityService.saveBulk(payload);

      toast.success("¡Cancha y horarios configurados con éxito!");
      setOpen(false);
      resetForm();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar horarios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetForm();
      }}
    >
      <Dialog.Trigger className="outline-none">
        {trigger || (
          <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all cursor-pointer text-sm">
            <Plus size={16} /> Nueva Cancha
          </div>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-70 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 items-center justify-between pr-4">
            <div className="flex flex-1">
              <StepIndicator
                active={step === 1}
                num="01"
                label="Información General"
              />
              <StepIndicator
                active={step === 2}
                num="02"
                label="Horarios de Atención"
              />
            </div>
            <Dialog.Close className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {step === 1 ? (
              <form id="court-form" onSubmit={handleSubmitStep1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-8">
                    <SectionLabel num="01" title="Información de la Cancha" />
                    <InputGroup
                      label="Nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre de la cancha"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup
                        label="Deporte"
                        name="sportType"
                        value={formData.sportType}
                        onChange={handleChange}
                      />
                      <InputGroup
                        label="Superficie"
                        name="surfaceType"
                        value={formData.surfaceType}
                        onChange={handleChange}
                      />
                    </div>
                    <textarea
                      name="description"
                      placeholder="Descripción..."
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-b-2 border-primary/20 p-3 rounded-t-lg outline-none text-sm min-h-[80px]"
                    />

                    <SectionLabel num="02" title="Galería" />
                    <div className="grid grid-cols-3 gap-2">
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl hover:bg-primary/5 cursor-pointer">
                        <CloudUpload className="text-primary" size={20} />
                        <input
                          type="file"
                          multiple
                          hidden
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setSelectedFiles((prev) => [...prev, ...files]);
                            setPreviews((prev) => [
                              ...prev,
                              ...files.map((f) => URL.createObjectURL(f)),
                            ]);
                          }}
                        />
                      </label>
                      {previews.map((p, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-xl overflow-hidden group"
                        >
                          <img src={p} className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              setSelectedFiles((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              );
                              setPreviews((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              );
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <SectionLabel num="03" title="Costos y Tiempos" />
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup
                        label="Tarifa (S/)"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        inputMode="decimal"
                      />
                      <InputGroup
                        label="Capacidad"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        inputMode="numeric"
                      />
                      <InputGroup
                        label="Intervalo"
                        name="slotMinutes"
                        value={formData.slotMinutes}
                        onChange={handleChange}
                        inputMode="numeric"
                      />
                      <InputGroup
                        label="Juego"
                        name="playMinutes"
                        value={formData.playMinutes}
                        onChange={handleChange}
                        inputMode="numeric"
                      />
                    </div>
                    <SectionLabel num="04" title="Reglas" />
                    <textarea
                      name="rules"
                      value={formData.rules}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-dashed p-3 rounded-xl outline-none text-sm min-h-[100px]"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <Step2Availability
                days={days}
                setDays={setDays}
                repeatAll={repeatAll}
                setRepeatAll={setRepeatAll}
              />
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
            <button
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
              className="px-6 py-2 text-sm font-bold text-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={step === 1 ? handleSubmitStep1 : handleFinish}
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : step === 1 ? (
                <>
                  Siguiente <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Finalizar <Check size={18} />
                </>
              )}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Helpers visuales
const StepIndicator = ({ active, num, label }: any) => (
  <div
    className={cn(
      "flex-1 p-4 text-center font-black text-[10px] uppercase tracking-widest transition-all border-b-2",
      active
        ? "text-primary border-primary"
        : "text-gray-400 border-transparent",
    )}
  >
    {num}. {label}
  </div>
);

const SectionLabel = ({ num, title }: any) => (
  <h3 className="text-primary font-black text-[11px] uppercase tracking-tighter flex gap-2">
    <span className="opacity-50">{num}.</span> {title}
  </h3>
);

const InputGroup = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-gray-50 border-b-2 border-primary/10 focus:border-primary outline-none px-3 py-2 text-sm transition-all"
    />
  </div>
);
