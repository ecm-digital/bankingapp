# Linear Import Instructions

## 📋 Pliki z zadaniami

Utworzyłem trzy pliki z zadaniami do importu do Linear:

1. **`linear-tasks.md`** - Format Markdown z pełnymi opisami
2. **`linear-tasks.json`** - Format JSON do importu przez API
3. **`linear-tasks.csv`** - Format CSV do szybkiego importu

## 🚀 Sposoby importu do Linear

### Metoda 1: Import ręczny (najprostsza)

1. Otwórz plik `linear-tasks.md`
2. Skopiuj zadania sekcja po sekcji
3. W Linear:
   - Kliknij "Create Issue"
   - Wklej tytuł i opis
   - Ustaw priorytet (P0/P1/P2)
   - Dodaj odpowiednie labels
   - Zapisz

### Metoda 2: Import przez CSV

1. W Linear, przejdź do **Settings** → **Import**
2. Wybierz opcję **Import from CSV**
3. Prześlij plik `linear-tasks.csv`
4. Zmapuj kolumny:
   - Title → Title
   - Priority → Priority
   - Status → Status
   - Description → Description
   - Labels → Labels (rozdzielone przecinkami)

### Metoda 3: Import przez Linear API (zaawansowane)

1. Zainstaluj Linear CLI lub użyj GraphQL API
2. Użyj pliku `linear-tasks.json`
3. Przykładowy skrypt:

```bash
# Wymaga Linear API key
npm install -g @linear/cli

# Lub użyj GraphQL API bezpośrednio
```

Przykład użycia Linear API:
```javascript
const tasks = require('./linear-tasks.json');

tasks.tasks.forEach(task => {
  // Wywołaj Linear GraphQL mutation
  // createIssue(title, description, priority, labels)
});
```

## 📊 Priorytety

- **P0** = 🔴 High Priority (Critical) - 4 zadania
- **P1** = 🟡 Medium Priority (High) - 6 zadań
- **P2** = 🟢 Low Priority (Medium) - 10 zadań

**Razem: 20 zadań**

## 🏷️ Labels do utworzenia w Linear

Przed importem utwórz następujące labels w projekcie:

- `frontend`
- `backend` (jeśli potrzebne)
- `testing`
- `accessibility`
- `performance`
- `documentation`
- `enhancement`
- `bug-fix` (jeśli potrzebne)
- `devops`

## 📝 Status Workflow

Sugerowany workflow w Linear:

1. **Backlog** - Początkowy stan (wszystkie zadania)
2. **Todo** - Gotowe do rozpoczęcia pracy
3. **In Progress** - W trakcie realizacji
4. **In Review** - Code review/testowanie
5. **Done** - Zakończone

## 🎯 Szybki start

**Najszybszy sposób:**
1. Otwórz `linear-tasks.csv` w Excel/Google Sheets
2. Przejrzyj zadania
3. Skopiuj pojedyncze zadania do Linear ręcznie (Ctrl+C, Ctrl+V)
4. Ustaw priorytet i labels

**Dla większej liczby zadań:**
- Użyj Linear API lub importu CSV

## 📌 Ważne uwagi

- Wszystkie zadania są w statusie **Backlog**
- Priorytety są ustawione zgodnie z ważnością
- Każde zadanie ma **Acceptance Criteria**
- Większość zadań ma wskazane pliki do modyfikacji
- Niektóre zadania wymagają dodatkowych bibliotek (wymienione w opisie)

## 🔗 Przydatne linki

- [Linear Import Documentation](https://linear.app/docs/import)
- [Linear API Documentation](https://developers.linear.app/docs)
- [Linear GraphQL API](https://developers.linear.app/docs/graphql)

---

*Wygenerowano: 2024-12-14*
*Projekt: Banking App*


