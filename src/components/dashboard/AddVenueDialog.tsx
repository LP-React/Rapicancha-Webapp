"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Save, CloudUpload, X, MapPin, Plus } from "lucide-react";
import { Dialog } from "@base-ui/react";
import { getCookie } from "cookies-next";
import { venueSchema, type VenueFormValues } from "@/lib/validations/venue";
import { VenueService } from "@/services/venue-service";
import { LocationPicker } from "./LocationPicker";
import { useRouter } from "next/navigation";

interface AddVenueDialogProps {
  trigger?: React.ReactNode;
}

export function AddVenueDialog({ trigger }: AddVenueDialogProps) {
  const router = useRouter(); // 2. Inicializarlo
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<VenueFormValues>>({
    latitude: -12.0463,
    longitude: -77.0427,
    providesEquipment: false,
    hasParking: false,
    hasLockerRoom: false,
    hasRestroom: false,
    hasStore: false,
    hasShower: false,
    providesBalls: false,
    providesBibs: false,
    parkingCapacity: 0,
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

    const authCookie = getCookie("auth_user");
    let ownerId: number | null = null;

    if (authCookie) {
      try {
        const userData = JSON.parse(authCookie as string);
        ownerId = userData.accountId;
      } catch (error) {
        console.error("Error al obtener ownerId de la cookie", error);
      }
    }

    if (!ownerId) {
      toast.error("Sesión expirada. Por favor, inicia sesión de nuevo.");
      return;
    }

    const validationData = {
      ...formData,
      ownerAccountId: ownerId,
      bannerImageUrl: selectedFile
        ? "https://temp.url"
        : formData.bannerImageUrl,
    };

    const result = venueSchema.safeParse(validationData);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      setIsSubmitting(true);
      let finalImageUrl = formData.bannerImageUrl;

      if (selectedFile) {
        toast.info("Subiendo imagen...");
        finalImageUrl = await uploadToCloudinary(selectedFile);
      }

      await VenueService.create({
        ...result.data,
        bannerImageUrl: finalImageUrl || "",
      });

      toast.success("¡Local registrado con éxito!");
      setOpen(false);
      router.refresh();
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || "Error en el proceso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
    );
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) throw new Error("Error al subir la imagen a Cloudinary");
    const data = await res.json();
    return data.secure_url;
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="outline-none">
        {trigger ? (
          trigger
        ) : (
          <div className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all cursor-pointer">
            <Plus size={18} /> Registrar Nuevo Local
          </div>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl bg-white rounded-2xl shadow-2xl z-70 overflow-hidden flex flex-col max-h-[95vh]">
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <Dialog.Title className="text-3xl font-black text-primary tracking-tight uppercase">
                Registrar Nuevo Local
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 font-medium mt-1">
                Completa los datos técnicos de la sede.
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </Dialog.Close>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-8 bg-white text-black"
          >
            {/* Grid Principal: 2 columnas en pantallas medianas hacia arriba */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {/* COLUMNA 1: Secciones 01, 03 y 04 */}
              <div className="space-y-4">
                {/* 01. Información General */}
                <div className="space-y-6">
                  <SectionLabel num="01" title="Información General" />
                  <div className="space-y-4">
                    <InputGroup
                      label="Nombre del Local"
                      name="name"
                      onChange={handleChange}
                      required
                    />
                    <InputGroup
                      label="Dirección"
                      name="address"
                      onChange={handleChange}
                      required
                    />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-b-2 border-primary/20 focus:border-primary outline-none px-4 py-3 rounded-t-lg transition-all resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 03. Horarios & Capacidad */}
                <div className="space-y-6">
                  <SectionLabel num="03" title="Horarios & Capacidad" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup
                      label="Apertura"
                      name="openTime"
                      type="time"
                      onChange={handleChange}
                      required
                    />
                    <InputGroup
                      label="Cierre"
                      name="closeTime"
                      type="time"
                      onChange={handleChange}
                      required
                    />
                    <InputGroup
                      label="Capacidad Max"
                      name="maxCapacity"
                      type="number"
                      onChange={handleChange}
                      required
                    />
                    <InputGroup
                      label="Parqueos (Slots)"
                      name="parkingCapacity"
                      type="number"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* 04. Amenidades */}
                <div className="space-y-6">
                  <SectionLabel num="04" title="Amenidades" />
                  <div className="grid grid-cols-2 gap-3">
                    <CheckboxItem
                      name="hasParking"
                      label="Cochera"
                      onChange={handleChange}
                    />
                    <CheckboxItem
                      name="hasShower"
                      label="Duchas"
                      onChange={handleChange}
                    />
                    <CheckboxItem
                      name="hasRestroom"
                      label="Baños"
                      onChange={handleChange}
                    />
                    <CheckboxItem
                      name="providesBalls"
                      label="Balones"
                      onChange={handleChange}
                    />
                    <CheckboxItem
                      name="providesEquipment"
                      label="Equipamiento"
                      onChange={handleChange}
                    />
                    <CheckboxItem
                      name="providesBibs"
                      label="Chalecos"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* COLUMNA 2: Sección 02 (Media & Ubicación) */}
              <div className="space-y-8">
                <SectionLabel num="02" title="Media & Ubicación" />

                {/* Banner Upload */}
                <div className="relative h-64 w-full group">
                  {/* Aumenté la altura a h-64 para que luzca mejor en su propia columna */}
                  {previewUrl ? (
                    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-md border border-gray-100">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all hover:border-primary/40">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CloudUpload className="w-12 h-12 text-gray-300 group-hover:text-primary mb-3 transition-colors" />
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">
                          Click para subir Banner
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          PNG, JPG o WEBP (Max. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                {/* Mapa */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={12} className="text-primary" /> Ubicación
                    Geográfica
                  </label>

                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <LocationPicker
                      lat={formData.latitude || -12.0463}
                      lng={formData.longitude || -77.0427}
                      onLocationChange={handleLocationChange}
                    />
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                        Latitud
                      </p>
                      <p className="text-xs font-mono font-bold text-primary">
                        {formData.latitude?.toFixed(6)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                        Longitud
                      </p>
                      <p className="text-xs font-mono font-bold text-primary">
                        {formData.longitude?.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

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
                  <Save size={16} /> Guardar Local
                </>
              )}
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ... (Sub-componentes SectionLabel, InputGroup, CheckboxItem se mantienen igual)

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
      className="w-full bg-gray-50 border-b-2 border-primary/10 focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 transition-all outline-none"
    />
  </div>
);

const CheckboxItem = ({ name, label, onChange }: any) => (
  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group">
    <input
      type="checkbox"
      name={name}
      onChange={onChange}
      className="w-4 h-4 accent-primary rounded border-gray-300 transition-all"
    />
    <span className="text-xs font-semibold text-gray-600 group-hover:text-primary transition-colors">
      {label}
    </span>
  </label>
);
