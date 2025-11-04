# Social Support Application (Vue 3 + Pinia)

A responsive, accessible, multi-step social support application with local draft saving and an OpenAI-powered "help me write" suggestion feature.

## Project Goal

This project demonstrates a structured multi-step social support application that collects user data and uses AI suggestions to assist in writing hardship descriptions.

---

## Features

* Multi-step form with validation (vee-validate + yup)
* Draft autosave to `localStorage` and submission snapshot
* OpenAI integration (via direct call or proxy) for AI suggestions
* Reusable UI components (BaseButton, BaseInput, BaseCard, BaseForm, etc.)
* RTL support (Arabic) and theme toggle (light/dark)
* Accessible components: labels, `aria-*`, keyboard-friendly modal and focus management
* Toast notifications, i18n (EN + AR), and well-structured code

---

## Quick start

### Requirements

* Node.js >= 18
* npm or yarn

### Install

```bash
npm install
# or
yarn
```

## Environment

Create a `.env` file at the project root. Supported variables:

```bash
VITE_OPENAI_KEY — OpenAI API key for direct calls  
VITE_MOCK_OPENAI — Generates mock data for suggestions when OpenAI is unavailable  
```

> If `VITE_MOCK_OPENAI=true`, the AI suggestion modal will generate mock responses instead of calling the OpenAI API.

Example `.env`:

```bash
VITE_OPENAI_KEY=sk-xxxx
VITE_API_BASE=https://api.example.com
```

---

## Run

```bash
npm run dev
# or
yarn dev
```

## Build

```bash
npm run build
# or
yarn build
```

## Preview

```bash
npm run preview
# or
yarn preview
```

---

## OpenAI Setup

### Direct (development only)

Set `VITE_OPENAI_KEY` in `.env`.

The client will call OpenAI directly.
Not recommended for production — use a secure backend proxy.

---

## Notes for Reviewers / Maintainers

* All UI components live under `components/` (`base/` and `global/`).
* Services are in `services/` — `api.service.ts` (HTTP client) and `openai.service.ts` (OpenAI wrapper).
* State management via Pinia stores in `stores/` — use `useFormStore` and `useUIStore`.
* i18n translations live under `locales/` (English & Arabic). Route titles use i18n keys.
* Toasts use a simple `useToast` composable and are teleported to `<body>`.

---

## Architecture & Decisions

### Architecture Summary

* **Frontend framework**: Vue 3 (`<script setup>`), Pinia for state, vee-validate + yup for forms.
* **Components**:

  * `components/base/*` reusable primitives (Button/Input/Select/Textarea/FormField/Card)
  * `components/global/*` overlays and utilities (Modal, Toasts, ProgressBar)
  * `components/wizard/*` handles multi-step flow (Container, Stepper, Nav)
* **Stores**:

  * `useFormStore`: handles form draft, submission, and persistence in one key (`social_application`)
  * `useUIStore`: manages theme and locale with localStorage sync
* **Services**:

  * `api.service.ts`: centralized Axios client with error normalization + toast notifications
  * `openai.service.ts`: wraps OpenAI integration (prefers proxy)
* **Composables**:

  * `useDynamicForm`: vee-validate abstraction
  * `useApplySuggestion`: integrates suggestion modal with form data
  * `useToast`: lightweight toast queue (teleported to body)
  * `useRouteTitle`: dynamic document titles on route + locale change

### Design Decisions

* **Single localStorage key** (`social_application`) simplifies versioning and persistence.
* **Proxy-first for OpenAI** to keep API secrets server-side.
* **Immediate validation** shows field validity as users type.
* **Teleport for overlays** ensures modals and toasts layer correctly.

---

## Future Improvements

1. **Accessibility**

   * Add a focus trap and `aria-live` regions for modals and toast announcements.
   * Improve keyboard navigation coverage (especially inside dialogs).

2. **Performance**

   * Introduce a light debounce (100–200ms) for validation on large forms.
   * Lazy-load step components only when visited.

3. **Testing**

   * Add unit tests for form validation and suggestion integration.
   * Add Cypress or Playwright e2e tests for the multi-step flow.

4. **User Experience**

   * Add progress summary on the final step before submission.
   * Allow users to download or print their submitted application.

5. **Architecture**

   * Refactor API integration to support multiple backends (OpenAI / Mock / Custom Proxy).
   * Extract global constants and validation schemas into reusable config files.

---
**Tech Stack:** Vue 3 · TypeScript · Pinia · Vee-Validate · Yup · TailwindCSS
