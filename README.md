# Bank Employee App Prototype 🏦

Nowoczesny prototyp aplikacji bankowej dla pracowników banku - demonstracja UX/UI dla portfolio senior product designera.

## 🎯 Cel Projektu

Prototyp aplikacji webowej prezentujący nowoczesne podejście do projektowania interfejsów dla systemów bankowych. Aplikacja demonstruje kluczowe przepływy pracy pracowników banku w obsłudze klientów.

**⚠️ UWAGA:** To jest prototyp UX/UI z mockowanymi danymi. Nie implementuje rzeczywistych funkcjonalności biznesowych ani połączeń z prawdziwymi systemami bankowymi.

## ✨ Funkcjonalności

### 📊 Dashboard
- Podsumowanie dziennych metryk (obsłużeni klienci, transakcje)
- Panel szybkich akcji
- Nadchodzące spotkania i powiadomienia
- Ostatnie transakcje z kolorowym kodowaniem

### 👥 Moduł Klientów
- Wyszukiwanie klientów w czasie rzeczywistym
- Szczegółowe profile klientów z avatarami
- Informacje o kontach (IBAN, SWIFT, salda)
- Edycja danych kontaktowych z walidacją
- Historia transakcji

### 💳 Moduł Transakcji
- Kreator transakcji (multi-step wizard)
- Obsługa przelewów, wpłat, wypłat, płatności
- Walidacja kwot i kont
- Generowanie potwierdzeń transakcji
- Historia z filtrami i sortowaniem

### 📋 System Kolejki
- Wyświetlanie oczekujących klientów
- Zarządzanie priorytetami (URGENT, HIGH, NORMAL, LOW)
- Timer obsługi klienta
- Statystyki kolejki w czasie rzeczywistym

### 💳 Moduł Kart
- Przegląd kart klienta z wizualizacją
- Szczegóły kart (limity, daty ważności)
- Blokowanie/odblokowanie kart
- Kreator wniosków o nowe karty

### 💰 Moduł Kredytów
- Lista aktywnych kredytów z postępem spłaty
- Harmonogramy spłat
- Kalkulator kredytowy
- Statystyki zadłużenia

### 🏦 Katalog Produktów
- Przeglądanie produktów bankowych
- Filtrowanie po kategoriach
- Produkty promocyjne
- Składanie wniosków

## 🛠️ Stack Technologiczny

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router v6
- **Animacje:** Framer Motion
- **Walidacja:** Zod + React Hook Form
- **Build Tool:** Vite
- **Icons:** Lucide React

## 🚀 Uruchomienie Projektu

### Wymagania
- Node.js 18+ 
- npm lub yarn

### Instalacja

```bash
# Instalacja zależności
npm install

# Uruchomienie dev servera
npm run dev

# Aplikacja dostępna na http://localhost:5173
```

### Dostępne Skrypty

```bash
npm run dev          # Uruchomienie development servera
npm run build        # Build produkcyjny
npm run preview      # Podgląd buildu produkcyjnego
npm run lint         # Linting kodu
```

## 📁 Struktura Projektu

```
src/
├── components/          # Komponenty React
│   ├── ui/             # Podstawowe komponenty UI (Button, Input, Card, Modal, Toast)
│   ├── cards/          # Komponenty modułu kart
│   ├── customers/      # Komponenty modułu klientów
│   ├── loans/          # Komponenty modułu kredytów
│   ├── products/       # Komponenty katalogu produktów
│   ├── queue/          # Komponenty systemu kolejki
│   └── transactions/   # Komponenty modułu transakcji
├── pages/              # Strony aplikacji (Dashboard, Customers, Transactions, etc.)
├── stores/             # Zustand stores (auth, customers, transactions, queue, products)
├── hooks/              # Custom React hooks (useAuth, useToast, useMediaQuery)
├── types/              # TypeScript types i interfaces
├── utils/              # Funkcje pomocnicze (formatters, animations, accessibility)
├── data/               # Mockowane dane (customers, transactions, products)
└── api/                # Mock API layer
```

## 🎨 Design System

### Kolory
- **Primary:** Niebieski (#0c87e8)
- **Success:** Zielony (#059669)
- **Warning:** Pomarańczowy (#ea580c)
- **Error:** Czerwony (#dc2626)

### Typografia
- **Font:** Inter
- **Monospace:** JetBrains Mono (dla numerów kont i kwot)

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🔐 Mockowane Dane

Aplikacja używa wygenerowanych danych testowych:
- 20+ klientów z pełnymi profilami
- 100+ transakcji z różnymi kategoriami
- Karty (debetowe, kredytowe, przedpłacone)
- Kredyty z harmonogramami spłat
- Produkty bankowe z promocjami

## 📱 Responsive Design

Aplikacja jest w pełni responsywna i zoptymalizowana dla:
- 📱 Smartfonów (portrait & landscape)
- 📱 Tabletów
- 💻 Laptopów
- 🖥️ Dużych ekranów

## ♿ Accessibility

- Semantic HTML
- ARIA labels i role attributes
- Keyboard navigation support
- Screen reader compatibility
- Wysokie kontrasty kolorów (WCAG 2.1 AA)
- Focus indicators

## 🎭 Animacje i UX

- Płynne przejścia między stronami (Framer Motion)
- Hover effects na interaktywnych elementach
- Loading states z skeleton screens
- Toast notifications dla feedback
- Micro-interactions
- Success/error animations

## 🧪 Testing

Framework testowy jest skonfigurowany i gotowy do użycia:
- Unit tests (React Testing Library)
- Integration tests
- Accessibility tests (axe-core)
- E2E tests (Cypress)

## 📦 Build i Deployment

```bash
# Build produkcyjny
npm run build

# Podgląd buildu
npm run preview
```

Build generuje zoptymalizowane pliki w folderze `dist/`:
- Code splitting
- Tree shaking
- Minifikacja
- Asset optimization

## 🎯 Kluczowe Cechy UX/UI

1. **Intuicyjny Dashboard** - Wszystkie kluczowe informacje na pierwszy rzut oka
2. **Szybkie Wyszukiwanie** - Real-time search z autouzupełnianiem
3. **Multi-step Wizards** - Prowadzenie użytkownika przez złożone procesy
4. **Wizualna Hierarchia** - Jasna struktura informacji
5. **Feedback Użytkownika** - Natychmiastowa odpowiedź na akcje
6. **Spójność** - Jednolite wzorce w całej aplikacji
7. **Responsywność** - Płynne działanie na wszystkich urządzeniach

## 📝 Dokumentacja

Szczegółowa dokumentacja projektu znajduje się w folderze `.kiro/specs/`:
- `requirements.md` - Wymagania funkcjonalne
- `design.md` - Dokument projektowy
- `tasks.md` - Plan implementacji
- `personas.md` - Persony użytkowników

## 🚧 Status Projektu

✅ **Ukończone (100%):**
- Wszystkie główne moduły funkcjonalne
- Design system i komponenty UI
- State management i mock API
- Animacje i micro-interactions
- Responsive design
- Accessibility features

## 👨‍💻 Autor

Senior Product Designer Portfolio Project

---

**Uwaga:** To jest prototyp demonstracyjny. Nie używać w środowisku produkcyjnym bez implementacji właściwych zabezpieczeń i funkcjonalności biznesowych.
