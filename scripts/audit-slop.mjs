#!/usr/bin/env node
/**
 * WbMonster Starter — Anti-AI-Slop & Design Taste Linter (CLI)
 * Governança Canônica: Baseado nas skills Hallmark, VibeCurb, Taste-Skill e Prose Anti-Slop.
 * 
 * Uso:
 *   npm run audit:slop
 *   npm run audit:slop -- --staged
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// 1. Dicionário de Vocabulário Banido (Tier 1A & 1B - PT e EN)
const BANNED_WORDS = [
  { pattern: /\b(delve|delving|delves)\b/i, label: 'delve', fix: 'analisar / examinar / ver' },
  { pattern: /\b(tapestry)\b/i, label: 'tapestry (metáfora)', fix: 'descrever a complexidade real' },
  { pattern: /\b(testament to)\b/i, label: 'testament to', fix: 'mostra / prova / evidencia' },
  { pattern: /\b(testemunho de)\b/i, label: 'testemunho de', fix: 'prova / demonstração de' },
  { pattern: /\b(mergulh(ar|e|amos) fundo)\b/i, label: 'mergulhar fundo', fix: 'detalhar / examinar' },
  { pattern: /\b(beacon)\b/i, label: 'beacon (metáfora)', fix: 'referência / guia' },
  { pattern: /\b(pivotal)\b/i, label: 'pivotal', fix: 'importante / central / chave' },
  { pattern: /\b(supercharge|supercharging)\b/i, label: 'supercharge', fix: 'acelerar / melhorar' },
  { pattern: /\b(turbin(ar|e|ando))\b/i, label: 'turbinar', fix: 'otimizar / agilizar' },
  { pattern: /\b(unlock(ing)?)\b/i, label: 'unlock', fix: 'permitir / liberar / viabilizar' },
  { pattern: /\b(desbloque(ar|ie))\b/i, label: 'desbloquear (sentido abstrato)', fix: 'acessar / alcançar' },
  { pattern: /\b(cutting-edge)\b/i, label: 'cutting-edge', fix: 'moderno / recente / avançado' },
  { pattern: /\bde ponta\b(?!\s+a\s+ponta)/i, label: 'de ponta (clichê)', fix: 'moderno / avançado' },
  { pattern: /\b(foster(ing)?)\b/i, label: 'foster', fix: 'incentivar / criar / apoiar' },
  { pattern: /\b(fomentar)\b/i, label: 'fomentar (uso vago)', fix: 'estimular / promover' },
  { pattern: /\b(paradigm shift)\b/i, label: 'paradigm shift', fix: 'mudança de modelo' },
  { pattern: /\b(game-changer)\b/i, label: 'game-changer', fix: 'diferencial prático' },
];

// 2. Fórmulas Sintáticas e Padrões Retóricos Proibidos
const BANNED_PATTERNS = [
  {
    pattern: /(não é (apenas|somente|só)[^.,\n]+, (é|mas sim|trata-se de))/i,
    label: 'Contraste Binário ("Não é X, é Y")',
    fix: 'Afirme diretamente a verdade positiva sem negação prévia'
  },
  {
    pattern: /(it('s| is) not (just|only|about)[^.,\n]+, it('s| is))/i,
    label: 'Binary Contrast ("It\'s not X, it\'s Y")',
    fix: 'State the positive claim directly'
  },
  {
    pattern: /(o que ninguém te conta sobre)/i,
    label: 'Gancho Viral Sensacionalista',
    fix: 'Apresente o dado ou fato técnico diretamente'
  },
  {
    pattern: /(what nobody tells you about)/i,
    label: 'Sensationalist Viral Hook',
    fix: 'Present the technical insight directly'
  },
  {
    pattern: /(o futuro (não está chegando|já chegou))/i,
    label: 'Clichê Futurista Vazio',
    fix: 'Explique a evolução atual com fatos do setor'
  },
  {
    pattern: /(let that sink in|pense nisso por um momento)/i,
    label: 'Muleta Dramática Paternalista',
    fix: 'Remova e deixe o fato falar por si mesmo'
  },
  {
    pattern: /(no mundo acelerado de hoje|in today's fast-paced (world|landscape))/i,
    label: 'Garganteio Temporal Genérico',
    fix: 'Corte a introdução e comece no fato'
  },
  {
    pattern: /(vale a pena notar que|é importante ressaltar que)/i,
    label: 'Garganteio Retórico (Throat-clearing)',
    fix: 'Elimine a frase de abertura e vá direto ao ponto'
  },
];

// 3. Vícios de Front-End & UI Slop
const BANNED_UI_PATTERNS = [
  {
    pattern: /blur-[23]xl[^"']*(bg-purple-|bg-violet-|bg-indigo-)[^"']*/i,
    label: 'AI-Purple Glow (Radial Halo Artificial)',
    fix: 'Remova halos roxos artificiais; use iluminação tátil ou contraste natural'
  },
  {
    pattern: /animate-ping/i,
    label: 'Pill Badge com Ping Decorativo',
    fix: 'Remova ping artificial; use indicadores de status estáticos e semânticos'
  },
  {
    pattern: /radial-gradient\([^)]*(#7c3aed|#8b5cf6|#a855f7|purple|violet)[^)]*\)/i,
    label: 'Gradiente Radial Sintético de IA',
    fix: 'Adote paleta de cores corporativa ancorada no Brandkit (Stone/Zinc/Slate/Emerald/Navy)'
  }
];

