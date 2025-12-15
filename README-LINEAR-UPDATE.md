# Aktualizacja zadań w Linear - Instrukcja

## 🚀 Szybki start

### Krok 1: Uzyskaj Linear API Key

1. Przejdź do: https://linear.app/settings/api
2. Kliknij "Create API Key"
3. Skopiuj wygenerowany klucz

### Krok 2: Zaktualizuj status zadań w linear-tasks.json

Przed uruchomieniem skryptu, upewnij się, że w pliku `linear-tasks.json` zadania, które zostały ukończone, mają status `"Done"` zamiast `"Backlog"`.

Przykład:
```json
{
  "title": "Implement navigation from customer profile to transactions module",
  "priority": "P0",
  "status": "Done",  // <-- zmienione z "Backlog" na "Done"
  ...
}
```

### Krok 3: Uruchom aktualizację

```bash
# Ustaw API key
export LINEAR_API_KEY=lin_api_xxxxxxxxxxxxx

# Uruchom aktualizację
node update-linear-tasks.js
```

Lub w jednej linii:

```bash
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxx node update-linear-tasks.js
```

## 📋 Co zostanie zaktualizowane?

Skrypt:
1. Wczytuje zadania z `linear-tasks.json`
2. Filtruje zadania ze statusem `"Done"`
3. Wyszukuje odpowiadające im issues w Linear (po tytule)
4. Aktualizuje status w Linear na "Done"

## ⚙️ Jak to działa?

1. **Wyszukiwanie**: Skrypt wyszukuje issues w Linear po dokładnym tytule
2. **Sprawdzanie statusu**: Sprawdza, czy issue już nie jest oznaczone jako "Done"
3. **Aktualizacja**: Jeśli nie, aktualizuje status na "Done" w workflow Linear
4. **Raport**: Wyświetla podsumowanie zaktualizowanych zadań

## 🔍 Troubleshooting

### Błąd: "Issue not found in Linear"
- Zadanie może nie być jeszcze zaimportowane do Linear
- Uruchom najpierw `import-to-linear.js`, aby utworzyć issues
- Sprawdź, czy tytuł zadania w JSON dokładnie odpowiada tytułowi w Linear

### Błąd: "Could not find Done state"
- Upewnij się, że w Twoim workflow Linear istnieje stan "Done"
- Lub zmień nazwę stanu w Linear na "Done"
- Skrypt będzie próbował użyć pierwszego dostępnego stanu typu "completed"

### Błąd: "HTTP error! status: 401"
- Sprawdź, czy API key jest poprawny
- Upewnij się, że API key nie wygasł
- Sprawdź uprawnienia API key

## 📊 Przykładowy output

```
🚀 Starting Linear task status update...

📋 Found 4 completed task(s) to update:

   1. Implement navigation from customer profile to transactions module
   2. Create Login page with mock authentication
   3. Create 404 Not Found page
   4. Create Unauthorized access page

🔍 Finding issues in Linear...

[1/4] Processing: Implement navigation from customer profile to transactions module
   ✅ Updated to Done: https://linear.app/team/xxx/issue/xxx-123

[2/4] Processing: Create Login page with mock authentication
   ✅ Updated to Done: https://linear.app/team/xxx/issue/xxx-124

...

==================================================
📊 Update Summary
==================================================
✅ Successfully updated: 4 issue(s)
✅ Already done: 0 issue(s)
⚠️  Not found: 0 issue(s)
❌ Failed: 0 issue(s)

✅ Updated issues:
   - Implement navigation from customer profile to transactions module
     https://linear.app/team/xxx/issue/xxx-123
   ...

🎉 Done!
```

## 🔗 Przydatne linki

- [Linear API Documentation](https://developers.linear.app/docs)
- [Linear GraphQL API](https://developers.linear.app/docs/graphql)
- [Linear Settings](https://linear.app/settings/api)

---

*Gotowe do użycia! 🎉*
