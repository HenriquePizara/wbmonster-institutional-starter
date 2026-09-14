import React, { useState } from 'react';

interface ScopeOption {
  id: string;
  name: string;
  basePriceEstimate: string;
  timeframe: string;
  deliverables: string[];
}

const SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'diagnostico',
    name: 'Diagnóstico Arquitetural & Auditoria',
    basePriceEstimate: 'De 3 a 5 dias úteis',
    timeframe: 'Entrega em 7 dias',
    deliverables: [
      'Mapeamento completo de vulnerabilidades e gargalos',
      'Relatório de conformidade com boas práticas e segurança',
      'Matriz de priorização de melhorias técnicas'
    ]
  },
  {
    id: 'implantacao',
    name: 'Implantação Completa de Governança',
    basePriceEstimate: 'De 2 a 4 semanas',
    timeframe: 'Cronograma faseado',
    deliverables: [
      'Isolamento em contêineres e deploy contínuo em PaaS privada',
      'Monitoramento 24/7 com sentinela de cotas e alertas',
      'Esteira de qualidade automatizada (Lighthouse CI)'
    ]
  },
  {
    id: 'reforma',
    name: 'Migração & Modernização de Sistemas Legados',
    basePriceEstimate: 'Sob medida com base no volume',
    timeframe: 'Zero-Downtime garantido',
    deliverables: [
      'Migração assistida sem interrupção de operações',
      'Conversão de arquitetura legada para microsserviços/Astro',
      'Homologação assistida com testes de estresse'
    ]
  }
];

export const InteractiveSimulator: React.FC = () => {
  const [selectedScope, setSelectedScope] = useState<string>('diagnostico');
  const [companySize, setCompanySize] = useState<string>('pequena');
  const [hasUrgency, setHasUrgency] = useState<boolean>(false);

  const currentOption = SCOPE_OPTIONS.find((opt) => opt.id === selectedScope) || SCOPE_OPTIONS[0];

  const whatsappMessage = encodeURIComponent(
    `Olá! Realizei uma estimativa no simulador do site para o escopo "${currentOption.name}", porte "${companySize}"${hasUrgency ? ' (com urgência operacional)' : ''}. Gostaria de alinhar os detalhes técnicos.`
  );

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Painel de Controles da Ilha Interativa */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              1. Selecione o Tipo de Demanda Técnica:
            </label>
            <div className="space-y-2">
              {SCOPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedScope(opt.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    selectedScope === opt.id
                      ? 'bg-stone-900 text-stone-50 border-stone-900 font-medium'
                      : 'bg-stone-50/70 text-stone-800 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                >
                  <span>{opt.name}</span>
                  {selectedScope === opt.id && (
                    <span className="text-xs bg-stone-800 text-stone-200 px-2 py-0.5 rounded-md">
                      Ativo
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              2. Porte da Operação / Complexidade:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pequena', label: 'Até 20 usuários' },
                { id: 'media', label: '21 a 100 usuários' },
                { id: 'corporativa', label: 'Acima de 100' }
              ].map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setCompanySize(size.id)}
                  className={`px-3 py-2.5 rounded-lg border text-xs text-center transition-colors cursor-pointer ${
                    companySize === size.id
                      ? 'bg-stone-800 text-white border-stone-800 font-semibold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-700 select-none">
              <input
                type="checkbox"
                checked={hasUrgency}
                onChange={(e) => setHasUrgency(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
              />
              <span>Necessidade de início imediato (Plantão / Regime de Urgência)</span>
            </label>
          </div>
        </div>

        {/* Resumo Dinâmico e Projeção do Escopo */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-stone-50/80 border border-stone-200 rounded-xl p-6 sm:p-8">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block">
              Projeção de Execução
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mt-2">
              {currentOption.name}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 my-6 py-4 border-y border-stone-200/80">
              <div>
                <span className="block text-xs text-stone-500">Estimativa de Prazo</span>
                <span className="font-serif font-bold text-stone-900 text-base">
                  {currentOption.timeframe}
                </span>
              </div>
              <div>
                <span className="block text-xs text-stone-500">Dedicação Técnica</span>
                <span className="font-serif font-bold text-stone-900 text-base">
                  {currentOption.basePriceEstimate}
                </span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Entregáveis Técnicos Assegurados:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                {currentOption.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-stone-900 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-200/80">
            <a
              href={`https://wa.me/5511999999999?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-lg bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 transition-colors cursor-pointer shadow-xs gap-2"
            >
              Iniciar Conversa sobre este Escopo &rarr;
            </a>
            <span className="block text-center text-[11px] text-stone-500 mt-2">
              Sem compromisso de contratação. Resposta técnica em horário comercial.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
