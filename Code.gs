/**
 * @OnlyCurrentDoc
 * 
 * Open-Source Bestellsystem für Lebensmittelkooperativen
 * Lizenz: MIT
 * Version: 1.2.0
 */

// Konfiguration
const CONFIG = {
  SPREADSHEET_ID: '<DEINE_SPREADSHEET_ID>',
  CALENDAR_ID: '<DEIN_KALENDER_ID>',
  ADMIN_EMAIL: '<BUCHHALTUNG@EXAMPLE.ORG>',
  CACHE_DURATION: 300 // 5 Minuten in Sekunden
};

// Globale Referenzen
const SPREADSHEET = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
const CACHE = CacheService.getScriptCache();

/**
 * Haupt-Endpoint für Web-App
 */
function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  template.depots = getDepots();
  return template.evaluate()
    .setTitle('Neighbourshrooms Bestellsystem')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Produktdaten mit Caching
 */
function getProducts() {
  const cached = CACHE.get('products');
  if (cached) return JSON.parse(cached);

  const sheet = SPREADSHEET.getSheetByName('Bestand');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const products = data.slice(1).map(row => {
    const product = {};
    headers.forEach((header, index) => {
      product[header.toLowerCase()] = row[index] || null;
    });
    return product;
  });

  CACHE.put('products', JSON.stringify(products), CONFIG.CACHE_DURATION);
  return products;
}

/**
 * Depot-Daten
 */
function getDepots() {
  const sheet = SPREADSHEET.getSheetByName('Depots');
  return sheet.getDataRange().getValues()
    .slice(1)
    .map(row => ({
      id: row[0],
      name: row[1],
      address: row[2],
      hours: row[3]
    }));
}

/**
 * Bestellverarbeitung mit Lock-Service
 */
function processOrder(form) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    const sanitizedForm = sanitizeFormData(form);
    validateOrder(sanitizedForm);
    
    const result = {
      mail: processEmails(sanitizedForm),
      calendarEvent: processCalendar(sanitizedForm),
      orderId: saveOrder(sanitizedForm)
    };
    
    CACHE.remove('products');
    return { success: true, ...result };
  } catch (e) {
    console.error(e);
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Datenvalidierung
 */
function validateOrder(form) {
  const errors = [];
  
  // Pflichtfelder
  if (!form.name) errors.push('Name fehlt');
  if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Ungültige Email');
  
  // Produktvalidierung
  form.products.forEach((product, index) => {
    if (!product.id || !product.quantity) {
      errors.push(`Produkt #${index + 1}: Ungültige Angaben`);
    }
  });
  
  // Liefermethode
  if (form.deliveryMethod === 'Abholung' && !form.depot) {
    errors.push('Depot für Abholung benötigt');
  }
  
  if (errors.length > 0) throw new Error(errors.join('\n'));
}

/**
 * E-Mail-Verarbeitung
 */
function processEmails(form) {
  const total = form.products.reduce((sum, p) => sum + (p.quantity * p.bruttopreis), 0);
  const mailContent = {
    to: form.email,
    subject: `Bestellbestätigung ${new Date().toLocaleDateString('de-DE')}`,
    body: buildEmailBody(form, total)
  };
  
  MailApp.sendEmail({ ...mailContent, to: CONFIG.ADMIN_EMAIL });
  return MailApp.sendEmail(mailContent);
}

/**
 * Hilfsfunktionen
 */
function sanitizeFormData(form) {
  return {
    ...form,
    message: form.message.replace(/<[^>]*>?/gm, '')
  };
}

/**
 * Erstellt den E-Mail-Body für Bestellbestätigungen
 * @param {Object} form - Bestelldaten
 * @param {number} total - Gesamtbetrag
 * @return {string} Formatierter E-Mail-Text
 */
function buildEmailBody(form, total) {
  const deliveryMethodLabels = {
    'Abholung': 'Abholung im Depot',
    'Lieferung': 'Lieferung an Adresse'
  };

  // Kopfbereich der E-Mail
  let emailBody = `
    ===== NEUE BESTELLUNG =====
    
    Bestelldatum: ${new Date().toLocaleDateString('de-DE')}
    Kundendaten:
    - Name: ${form.name}
    - E-Mail: ${form.email}
    
    ${form.preOrder ? '❗ VORBESTELLUNG (komplette Menge)' : '🔹 Sofort verfügbare Bestellung'}
  `;

  // Produktliste
  emailBody += '\n\nBestellte Produkte:\n';
  form.products.forEach(item => {
    const product = products.find(p => p.name === item.id);
    const subtotal = calculatePrice(product, item.quantity);
    
    emailBody += `- ${item.quantity} ${product.unit} ${product.name}`;
    emailBody += ` (${subtotal.toFixed(2)} €)\n`;
    
    if (product.preferredDelivery) {
      emailBody += `  ⏳ Bevorzugter Liefertag: ${product.preferredDelivery}\n`;
    }
  });

  // Preisübersicht
  emailBody += `
    \nZusammenfassung:
    Zwischensumme: ${total.toFixed(2)} €
    ${form.deliveryMethod === 'Lieferung' ? 'Versandkosten: 0.00 €\n' : ''}
    Gesamtbetrag: ${total.toFixed(2)} €
  `;

  // Lieferdetails
  emailBody += '\n\nLieferinformationen:\n';
  emailBody += `- Art: ${deliveryMethodLabels[form.deliveryMethod] || form.deliveryMethod}\n`;

  if (form.deliveryMethod === 'Abholung') {
    const depot = depots.find(d => d.id === form.depot);
    emailBody += `- Depot: ${depot.name}\n`;
    emailBody += `- Adresse: ${depot.address}\n`;
    emailBody += `- Öffnungszeiten: ${depot.hours}\n`;
    if (form.pickupTimeWindow) {
      emailBody += `- Zeitfenster: ${form.pickupTimeWindow}\n`;
    }
  } else {
    emailBody += `- Lieferadresse:\n`;
    emailBody += `  ${form.street}\n`;
    emailBody += `  ${form.postalCode} ${form.city}\n`;
  }

  // Vorbestellungsdetails
  if (form.preOrder && form.preferredDeliveryDate) {
    emailBody += `\nVorbestellung für: ${form.preferredDeliveryDate}\n`;
  }

  // Kundennachricht
  if (form.message) {
    emailBody += `\nKundennachricht:\n"${form.message}"\n`;
  }

  // Fußzeile
  emailBody += `
    \n\n===== SYSTEMINFORMATIONEN =====
    Bestell-ID: ${Utilities.getUuid()}
    Verarbeitet am: ${new Date().toISOString()}
    Systemversion: 2.1.0
  `;

  // Formatierung für bessere Lesbarkeit
  return emailBody
    .replace(/^ {4}/gm, '') // Entfernt Einrückungen
    .trim();
}

function saveOrder(form) {
  const sheet = SPREADSHEET.getSheetByName('Bestellungen');
  const row = [
    new Date(),
    form.name,
    form.email,
    form.deliveryMethod,
    JSON.stringify(form.products),
    form.total,
    form.preOrder ? 'Ja' : 'Nein',
    form.preferredDeliveryDate || ''
  ];
  return sheet.appendRow(row);
}
