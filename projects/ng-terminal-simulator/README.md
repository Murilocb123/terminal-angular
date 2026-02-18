# 🖥️ ng-terminal-simulator

Uma biblioteca Angular com componentes de terminal customizaveis que simulam interfaces reais de diferentes sistemas operacionais.

## 📋 Sobre o Projeto

**ng-terminal-simulator** permite integrar simuladores de terminal em suas aplicacoes web. Oferece temas, estilos e animacoes de digitacao configuraveis.

### 🎯 Componentes Disponiveis

- **TerminalMac** 🍎 - Terminal estilo macOS (dark/light mode)
- **TerminalWindows** 🪟 - Command Prompt e PowerShell (dark/light mode)

---

## 🚀 Quick Start

### 1️⃣ Instalacao

```bash
npm install @murilocb123/ng-terminal-simulator
```

### 2️⃣ Importacao no seu componente

```typescript
import { Component } from '@angular/core';
import { TerminalMac, TerminalWindows } from '@murilocb123/ng-terminal-simulator';

@Component({
  selector: 'app-root',
  imports: [TerminalMac, TerminalWindows],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {}
```

### 3️⃣ Uso no template

#### Terminal macOS 🍎

```html
<lib-terminal-mac
  [textContent]="'$ welcome to my terminal'"
  [theme]="'dark'"
  [username]="'developer'"
  [hostname]="'MacBook-Pro'"
></lib-terminal-mac>
```

#### Terminal Windows (Command Prompt) 🪟

```html
<lib-terminal-windows
  [textContent]="'echo Hello World'"
  [theme]="'dark'"
  [interpreter]="'cmd'"
  [path]="'C:\\Users\\developer'"
></lib-terminal-windows>
```

#### Terminal Windows (PowerShell) 🪟

```html
<lib-terminal-windows
  [textContent]="'Get-ChildItem | Select-Object Name'"
  [theme]="'light'"
  [interpreter]="'powershell'"
  [path]="'C:\\Projects\\MyApp'"
  [terminalStyle]="{
    linePrompt: {
      ps: { color: '#0078D4' },
      path: { color: '#000000' }
    }
  }"
></lib-terminal-windows>
```

#### Controles de animacao ✨

```html
<lib-terminal-mac
  [textContent]="'npm run build'"
  [enableAnimations]="true"
  [typingMinMs]="30"
  [typingMaxMs]="90"
  [linePauseMs]="250"
  [initialDelayMs]="600"
  [cursorBlinkMs]="450"
></lib-terminal-mac>
```

---

## ✅ Requisitos

- Angular 21 (peerDependencies: @angular/core e @angular/common ^21.1.0)
- Componentes sao standalone e podem ser usados direto no `imports`

---

## 🧩 API

### Seletores 🔎

- `lib-terminal-mac`
- `lib-terminal-windows`

### Inputs compartilhados 🧰

- `textContent`: string
- `theme`: `'light' | 'dark'`
- `fontSize`: number
- `promptSymbol`: string
- `enableAnimations`: boolean
- `terminalStyle`: `TerminalStyleConfig`
- `typingMinMs`: number
- `typingMaxMs`: number
- `linePauseMs`: number
- `initialDelayMs`: number
- `cursorBlinkMs`: number

Observacao: quando `enableAnimations` e `false`, o texto e renderizado completo sem animacao.

### Inputs do TerminalMac 🍎

- `username`: string
- `at`: string
- `hostname`: string
- `tilde`: string
- `interpreter`: string

### Inputs do TerminalWindows 🪟

- `path`: string
- `interpreter`: `'cmd' | 'powershell'`
- `shellPrefix`: string (usado no PowerShell)

### Tipos exportados 📦

- `TerminalStyleConfig`
- `AnimationConfig`

Exemplo de `terminalStyle`:

```typescript
const style: TerminalStyleConfig = {
  content: { color: '#f1f1f1' },
  linePrompt: {
    username: { color: '#98c379' },
    hostname: { color: '#61afef' },
    promptSymbol: { color: '#e06c75' }
  }
};
```
