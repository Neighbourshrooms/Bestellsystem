# Neighbourshrooms Bestellsystem 🍄

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Built with Google Apps Script](https://img.shields.io/badge/Built%20with-Google%20Apps%20Script-blue.svg)](https://developers.google.com/apps-script)

Eine Open-Source-Lösung für Lebensmittelkooperativen und Gemeinschaftsdepots zur Verwaltung von Bestellungen, Lagerbeständen und Lieferungen.

![Screenshot des Bestellformulars](https://via.placeholder.com/800x600.png?text=Bestellformular+Screenshot)

## Funktionen 🌟

- 📦 **Produktverwaltung** mit Echtzeit-Lagerbeständen
- 📅 **Vorbestellungen** mit Liefertermin-Kalenderintegration
- 🚚 **Flexible Lieferoptionen** (Abholung & Lieferung)
- 📊 **Automatische Berichterstellung** in Google Sheets
- 📧 **E-Mail-Benachrichtigungen** für Bestätigungen
- 📱 **Responsive Design** für alle Geräte
- 🔒 **Sichere Datenverarbeitung** gemäß DSGVO

## Technologie-Stack ⚙️

**Backend:**
- Google Apps Script
- Google Spreadsheets
- Google Calendar API

**Frontend:**
- HTML5
- CSS3 (Custom Properties)
- Vanilla JavaScript

## Schnellstart 🚀

### Voraussetzungen
- Google-Konto
- Google Spreadsheet (mind. 3 Blätter: "Bestand", "Depots", "Bestellungen")
- Google Kalender (optional)

### Installation
1. **Spreadsheet einrichten**
   - Erstelle ein neues Google Spreadsheet
   - Erstelle drei Blätter mit den Namen:
     - `Bestand` (Produktliste)
     - `Depots` (Abholstandorte)
     - `Bestellungen` (Bestellhistorie)

2. **Skript erstellen**
   - Gehe zu `Erweiterungen` > `Apps Script`
   - Ersetze den Code in `Code.gs` mit dem bereitgestellten Code
   - Setze deine Konfiguration in der `CONFIG`-Konstante:
     ```javascript
     const CONFIG = {
       SPREADSHEET_ID: 'DEINE_SPREADSHEET_ID',
       CALENDAR_ID: 'DEIN_KALENDER_ID',
       ADMIN_EMAIL: 'deine@email.de'
     };
     ```

3. **Berechtigungen erteilen**
   - Klicke auf `Ausführen` > `doGet`
   - Autorisiere das Skript mit deinem Google-Konto

4. **Web-App bereitstellen**
   - Gehe zu `Bereitstellungen` > `Neue Bereitstellung`
   - Wähle:
     - **Art:** Web-App
     - **Zugriff:** "Jeder, auch anonym"
   - Klicke auf `Bereitstellen` und kopiere die Web-App-URL

## Konfiguration ⚙️

### Spreadsheet-Struktur
**Bestand (Products):**
| Spalte | Beschreibung           | Beispiel       |
|--------|------------------------|----------------|
| A      | Produktname            | Bio-Karotten   |
| B      | Kategorie              | Gemüse         |
| C      | Lagerbestand           | 150            |
| D      | Einheit                | kg             |
| E      | Maximalbestellung      | 10             |
| F      | Letzte Aktualisierung  | 2023-08-20     |
| G      | Nettopreis             | 2.50           |
| H      | Vorbestellungen        | 15             |
| I      | Bevorzugter Liefertag  | Mittwoch       |
| J      | Bruttopreis            | 2.99           |

**Depots:**
| Spalte | Beschreibung   | Beispiel            |
|--------|----------------|---------------------|
| A      | Depot-ID       | 1                   |
| B      | Name           | Bioladen Zentrum    |
| C      | Adresse        | Hauptstr. 5         |
| D      | Öffnungszeiten | Mo-Fr 9-18 Uhr      |

## Nutzung 📖

1. **Web-App öffnen**
   - Rufe die bereitgestellte Web-App-URL auf

2. **Bestellung aufgeben**
   - Wähle Produkte aus der Liste
   - Gib gewünschte Mengen ein
   - Wähle Liefermethode
   - Fülle Kundendaten aus

3. **Bestätigung erhalten**
   - Automatische E-Mail-Bestätigung
   - Eintrag in der Bestellhistorie
   - Kalendereintrag (bei Abholung)

## Sicherheit 🔒

### Datenschutzmaßnahmen
- ⚠️ **WICHTIG:** Alle Daten werden in Google-Servern gespeichert
- 🔑 Zugriff nur über autorisierte Google-Konten
- 📧 E-Mails werden verschlüsselt übertragen
- 🗑️ Keine dauerhafte Speicherung personenbezogener Daten

### Empfohlene Maßnahmen
1. Regelmäßige Backups des Spreadsheets
2. Zugriffsbeschränkung auf das Spreadsheet
3. Regelmäßige Passwortaktualisierungen

## Beitragen 🤝

Wir freuen uns über Beiträge! So kannst du helfen:

1. **Fehler melden**
   - Öffne ein [Issue](https://github.com/deinrepo/issues)

2. **Feature vorschlagen**
   - Erstelle einen [Feature Request](https://github.com/deinrepo/issues/new?template=feature.md)

3. **Code beitragen**
   - Fork das Repository
   - Erstelle einen Feature-Branch
   - Sende einen Pull Request

## Lizenz 📄

Dieses Projekt steht unter der MIT-Lizenz - siehe [LICENSE.md](LICENSE.md) für Details.

---

**Entwickelt mit ❤️ für nachhaltige Lebensmittelgemeinschaften** 🥕🌍