import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
    siteSettings: singleton({
      label: 'Configurações Globais & Autoridade',
      path: 'src/content/settings/site',
      schema: {
        name: fields.text({ label: 'Nome da Empresa' }),
        legalName: fields.text({ label: 'Razão Social' }),
        taxId: fields.text({ label: 'CNPJ' }),
        councilRegistration: fields.text({ label: 'Registro Profissional / Conselho de Classe' }),
        email: fields.text({ label: 'E-mail Comercial' }),
        phone: fields.text({ label: 'Telefone Principal' }),
        whatsapp: fields.text({ label: 'WhatsApp com DDD (somente números)' }),
        address: fields.text({ label: 'Endereço Físico Completo' }),
        workingHours: fields.text({ label: 'Horário de Atendimento' }),
        city: fields.text({ label: 'Cidade / Estado' }),
      },
    }),
    homeHero: singleton({
      label: 'Homepage — Hero Editorial',
      path: 'src/content/home/hero',
      schema: {
        authorityBadge: fields.text({ label: 'Badge Superior de Autoridade' }),
        titleMain: fields.text({ label: 'Título Principal (H1 Editorial)' }),
        subtitle: fields.text({
          label: 'Subtítulo Concreto (Sem clichês de IA)',
          multiline: true,
        }),
        primaryCtaText: fields.text({ label: 'Texto do Botão Primário' }),
        primaryCtaLink: fields.text({ label: 'Destino do Botão Primário' }),
        secondaryCtaText: fields.text({ label: 'Texto do Botão Secundário' }),
        secondaryCtaLink: fields.text({ label: 'Destino do Botão Secundário' }),
      },
    }),
  },
  collections: {
    services: collection({
      label: 'Soluções & Escopos Técnicos',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Título do Serviço' } }),
        shortDescription: fields.text({
          label: 'Descrição Direta',
          multiline: true,
        }),
        scopeItems: fields.array(
          fields.text({ label: 'Entregável / Atividade do Escopo' }),
          {
            label: 'Itens do Escopo Técnico',
            itemLabel: (props) => props.value || 'Novo item',
          }
        ),
      },
    }),
    testimonials: collection({
      label: 'Depoimentos & Prova Social Real',
      slugField: 'author',
      path: 'src/content/testimonials/*',
      format: { data: 'json' },
      schema: {
        author: fields.slug({ name: { label: 'Nome do Cliente' } }),
        role: fields.text({ label: 'Cargo do Cliente' }),
        company: fields.text({ label: 'Empresa / Negócio' }),
        quote: fields.text({
          label: 'Depoimento Literal (Sem edições artificiais)',
          multiline: true,
        }),
        year: fields.text({ label: 'Ano de Início da Parceria' }),
      },
    }),
    faq: collection({
      label: 'FAQ Estruturado (SEO Schema.org)',
      slugField: 'question',
      path: 'src/content/faq/*',
      format: { data: 'json' },
      schema: {
        question: fields.slug({ name: { label: 'Pergunta Frequente' } }),
        answer: fields.text({
          label: 'Resposta Objetiva',
          multiline: true,
        }),
      },
    }),
  },
});
