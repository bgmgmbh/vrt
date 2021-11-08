# bgm Visual Regression Testing mit BackstopJS

## Schnellstart

1. Verzeichnis erstellen: z.B. `kunde/projekt/`
2. Konfigurationsdateien aus anderem Projekt kopieren
3. Konfiguration anpassen

## Konfiguration

### basicConfig.js

- `projectId` und `baseUrl` anpassen
  - `baseUrl` ist in der Regel die Produktivdomain
- gewünschte Kontexte anlegen (z.B. `dev`, `review` und `ref`)
- `viewports` festlegen
  - mögliche Werte: `phone` (320x480), `tablet` (1024x768) und `desktop` (1920x2000)
  - wenn weitere Viewports oder andere Auflösungen gebraucht werden, können diese in `mainConfig.js` konfiguriert werden

### mainConfig.js

Hier kann bei Bedarf im Bereich `scenarios.push` die Konfiguration für die Tests angepasst werden.

- `delay` Wartezeit bis zum Erstellen des Screenshots
- `misMatchThreshold` Prozentsatz der Differenz, die BackstopJS toleriert
- `removeSelectors` Array der DOM Elemente, die entfernt werden, bevor der Screenshot gemacht wird. Besonders hilfreich, um beispielsweise Consent Management Layer zu entfernen.


Weitere Parameter finden sich in der offiziellen [Backstop JS Doku](https://github.com/garris/BackstopJS#advanced-scenarios) .

### Cookie Dateien anlegen

Passend zu den in `basicConfig.js` konfigurierten Kontexten müssen Cookie Dateien nach diesem Schema angelegt werden:

`backstop_data/engine_scripts/cookies-<KONTEXT>.json`

Falls kein Cookie gebraucht wird, die .json Datei mit leerem Array `[]` anlegen.

Mit diesem [Chrome Plugin](https://chrome.google.com/webstore/detail/%E3%82%AF%E3%83%83%E3%82%AD%E3%83%BCjson%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%87%BA%E5%8A%9B-for-puppet/nmckokihipjgplolmcmjakknndddifde) können Cookies einer Seite direkt als JSON exportiert werden.

### URL Listen anlegen

Beispiele:
```
urls/simple.js
urls/complete.js
urls/random.js
```

Aus dem Namen der .js Datei ergibt sich später der Parameter `URLS`.

Mit `backstop-crawl` kann eine Liste aller URLs einer Webeseite erstellt werden:
```
backstop-crawl https://www.domain.tld
```

Als Ergebnis wird die Datei `backstop.json` erstellt.  Mit `grep label backstop.json | sed "s/\"label\": //"` lassen sich dann die URLs extrahieren und könenn für die Verwendung in den oben genannten URL Listen aufbereitet werden.

## Tests laufen lassen

Referenz Bilder erzeugen:
```
CONTEXT=ref URLS=simple backstop reference --config=kunde/projekt/mainConfig.js
```

Eigentlichen Test laufen lassen:
```
CONTEXT=dev URLS=simple backstop test --config=kunde/projekt/mainConfig.js
```

### Random URLs

Um aus einer umfangreichen Liste von URLs nur eine zufällige Teilmenge auszuwählen braucht es noch 2 weitere Parameter:

`COUNT`: Anzahl der URLs die aus der Liste genommen werden sollen.

`SEED`: beliebige Ganzzahl, damit sowohl für die Referenzbilder als auch die Tests immer das gleiche URL Set verwendet wird. Um bei wiederholten Testläufen unterschiedliche URLs zu verwenden muss dann nur noch der SEED Parameter geändert werden.

Beispiel:

```
CONTEXT=ref URLS=random COUNT=10 SEED=7453864 backstop reference --config=kunde/projekt/mainConfig.js
CONTEXT=dev URLS=random COUNT=10 SEED=7453864 backstop test --config=kunde/projekt/mainConfig.js
```

# Beispiele für individuelle Konfigurationen

## Wie groß darf die Abweichung sein?

Je nach Anforderung muss mit der Einstellunng `misMatchThreshold` gespielet werden, gerade z.B. beim Wechsel von css_styled_content auf fluid_styled_content, damit nicht kleinste Unterschiede bei den Abständen gleich zu fehlgeschlagenen Tests führen.

## User Centrics und andere Cookie Banner entfernen

`removeSelectors` kann ein Array von DOM Selektoren (IDs oder Klassen) sein, die entfernt werden, bevor ein Screenshot gemacht wird. Sehr hilfreich, um Overlays von Cookie Consent zu entfernen.

Alternativ kann auch `hideSelectors` verwendet werden, um die Visibility nur auf hidden zu setzen.

```
removeSelectors: ['#usercentrics-button'],
```

## Klick oder Hover auf ein DOM Element ausführen

Mit `clickSelector` kann ein Mausklick ausgeführt werden, z.B. um ein Ausklapp Menü zu testen. Um Hover zu emulieren, kann `hoverSelector` verwendet werden.