const SCAN_EXTENSIONS = new Set(['.astro', '.tsx', '.jsx', '.html', '.md', '.mdx', '.vue', '.css']);
const IGNORE_DIRS = new Set(['node_modules', 'dist', '.git', '.astro', '.next', 'build', 'public', '.cache']);

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walkDir(path.join(dir, entry.name), fileList);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SCAN_EXTENSIONS.has(ext)) {
        fileList.push(path.join(dir, entry.name));
      }
    }
  }
  return fileList;
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];
  const isMarkdown = /\.(md|mdx)$/i.test(filePath);
  const isComponent = /\.(astro|tsx|jsx|html|vue|css)$/i.test(filePath);

  let inBlockComment = false;

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    let lineText = rawLine.trim();

    if (isComponent) {
      if (lineText.includes('/*') && !lineText.includes('*/')) {
        inBlockComment = true;
        return;
      }
      if (inBlockComment) {
        if (lineText.includes('*/')) inBlockComment = false;
        return;
      }
      if (lineText.startsWith('//') || (lineText.startsWith('<!--') && lineText.endsWith('-->'))) {
        return;
      }
      lineText = lineText.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/, '').trim();
    }

    if (isMarkdown) {
      const isGuidelineLine = /^(#|\||\*|-|\d+\.)\s*(veto|proibido|sem|anti-slop|regras|não use|banido)/i.test(lineText);
      const isQuotedExample = /["'`*].*["'`*]/.test(lineText) && /(veto|proibido|clichê|evitar)/i.test(lineText);
      if (isGuidelineLine || isQuotedExample) {
        return;
      }
    }

    if (!lineText) return;

    for (const rule of BANNED_WORDS) {
      if (rule.pattern.test(lineText)) {
        violations.push({
          type: 'VOCABULARY',
          severity: 'HIGH',
          line: lineNum,
          label: rule.label,
          snippet: rawLine.trim(),
          fix: rule.fix
        });
      }
    }

    for (const rule of BANNED_PATTERNS) {
      if (rule.pattern.test(lineText)) {
        violations.push({
          type: 'SYNTAX_SLOP',
          severity: 'CRITICAL',
          line: lineNum,
          label: rule.label,
          snippet: rawLine.trim(),
          fix: rule.fix
        });
      }
    }

    if (isComponent) {
      for (const rule of BANNED_UI_PATTERNS) {
        if (rule.pattern.test(lineText)) {
          violations.push({
            type: 'UI_SLOP',
            severity: 'MEDIUM',
            line: lineNum,
            label: rule.label,
            snippet: rawLine.trim(),
            fix: rule.fix
          });
        }
      }
    }

    const emDashCount = (lineText.match(/—/g) || []).length;
    if (emDashCount >= 2) {
      violations.push({
        type: 'PUNCTUATION',
        severity: 'LOW',
        line: lineNum,
        label: 'Excesso de Travessões (`—`) na mesma linha',
        snippet: rawLine.trim(),
        fix: 'Substitua por pontos finais ou orações coordenadas diretas'
      });
    }
  });

  return violations;
}

