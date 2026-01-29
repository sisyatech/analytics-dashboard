# Analytics Dashboard

A modern, high-performance analytics dashboard built with React, TypeScript, and Vite.

## 🚀 Tech Stack

This project leverages a modern stack for performance and developer experience:

### Core
- **[React](https://react.dev/)**: UI library
- **[TypeScript](https://www.typescriptlang.org/)**: Static type checking
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling
- **[Bun](https://bun.sh/)**: Fast all-in-one JavaScript runtime and package manager

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Motion](https://motion.dev/)**: Animation library
- **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons
- **[shadcn/ui](https://ui.shadcn.com/)**: Re-usable components built using Radix UI and Tailwind CSS

### State & Data Management
- **[Zustand](https://github.com/pmndrs/zustand)**: Small, fast and scalable bearbones state-management solutions
- **[TanStack Query](https://tanstack.com/query/latest)**: Powerful asynchronous state management
- **[TanStack Table](https://tanstack.com/table/latest)**: Headless UI for building tables

### Routing
- **[React Router](https://reactrouter.com/)**: Declarative routing for React

### Code Quality & Tools
- **[Biome](https://biomejs.dev/)**: Fast formatter and linter
- **[Husky](https://typicode.github.io/husky/)**: Git hooks
- **[Commitlint](https://commitlint.js.org/)**: Lint commit messages

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Start development server:**
   ```bash
   bun dev
   ```

3. **Build for production:**
   ```bash
   bun run build
   ```

## 📝 Git Commit Rules

We follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification. 
All commit messages are strictly enforced by Husky and Commitlint.

**Format:** `<type>: <description>`

**Common Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries (e.g., documentation generation)

**Examples:**
- ✅ `feat: add user authentication`
- ✅ `fix: resolve navigation issue`
- ❌ `added login` (Missing type)
- ❌ `Fixed bug` (Capitalized and past tense are discouraged, though config might allow content, type is key)
