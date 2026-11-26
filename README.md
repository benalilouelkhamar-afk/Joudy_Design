# Joudy Design — Boutique en ligne

Site vitrine et boutique de **Joudy Design** (créatrice marocaine de kaftans et takchitas).
Site 100 % statique (HTML, CSS, JavaScript), sans dépendance : il fonctionne en ouvrant `index.html` ou sur GitHub Pages.

## Fonctionnalités
- **Accueil** (`index.html`) : hero, lookbook, collection, « La maison », étapes de commande, Instagram, FAQ
- **Page produit** (`product.html?id=<id>`) : galerie photos (miniatures, zoom au survol, swipe sur mobile), taille + guide des tailles, quantité, ajout au panier, commande WhatsApp directe, description / entretien / livraison / échanges, partage, produits similaires, récemment consultés, barre d’achat fixe sur mobile
- Catalogue de 29 modèles avec filtres (Imprimés, Unis, Soirée, Ceinturés) et tri
- Recherche instantanée (nom, couleur, tissu)
- Ajout rapide depuis la collection
- Panier enregistré dans le navigateur
- Commande envoyée sur **WhatsApp** avec le récapitulatif des articles, le nom et la ville
- Responsive (mobile, tablette, desktop) et accessible au clavier

## Structure
```
index.html
assets/
  css/style.css
  js/products.js   ← configuration + catalogue (à modifier)
  js/main.js       ← interactions communes (panier, recherche, menu…)
  js/product.js    ← page produit
  img/looks/       ← photos du lookbook
  img/products/    ← photo principale par modèle (nom = id du produit)
  img/gallery/     ← photos supplémentaires : <id>-2.jpg, <id>-3.jpg…
product.html
404.html
```

## À personnaliser
1. **Numéro WhatsApp** : `CONFIG.whatsapp` dans `assets/js/products.js` (format `2126XXXXXXXX`).
2. **Prix** : champ `price` de chaque produit (`null` affiche « Prix sur demande »).
3. **Textes** marqués `[À COMPLÉTER]` dans `index.html` (histoire de la marque, ville, délais, échanges).
4. **Photos** : remplacez les fichiers de `assets/img/` par les photos originales en haute qualité (même nom de fichier).

5. **Guide des tailles** : `SIZE_GUIDE` dans `assets/js/products.js` (mesures indicatives à vérifier).

### Ajouter un produit
Ajoutez une ligne dans `PRODUCTS` (`assets/js/products.js`) et une photo `assets/img/products/<id>.jpg`.
Pour plus de photos : `assets/img/gallery/<id>-2.jpg`, `<id>-3.jpg`… puis indiquez leur nombre dans `GALLERY`.

## Mise en ligne avec GitHub Pages
Settings → Pages → Source : *Deploy from a branch* → branche `main`, dossier `/ (root)`.
