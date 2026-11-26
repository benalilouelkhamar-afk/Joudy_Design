# Recevoir les commandes COD dans Google Sheets

Par défaut, chaque commande du formulaire COD est envoyée sur **WhatsApp**.
Ce guide permet en plus de les enregistrer automatiquement dans un **Google Sheet**, avec une ligne par commande.

## 1. Créer la feuille
1. Créez un Google Sheet nommé « Commandes Joudy Design ».
2. Menu **Extensions → Apps Script**.
3. Remplacez le code par celui-ci, puis enregistrez :

```javascript
const HEADERS = ["Date", "Référence", "Produit", "Taille", "Quantité", "Total", "Nom", "Téléphone", "Ville", "Adresse", "Remarque", "Statut", "Page"];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  const o = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(o.date || Date.now()), o.ref, o.product, o.size, o.qty,
    o.total == null ? "à confirmer" : o.total,
    o.name, "'" + o.phone, o.city, o.address, o.note || "", "Nouvelle", o.page || ""
  ]);
  return ContentService.createTextOutput("ok");
}
```

## 2. Publier
1. **Déployer → Nouveau déploiement** → type **Application Web**.
2. *Exécuter en tant que* : **Moi** — *Qui a accès* : **Tout le monde**.
3. Autorisez l’accès, puis copiez l’URL qui se termine par `/exec`.

## 3. Brancher le site
Dans `assets/js/products.js` :

```javascript
orderEndpoint: "https://script.google.com/macros/s/XXXXXXXX/exec",
```

Chaque commande arrive alors dans la feuille **et** sur WhatsApp.
Pour ne plus ouvrir WhatsApp chez la cliente après validation : `codOpenWhatsApp: false`.

> La colonne « Statut » sert au suivi (Nouvelle → Confirmée → Expédiée → Livrée).
