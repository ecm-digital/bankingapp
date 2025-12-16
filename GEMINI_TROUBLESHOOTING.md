# Rozwiązywanie problemów z Gemini API

## Problem: Błąd 404 - Model nie znaleziony

Jeśli widzisz błąd:
```
[404] models/gemini-pro is not found for API version v1beta
```

### Możliwe przyczyny:

1. **Klucz API nie ma dostępu do modeli**
   - Sprawdź czy klucz API jest aktywny
   - Upewnij się, że klucz został utworzony w [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Klucz API jest nieprawidłowy**
   - Sprawdź czy klucz API w pliku `.env` jest poprawny
   - Upewnij się, że nie ma dodatkowych spacji lub znaków

3. **Region/API Version**
   - Niektóre modele mogą nie być dostępne w niektórych regionach
   - Sprawdź dostępne modele w [dokumentacji Gemini](https://ai.google.dev/models)

### Rozwiązania:

#### 1. Sprawdź dostępne modele

Otwórz konsolę przeglądarki (F12) i sprawdź logi. Kod automatycznie próbuje następujące modele w kolejności:
- `gemini-1.5-pro-latest`
- `gemini-1.5-flash-latest`
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-pro`
- `gemini-1.0-pro`

#### 2. Zweryfikuj klucz API

1. Odwiedź [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sprawdź czy klucz jest aktywny
3. Sprawdź czy masz dostęp do modeli Gemini
4. Jeśli nie, utwórz nowy klucz API

#### 3. Sprawdź plik .env

Upewnij się, że plik `.env` zawiera:
```
VITE_GEMINI_API_KEY=twoj_klucz_tutaj
```

**WAŻNE:** Nie dodawaj cudzysłowów wokół klucza!

#### 4. Zrestartuj serwer

Po zmianie `.env`, zrestartuj serwer deweloperski:
```bash
# Zatrzymaj serwer (Ctrl+C)
# Uruchom ponownie:
npm run dev
```

#### 5. Sprawdź konsolę przeglądarki

Otwórz konsolę przeglądarki (F12 → Console) i sprawdź:
- Czy widzisz komunikat: `✅ Gemini API model set to [nazwa_modelu]`
- Czy są jakieś błędy związane z API
- Czy klucz API jest poprawnie odczytywany

### Alternatywne rozwiązanie: Użyj trybu demo

Jeśli nie możesz skonfigurować Gemini API, aplikacja automatycznie przejdzie w tryb demo i będzie używać mockowanych danych.

### Sprawdzenie dostępności modeli

Możesz sprawdzić, które modele są dostępne dla Twojego klucza API, odwiedzając:
- [Google AI Studio - Models](https://makersuite.google.com/app/models)
- [Gemini API Documentation](https://ai.google.dev/models)

### Kontakt z pomocą

Jeśli problem nadal występuje:
1. Sprawdź [dokumentację Gemini API](https://ai.google.dev/docs)
2. Sprawdź [status Google AI](https://status.cloud.google.com/)
3. Skontaktuj się z pomocą Google AI Studio


