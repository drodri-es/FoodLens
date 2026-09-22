import React, { useState } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Bot, 
  User as UserIcon,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: {
    label: string;
    productId: string;
  };
}

const PRESET_QUERIES = [
  '¿Por qué los cereales Choco Crunch tienen un 76?',
  '¿Cuál producto tiene menos azúcar de los cereales?',
  'Busca una alternativa a los cereales con más fibra',
  '¿Qué significa que un alimento sea NOVA 4?'
];

export const FoodLensAssistantModal: React.FC = () => {
  const { isAssistantOpen, closeAssistant, openProductById } = useFoodLens();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy el asistente de FoodLens. Puedo responder dudas sobre la composición nutricional, aditivos o alternativas de los productos basándome estrictamente en datos contrastados.'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');

  if (!isAssistantOpen) return null;

  const handleSend = (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Formulate factual response grounded in our structured database
    setTimeout(() => {
      let botResponse = '';
      let action: { label: string; productId: string } | undefined = undefined;

      const q = query.toLowerCase();

      if (q.includes('76') || q.includes('choco crunch') || q.includes('por qué')) {
        botResponse = 'Los Cereales Choco Crunch obtienen 76/100 ("Buena opción") porque aportan 8,2 g de fibra y grano integral, con solo 1 aditivo seguro (lecitina de girasol). Su puntuación no es superior debido a que contiene 12 g de azúcar por 100 g y se elabora mediante extrusión industrial (NOVA 4).';
        action = { label: 'Ver ficha de Choco Crunch', productId: 'prod-cereales-choco-crunch' };
      } else if (q.includes('menos azúcar')) {
        botResponse = 'De los cereales analizados, los Copos de Avena Integral tienen apenas 0,7 g de azúcar intrínseco (sin azúcares añadidos), frente a los 12 g de Choco Crunch y los 28 g de Choco Puffs.';
        action = { label: 'Ver Avena en Copos (0,7g azúcar)', productId: 'prod-copos-avena-integral' };
      } else if (q.includes('fibra')) {
        botResponse = 'La mejor alternativa en contenido de fibra son los Copos de Avena Integral (10 g de fibra por 100 g, rica en betaglucanos saciantes). Supera en un 88% la media de su categoría.';
        action = { label: 'Ver Avena Integral (10g fibra)', productId: 'prod-copos-avena-integral' };
      } else if (q.includes('nova') || q.includes('procesamiento')) {
        botResponse = 'La clasificación NOVA divide los alimentos del 1 (sin procesar) al 4 (ultraprocesados). Un alimento NOVA 4 contiene ingredientes o procesos industriales como extrusión o emulsionantes. En FoodLens explicamos que NOVA 4 no significa automáticamente dañino, pero conviene que la base de la dieta provenga de NOVA 1 y 2.';
      } else {
        botResponse = 'FoodLens analiza cada producto en base a cuatro dimensiones: calidad nutricional (fibra, azúcares, sal), pureza de ingredientes, grado de procesamiento (NOVA) y evaluación toxicológica de aditivos según la EFSA europea.';
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: botResponse,
        suggestedAction: action
      };

      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Pregúntale a FoodLens</h2>
              <span className="text-[11px] text-stone-400">Respuestas basadas en datos nutricionales</span>
            </div>
          </div>
          <button
            onClick={closeAssistant}
            className="w-8 h-8 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-600 hover:bg-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-br-xs'
                    : 'bg-stone-100 text-stone-800 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>

              {m.suggestedAction && (
                <button
                  onClick={() => {
                    closeAssistant();
                    openProductById(m.suggestedAction!.productId);
                  }}
                  className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  {m.suggestedAction.label}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Suggested chips */}
        <div className="p-3 border-t border-stone-100 bg-stone-50 overflow-x-auto no-scrollbar flex gap-2">
          {PRESET_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-[11px] font-medium text-stone-700 whitespace-nowrap hover:bg-stone-100 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="p-3 border-t border-stone-100 flex items-center gap-2 bg-white"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Pregunta sobre cualquier alimento..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-100 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-emerald-600 disabled:opacity-40 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
