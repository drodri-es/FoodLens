import React, { useState } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { X, Camera, CheckCircle2, AlertTriangle } from 'lucide-react';

const ERROR_FIELDS = [
  'Nombre',
  'Imagen',
  'Ingredientes',
  'Información nutricional',
  'Cantidad',
  'Código',
  'Categoría',
  'Otros'
];

export const ReportErrorModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal, currentProduct, showToast } = useFoodLens();
  
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [comments, setComments] = useState<string>('');
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isReportModalOpen) return null;

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      showToast('Gracias. Revisaremos la información en menos de 24h', 'success');
      setSubmitted(false);
      setSelectedFields([]);
      setComments('');
      setHasPhoto(false);
      closeReportModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              ¿Qué información es incorrecta?
            </h2>
            <span className="text-xs text-stone-500 truncate block max-w-[240px]">
              {currentProduct?.name || 'Reportar producto'}
            </span>
          </div>
          <button
            onClick={closeReportModal}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3 animate-bounce" />
            <h3 className="font-extrabold text-base text-stone-900 mb-1">¡Gracias por tu ayuda!</h3>
            <p className="text-xs text-stone-500 max-w-xs">
              Nuestro equipo y la comunidad de Open Food Facts revisarán la etiqueta aportada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <span className="text-xs font-semibold text-stone-700 block">
              Selecciona los campos con discrepancias:
            </span>

            {/* Field chips */}
            <div className="flex flex-wrap gap-2">
              {ERROR_FIELDS.map(f => {
                const isSelected = selectedFields.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleField(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* Photo upload trigger */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-stone-700 block mb-1.5">
                Fotografiar etiqueta correcta (opcional):
              </span>
              <button
                type="button"
                onClick={() => {
                  setHasPhoto(!hasPhoto);
                  showToast(hasPhoto ? 'Foto retirada' : 'Foto de etiqueta adjuntada', 'info');
                }}
                className={`w-full h-20 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-colors ${
                  hasPhoto 
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800' 
                    : 'border-stone-300 hover:border-stone-400 bg-stone-50 text-stone-600'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs font-medium">
                  {hasPhoto ? '✓ Foto de etiqueta adjunta' : 'Toca para fotografiar la etiqueta real'}
                </span>
              </button>
            </div>

            {/* Details comment */}
            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-1.5">
                Comentarios o aclaraciones:
              </span>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Ejemplo: La receta ha cambiado recientemente y ahora tiene 10g de azúcar en lugar de 12g..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-emerald-500 placeholder:text-stone-400"
              />
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={selectedFields.length === 0 && !comments && !hasPhoto}
                className="w-full h-12 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-xs transition-colors"
              >
                Enviar reporte
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
