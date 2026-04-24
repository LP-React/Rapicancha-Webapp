"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CloudUpload, X, Save, Plus } from "lucide-react";
import { Dialog } from "@base-ui/react";
import {
  sportCourtSchema,
  type SportCourtFormValues,
} from "@/lib/validations/sportCourt";
import { SportCourtService } from "@/services/sport-court-service";

interface AddCourtDialogProps {
  venueId: number;
  venueName: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddSportCourtDialog({
  venueId,
  venueName,
  trigger,
  onSuccess,
}: AddCourtDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Preparar datos para validación (Zod)
    const validationData = {
      ...formData,
      venueId: Number(venueId),
      // Simulamos las URLs si hay archivos para que Zod no de error de "mínimo 1 imagen"
      imageUrls:
        selectedFiles.length > 0
          ? selectedFiles.map(() => "https://temp.url")
          : [],
    };

    const result = sportCourtSchema.safeParse(validationData);

    if (!result.success) {
      // Mostramos solo el primer error encontrado
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      setIsSubmitting(true);

      // 2. Subida de imágenes real a Cloudinary
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        toast.info(`Subiendo ${selectedFiles.length} imágenes...`);
        uploadedUrls = await Promise.all(
          selectedFiles.map((file) => uploadToCloudinary(file)),
        );
      }

      // 3. Envío al Backend con datos validados y URLs reales
      await SportCourtService.create({
        ...result.data,
        imageUrls: uploadedUrls,
      });

      toast.success("¡Cancha registrada con éxito!");
      setOpen(false);
      resetForm();
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al registrar la cancha");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
    if (!res.ok) throw new Error("Error al subir una de las imágenes");
    const resData = await res.json();
    return resData.secure_url;
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="outline-none">
        {trigger || (
          <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition-all cursor-pointer text-sm">
            <Plus size={16} /> Nueva Cancha
          </div>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-70 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <Dialog.Title className="text-3xl font-black text-primary tracking-tight uppercase">
                Nueva Cancha
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 font-medium mt-1">
                Añadiendo instalación a:{" "}
                <span className="text-primary font-bold">{venueName}</span>
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </Dialog.Close>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-8 bg-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* COLUMNA 1 */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <SectionLabel num="01" title="Información de la Cancha" />
                  <div className="space-y-4">
                    <InputGroup
                      label="Nombre de la Cancha"
                      name="name"
                      value={formData.name}
                      placeholder="Ej: Cancha Central de Grass"
                      onChange={handleChange}
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
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Descripción Corta
                      </label>
                      <textarea
                        name="description"
                        rows={2}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-b-2 border-primary/20 focus:border-primary outline-none px-4 py-3 rounded-t-lg transition-all resize-none text-sm text-black"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <SectionLabel num="02" title="Galería & Características" />
                  <div className="grid grid-cols-3 gap-4">
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-2xl hover:bg-primary/5 cursor-pointer transition-all">
                      <CloudUpload className="text-primary" size={24} />
                      <span className="text-[10px] font-bold uppercase mt-2 text-black">
                        Añadir
                      </span>
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    {previews.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group"
                      >
                        <img
                          src={url}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <CheckboxItem
                      name="hasRoof"
                      label="Techado"
                      checked={formData.hasRoof}
                      onChange={handleChange}
                    />
                    <CheckboxItem
                      name="hasLighting"
                      label="Iluminación"
                      checked={formData.hasLighting}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* COLUMNA 2 */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <SectionLabel num="03" title="Costos y Tiempos" />
                  <div className="grid grid-cols-2 gap-4">
                    {/* Tarifa - Permite decimales para soles (ej: 80.50) */}
                    <InputGroup
                      label="Tarifa (S/)"
                      name="rate"
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={formData.rate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          handleChange(e);
                        }
                      }}
                    />

                    {/* Capacidad - Solo números enteros */}
                    <InputGroup
                      label="Capacidad"
                      name="capacity"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={formData.capacity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          handleChange(e);
                        }
                      }}
                    />

                    {/* Intervalo - Solo números enteros */}
                    <InputGroup
                      label="Intervalo (min)"
                      name="slotMinutes"
                      type="text"
                      inputMode="numeric"
                      placeholder="60"
                      value={formData.slotMinutes}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          handleChange(e);
                        }
                      }}
                    />

                    {/* Tiempo de Juego - Solo números enteros */}
                    <InputGroup
                      label="Tiempo Juego (min)"
                      name="playMinutes"
                      type="text"
                      inputMode="numeric"
                      placeholder="60"
                      value={formData.playMinutes}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          handleChange(e);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <SectionLabel num="04" title="Reglas Especiales" />
                  <textarea
                    name="rules"
                    value={formData.rules}
                    placeholder="Escribe las normas..."
                    rows={4}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-dashed border-gray-200 focus:border-primary focus:bg-white outline-none px-4 py-3 rounded-xl transition-all resize-none text-sm text-black"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-8 py-3 font-bold text-sm text-gray-500 hover:text-gray-800"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center gap-2 ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                "Guardando..."
              ) : (
                <>
                  <Save size={16} /> Guardar Cancha
                </>
              )}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Sub-componentes internos (SectionLabel, InputGroup, CheckboxItem) se mantienen con los estilos anteriores...

const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-primary font-black text-xs uppercase tracking-widest">
      {num}. {title}
    </span>
  </div>
);

const InputGroup = ({ label, ...props }: any) => (
  <div className="group">
    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-gray-50 border-b-2 border-primary/10 focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 transition-all outline-none text-sm"
    />
  </div>
);

const CheckboxItem = ({ name, label, onChange, checked }: any) => (
  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 accent-primary rounded border-gray-300 transition-all"
    />
    <span className="text-xs font-semibold text-gray-600 group-hover:text-primary transition-colors">
      {label}
    </span>
  </label>
);
