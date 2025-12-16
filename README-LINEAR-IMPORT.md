# Import zadań do Linear - Instrukcja

## 🚀 Szybki start

### Krok 1: Uzyskaj Linear API Key

1. Przejdź do: https://linear.app/settings/api
2. Kliknij "Create API Key"
3. Skopiuj wygenerowany klucz

### Krok 2: Uruchom import

```bash
# Ustaw API key
export LINEAR_API_KEY=lin_api_xxxxxxxxxxxxx

# Uruchom import
node import-to-linear.js
```

Lub w jednej linii:

```bash
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxx node import-to-linear.js
```

## 📋 Co zostanie zaimportowane?

- **20 zadań** z pliku `linear-tasks.json`
- **Priorytety**: P0 (4), P1 (6), P2 (10)
- **Labels**: frontend, testing, accessibility, performance, etc.
- **Status**: Wszystkie zadania będą w statusie "Backlog"

## ⚙️ Konfiguracja

### Zmiana team key

Domyślnie skrypt szuka teamu o kluczu "BANK". Jeśli Twój team ma inny klucz:

1. Otwórz `import-to-linear.js`
2. Znajdź linię: `const { teamId, labels } = await getTeamAndLabels('BANK');`
3. Zmień 'BANK' na klucz Twojego teamu

### Labels

Przed importem upewnij się, że w Linear masz utworzone następujące labels:
- `frontend`
- `testing`
- `accessibility`
- `performance`
- `documentation`
- `enhancement`
- `devops`

## 🔍 Troubleshooting

### Błąd: "Could not find team"
- Sprawdź, czy team o kluczu "BANK" istnieje w Twoim workspace
- Lub zmień klucz teamu w skrypcie

### Błąd: "Label not found"
- Utwórz brakujące labels w Linear przed importem
- Lub usuń je z listy labels w `linear-tasks.json`

### Błąd: "HTTP error! status: 401"
- Sprawdź, czy API key jest poprawny
- Upewnij się, że API key nie wygasł

## 📊 Po imporcie

Po zakończeniu importu zobaczysz:
- Listę utworzonych issues z linkami
- Podsumowanie (ile sukcesów, ile błędów)
- Linki do każdego utworzonego issue w Linear

## 🔗 Przydatne linki

- [Linear API Documentation](https://developers.linear.app/docs)
- [Linear GraphQL API](https://developers.linear.app/docs/graphql)
- [Linear Settings](https://linear.app/settings/api)

---

*Gotowe do użycia! 🎉*










