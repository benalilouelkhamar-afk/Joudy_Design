# Joudy Design — Boutique en ligne

Site vitrine et boutique de **Joudy Design** (créatrice marocaine de kaftans et takchitas).
Site 100 % statique (HTML, CSS, JavaScript), sans dépendance : il fonctionne en ouvrant `index.html` ou sur GitHub Pages.

## Fonctionnalités
- Page d’accueil éditoriale : hero, lookbook des nouveautés, collection, « La maison », étapes de commande, Instagram, FAQ
- Catalogue de 29 modèles avec filtres (Imprimés, Unis, Soirée, Ceinturés) et tri
- Aperçu rapide de chaque produit : choix de la taille et de la quantité
- Panier enregistré dans le navigateur
- Commande envoyée sur **WhatsApp** avec le récapitulatif des articles, le nom et la ville
- Responsive (mobile, tablette, desktop) et accessible au clavier

## Structure
```
index.html
assets/
  css/style.css
  js/products.js   ← configuration + catalogue (à modifier)
  js/main.js       ← interactions
  img/looks/       ← photos du lookbook
  img/products/    ← une photo par modèle (nom = id du produit)
```

## À personnaliser
1. **Numéro WhatsApp** : `CONFIG.whatsapp` dans `assets/js/products.js` (format `2126XXXXXXXX`).
2. **Prix** : champ `price` de chaque produit (`null` affiche « Prix sur demande »).
3. **Textes** marqués `[À COMPLÉTER]` dans `index.html` (histoire de la marque, ville, délais, échanges).
4. **Photos** : remplacez les fichiers de `assets/img/` par les photos originales en haute qualité (même nom de fichier).

### Ajouter un produit
Ajoutez une ligne dans `PRODUCTS` (`assets/js/products.js`) et une photo `assets/img/products/<id>.jpg`.

## Mise en ligne avec GitHub Pages
Settings → Pages → Source : *Deploy from a branch* → branche `main`, dossier `/ (root)`.
