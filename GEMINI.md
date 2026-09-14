# Governança Local de Design & Interfaces do Projeto

Este projeto institucional foi gerado via WbMonster Enterprise OS e segue obrigatoriamente as diretrizes da **Suite de 42 Skills de Design** disponíveis no ecossistema (`~/.gemini/config/skills/`).

## 1. Diretrizes de Construção e Alteração
- **Veto a AI Slop:** Proibido o uso de templates genéricos, cores roxas padrão, cards repetitivos e contrastes inacessíveis.
- **Tokens do Projeto:** Utilizar os tokens de cores, tipografia e espaçamento definidos no projeto (Stone, Slate, Zinc, Emerald ou Navy).
- **Componentes:** Sempre consultar [`component-patterns-code`](~/.gemini/config/skills/component-patterns-code/SKILL.md) para garantir matriz de 10 estados (hover, active, focus, disabled, loading, error, skeleton, empty).
- **Formulários & Validação:** Seguir [`form-design-encyclopedia`](~/.gemini/config/skills/form-design-encyclopedia/SKILL.md) para inputs acessíveis e feedback em tempo real.
- **Quality Gate Mandatório:** Antes de qualquer commit ou deploy, validar:
  1. Contraste de cores e foco de teclado via [`accessibility-inclusive-design`](~/.gemini/config/skills/accessibility-inclusive-design/SKILL.md).
  2. Checklist de usabilidade de 10 heurísticas via [`nng-ux-heuristics`](~/.gemini/config/skills/nng-ux-heuristics/SKILL.md).
  3. Detecção de anti-patterns com o linter nativo: `impeccable detect`.