function main() {
  const args = process.argv.slice(2);
  let targetPath = process.cwd();
  let isStagedMode = false;

  for (const arg of args) {
    if (arg === '--staged') {
      isStagedMode = true;
    } else if (arg.startsWith('--target=')) {
      targetPath = path.resolve(arg.split('=')[1]);
    } else if (arg.startsWith('--path=' )) {
      targetPath = path.resolve(arg.split('=')[1]);
    } else if (!arg.startsWith('--')) {
      targetPath = path.resolve(arg);
    }
  }

  console.log(`\n${c.bold}${c.cyan}╔═══════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   WbMonster Anti-AI-Slop & Taste Quality Gate Auditor (CLI)       ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚═══════════════════════════════════════════════════════════════════╝${c.reset}\n`);

  let files = [];
  let baseDisplayPath = targetPath;

  if (isStagedMode) {
    console.log(`${c.dim}Modo:${c.reset} ${c.bold}${c.magenta}Git Staged Changes (Pre-commit Check)${c.reset}\n`);
    try {
      const gitOut = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' });
      const stagedFiles = gitOut.split('\n').map(s => s.trim()).filter(Boolean);
      files = stagedFiles
        .filter(f => SCAN_EXTENSIONS.has(path.extname(f).toLowerCase()))
        .map(f => path.resolve(process.cwd(), f))
        .filter(f => fs.existsSync(f));
      baseDisplayPath = process.cwd();
    } catch (e) {
      console.error(`${c.red}❌ Erro ao capturar arquivos staged do git: ${e.message}${c.reset}`);
      process.exit(1);
    }

    if (files.length === 0) {
      console.log(`${c.green}✔ Nenhum arquivo relevante (.astro, .tsx, .jsx, .md, .html) staged para auditoria.${c.reset}`);
      console.log(`${c.dim}Commit liberado com sucesso.${c.reset}\n`);
      process.exit(0);
    }
  } else {
    console.log(`${c.dim}Escaneando:${c.reset} ${c.bold}${targetPath}${c.reset}\n`);
    if (!fs.existsSync(targetPath)) {
      console.error(`${c.red}❌ Erro: Alvo não encontrado: ${targetPath}${c.reset}`);
      process.exit(1);
    }

    const stat = fs.statSync(targetPath);
    if (stat.isFile()) {
      files = [targetPath];
    } else {
      files = walkDir(targetPath);
    }
  }

  console.log(`${c.blue}ℹ️  Total de arquivos inspecionados:${c.reset} ${files.length}\n`);

  let totalViolations = 0;
  let filesWithViolations = 0;

  for (const file of files) {
    const relPath = path.relative(baseDisplayPath, file);
    const violations = auditFile(file);

    if (violations.length > 0) {
      filesWithViolations++;
      totalViolations += violations.length;

      console.log(`${c.bold}${c.red}✖ ${relPath}${c.reset} (${c.yellow}${violations.length} ocorrência(s)${c.reset})`);
      
      for (const v of violations) {
        const tagColor = v.severity === 'CRITICAL' ? c.bgRed : v.severity === 'HIGH' ? c.red : c.yellow;
        console.log(`  ${c.dim}L${v.line}:${c.reset} ${tagColor}${c.bold} [${v.type}] ${v.label} ${c.reset}`);
        console.log(`    ${c.dim}Trecho:${c.reset} "${c.white}${v.snippet.substring(0, 100)}${v.snippet.length > 100 ? '...' : ''}${c.reset}"`);
        console.log(`    ${c.green}↳ Sugestão De-AI:${c.reset} ${v.fix}\n`);
      }
    }
  }

  console.log(`${c.bold}───────────────────────────────────────────────────────────────────${c.reset}`);
  if (totalViolations === 0) {
    console.log(`${c.bold}${c.green}✔ PASS! 0 violações de AI-slop detectadas.${c.reset}`);
    console.log(`${c.dim}Todos os arquivos estão em conformidade com as diretrizes Hallmark, VibeCurb e Prose Anti-Slop.${c.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${c.bold}${c.red}FAIL: ${totalViolations} violações encontradas em ${filesWithViolations} arquivo(s).${c.reset}`);
    console.log(`${c.dim}Revise os trechos acima aplicando as sugestões canônicas de des-IAficação.${c.reset}\n`);
    process.exit(1);
  }
}

main();
