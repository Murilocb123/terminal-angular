# 🖥️ ng-terminal-simulator

Uma biblioteca Angular que fornece componentes de terminal altamente customizáveis que simulam interfaces de terminais reais de diferentes sistemas operacionais.

## 📋 Sobre o Projeto

**ng-terminal-simulator** é uma biblioteca de componentes Angular que permite integrar simuladores de terminal em suas aplicações web. Com suporte a temas e estilos personalizáveis, oferece uma experiência visual autêntica de diferentes ambientes de terminal.

### 🎯 Componentes Disponíveis

- **TerminalMac** 🍎 - Simula o terminal do macOS com estilo nativo (dark/light mode)
- **TerminalWindows** 🪟 - Simula o Command Prompt e PowerShell do Windows (dark/light mode)
- **TerminalLinux** 🐧 (em desenvolvimento)

---

## 🚀 Quick Start

### 1️⃣ Instalação

Instale a biblioteca via npm:

```bash
npm install @murilocb123/ng-terminal-simulator
```

### 2️⃣ Importação no seu componente

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

#### Terminal macOS

```html
<ng-terminal-simulator-mac
  [textContent]="'$ welcome to my terminal'"
  [theme]="'dark'"
  [username]="'developer'"
  [hostname]="'MacBook-Pro'"
></ng-terminal-simulator-mac>
```

#### Terminal Windows (Command Prompt)

```html
<ng-terminal-simulator-windows
  [textContent]="'echo Hello World'"
  [theme]="'dark'"
  [interpreter]="'cmd'"
  [path]="'C:\\Users\\developer'"
></ng-terminal-simulator-windows>
```

#### Terminal Windows (PowerShell)

```html
<ng-terminal-simulator-windows
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
></ng-terminal-simulator-windows>
```

---

## 💻 Desenvolvimento Local

### 🚀 Publicação

Siga estes passos para publicar a biblioteca:

```bash
# 1️⃣ Build da biblioteca
ng build ng-terminal-simulator

# 2️⃣ Publicar no npm
npm publish ng-terminal-simulator --access public
```

Sucesso! 🎉 A biblioteca está disponível no npm e pode ser instalada por qualquer um:

```bash
npm install @murilocb123/ng-terminal-simulator
```

## 🗂️ Estrutura do Projeto

```
terminal-angular/
├── projects/
│   └── ng-terminal-simulator/
│       ├── src/
│       │   ├── lib/
│       │   │   └── components/
│       │   │       └── terminal-mac/
│       │   │           ├── terminal-mac.ts
│       │   │           ├── terminal-mac.html
│       │   │           ├── terminal-mac.scss
│       │   │           └── terminal-mac.spec.ts
│       │   └── public-api.ts
│       ├── package.json
│       └── ng-package.json
├── src/
│   ├── app/
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
└── README.md
```
---

## 🔄 Roadmap

- [x] TerminalMac 🍎
- [x] TerminalWindows 🪟
- [ ] TerminalLinux 🐧
- [ ] Suporte a input interativo
- [X] Animações de digitação

---

## 📚 Additional Resources

- [Angular CLI Overview](https://angular.dev/tools/cli)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)

