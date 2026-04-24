import {
  MoveRight,
  Lightbulb,
  Ungroup,
  BalloonIcon,
  ImageIcon,
} from "lucide-react";

export function SportCourtCard({ court }: { court: any }) {
  const mainImage =
    court.images && court.images.length > 0 ? court.images[0].imageUrl : null;
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/10 group hover:border-primary/20 transition-all">
      <div className="aspect-video w-full rounded-2xl overflow-hidden mb-5 bg-surface-container relative">
        {mainImage ? (
          <img
            src={mainImage}
            alt={court.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <ImageIcon size={48} className="text-white/50" />
          </div>
        )}

        {/* Badges de techado/iluminación se mantienen igual */}
        <div className="absolute top-4 left-4 flex gap-2">
          {/* ... lighting & roof icons */}
        </div>

        {/* Contador de fotos */}
        {court.images?.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-bold">
            + {court.images.length - 1} fotos
          </div>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-start">
          <h4 className="font-black text-xl text-on-surface uppercase tracking-tight leading-none">
            {court.name}
          </h4>
          <span className="text-primary font-black text-lg">
            S/ {court.rate}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded-md uppercase">
            {court.sportType}
          </span>
          <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md uppercase">
            {court.surfaceType}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-dashed border-outline-variant/20 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        <span>{court.slotMinutes} MIN / Turno</span>
        <button className="flex items-center gap-1 text-primary hover:gap-2 transition-all">
          Detalles <MoveRight size={14} />
        </button>
      </div>
    </div>
  );
}
