# Lista Zadań Do Wykonania 📋

Lista zadań i ulepszeń dla prototypu aplikacji bankowej.

## 🔴 Wysoki Priorytet

### 1. Nawigacja między modułami
- [x] **Implementacja nawigacji z profilu klienta do modułu transakcji** ✅
  - Lokalizacja: `src/pages/Customers.tsx` (linie 144, 156)
  - ✅ Dodano `useNavigate` z React Router
  - ✅ Nawigacja z przycisku "New Transaction" w BalanceCard
  - ✅ Nawigacja z "View All" w RecentTransactions z filtrem dla klienta
  - ✅ Dodano przekazywanie customerId jako parametr URL lub state

### 2. Strona logowania (UI Prototyp)
- [x] **Implementacja strony logowania z mockowaną autoryzacją** ✅
  - Lokalizacja: `src/pages/Login.tsx` (utworzono nowy plik)
  - ✅ Formularz logowania z walidacją (email/password lub employee ID)
  - ✅ Mockowana autoryzacja (np. hardcoded credentials dla demo)
  - ✅ Integracja z authStore
  - ✅ Przekierowanie do dashboardu po zalogowaniu
  - ✅ Design zgodny z design systemem aplikacji

### 3. Strona 404 (Błąd - Nie znaleziono)
- [x] **Poprawienie strony 404 z lepszym UX** ✅
  - Lokalizacja: `src/pages/NotFound.tsx` (utworzono nowy plik)
  - ✅ Przyjazny komunikat błędu
  - ✅ Przycisk powrotu do dashboardu
  - ✅ Ilustracja/ikonka błędu
  - ✅ Sugestie popularnych stron

### 4. Strona Unauthorized
- [x] **Implementacja strony braku dostępu** ✅
  - Lokalizacja: `src/pages/Unauthorized.tsx` (utworzono nowy plik)
  - ✅ Komunikat o braku uprawnień
  - ✅ Możliwość powrotu lub wylogowania
  - ✅ Design zgodny z aplikacją

## 🟡 Średni Priorytet

### 5. Testy jednostkowe
- [ ] **Napisanie podstawowych testów dla kluczowych komponentów**
  - Testy dla komponentów UI (Button, Input, Card, Modal)
  - Testy dla komponentów biznesowych (CustomerProfile, TransactionWizard)
  - Testy dla custom hooks (useAuth, useToast, useCustomers)
  - Testy dla stores (authStore, customersStore)
  - Konfiguracja coverage thresholds

### 6. Testy integracyjne
- [ ] **Testy przepływów użytkownika**
  - Test logowania i nawigacji
  - Test wyszukiwania klienta
  - Test procesu transakcji (wizard)
  - Test zarządzania kolejką

### 7. Accessibility (A11y) - Dopracowanie
- [ ] **Audyt i poprawki dostępności**
  - Testowanie z screen readerami (NVDA, JAWS, VoiceOver)
  - Sprawdzenie wszystkich formularzy pod kątem ARIA labels
  - Testowanie nawigacji klawiaturą
  - Weryfikacja kontrastów kolorów (WCAG 2.1 AA)
  - Focus management w modalach

### 8. Optymalizacja wydajności
- [ ] **Analiza i optymalizacja bundle size**
  - Code splitting dla route'ów (React.lazy)
  - Lazy loading dla ciężkich komponentów
  - Optymalizacja obrazów (jeśli są)
  - Tree shaking verification
  - Bundle analysis (webpack-bundle-analyzer)

### 9. Error Handling - Ulepszenia
- [ ] **Poprawa obsługi błędów**
  - Lepsze komunikaty błędów dla użytkownika
  - Error logging (console w prototypie)
  - Retry mechanisms dla failed operations
  - Graceful degradation

### 10. Dokumentacja komponentów
- [ ] **Dokumentacja Storybook (opcjonalnie)**
  - Setup Storybook
  - Stories dla głównych komponentów
  - Dokumentacja props i użycia
  - Przykłady użycia

## 🟢 Niski Priorytet / Ulepszenia

### 11. Dodatkowe funkcjonalności UI
- [ ] **Eksport danych do PDF/CSV**
  - Generowanie PDF dla potwierdzeń transakcji
  - Eksport historii transakcji do CSV
  - Eksport raportów do PDF

### 12. Ulepszenia UX
- [ ] **Keyboard shortcuts**
  - Skróty klawiszowe dla najczęstszych akcji
  - / - focus search
  - Ctrl+K - command palette (opcjonalnie)

- [ ] **Dark mode (opcjonalnie)**
  - Implementacja dark mode theme
  - Toggle w settings
  - Persystencja preferencji

### 13. Dodatkowe komponenty
- [ ] **Date picker component**
  - Własny komponent lub integracja biblioteki
  - Użycie w filtrach daty

- [ ] **Data table z zaawansowanymi funkcjami**
  - Sortowanie wielu kolumn
  - Export do CSV
  - Zaawansowane filtrowanie

### 14. Internationalization (i18n) - Rozszerzenie
- [ ] **Dodanie więcej języków**
  - Obecnie tylko polski i angielski (sprawdź translations.ts)
  - Dodanie kolejnych języków jeśli potrzebne

### 15. Animacje - Dopracowanie
- [ ] **Dodatkowe micro-interactions**
  - Loading states dla async operations
  - Success animations
  - Skeleton screens dla wszystkich loading states

### 16. Mobile optimizations
- [ ] **Optymalizacja dla urządzeń mobilnych**
  - Pull-to-refresh (już może być, sprawdź)
  - Swipe gestures
  - Touch optimizations
  - Bottom navigation bar dla mobile

### 17. Performance monitoring
- [ ] **Dodanie tracking Core Web Vitals**
  - Web Vitals tracking
  - Performance monitoring
  - Error tracking (w prototypie - console)

### 18. CI/CD Pipeline
- [ ] **Setup CI/CD (jeśli nie jest)**
  - GitHub Actions / GitLab CI
  - Automatyczne testy
  - Automatyczny build
  - Deploy na staging/production

## 📝 Uwagi

- **Priorytet 1-4**: Krytyczne dla podstawowej funkcjonalności
- **Priorytet 5-10**: Ważne dla jakości kodu i UX
- **Priorytet 11-18**: Nice-to-have, ulepszenia

## ✅ Status

- **Zakończone zadania podstawowe**: Wszystkie główne moduły są zaimplementowane
- **Gotowe do demo**: Aplikacja jest gotowa do prezentacji jako prototyp UX/UI
- **✅ Ukończone (2024-12-14)**: 
  - ✅ Nawigacja między modułami
  - ✅ Strona logowania
  - ✅ Strona 404
  - ✅ Strona Unauthorized
- **Wymaga dopracowania**: Testy, optymalizacja, dokumentacja

---
*Ostatnia aktualizacja: $(date)*

