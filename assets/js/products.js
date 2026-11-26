/* ==========================================================
   Joudy Design — configuration & catalogue
   Modifiez ici le numéro WhatsApp, la devise et les produits.
   price: null  →  affiché « Prix sur demande »
   ========================================================== */

const CONFIG = {
  whatsapp: "212600000000", // [À REMPLACER] numéro au format international, sans + ni espaces
  instagram: "https://www.instagram.com/joudy___design/",
  currency: "DH",
  sizes: ["S", "M", "L", "XL", "Sur mesure"],
};

const CATEGORIES = [
  { id: "all", label: "Tout voir" },
  { id: "imprime", label: "Imprimés" },
  { id: "uni", label: "Unis" },
  { id: "soiree", label: "Soirée" },
  { id: "ceinture", label: "Ceinturés" },
];

const PRODUCTS = [
  { id: "lilas",     name: "Kaftan Lilas",      cat: "imprime",  fabric: "Satin imprimé léopard", detail: "Sfifa et 3a9ad lilas, manches papillon", price: null, isNew: true },
  { id: "zitoun",    name: "Kaftan Zitoun",     cat: "soiree",   fabric: "Satin brillant vert & or", detail: "Tresse dorée, ceinture nouée", price: null, isNew: true },
  { id: "rose",      name: "Kaftan Warda",      cat: "imprime",  fabric: "Satin imprimé floral", detail: "Sfifa vieux rose, boutons 3a9ad", price: null, isNew: true },
  { id: "taupe",     name: "Kaftan Taupe",      cat: "uni",      fabric: "Satin uni", detail: "Broderie ton sur ton", price: null, isNew: false },
  { id: "noir-dore", name: "Kaftan Noir Doré",  cat: "uni",      fabric: "Satin noir", detail: "Galon pied-de-poule doré", price: null, isNew: false },
  { id: "aquarelle", name: "Kaftan Aquarelle",  cat: "imprime",  fabric: "Satin imprimé pastel", detail: "Sfifa vert d’eau", price: null, isNew: false },
  { id: "sahara",    name: "Kaftan Sahara",     cat: "imprime",  fabric: "Satin imprimé graphique", detail: "Sfifa et 3a9ad marron", price: null, isNew: false },
  { id: "violette",  name: "Kaftan Violette",   cat: "imprime",  fabric: "Satin imprimé floral", detail: "Sfifa violette", price: null, isNew: false },
  { id: "ambre",     name: "Kaftan Ambre",      cat: "soiree",   fabric: "Jacquard crème", detail: "Sfifa chocolat à pointes", price: null, isNew: false },
  { id: "mandarine", name: "Kaftan Mandarine",  cat: "soiree",   fabric: "Jacquard orange", detail: "Col perlé, galon assorti", price: null, isNew: false },
  { id: "mosaique",  name: "Kaftan Mosaïque",   cat: "imprime",  fabric: "Satin imprimé", detail: "Sfifa violette", price: null, isNew: false },
  { id: "canard",    name: "Kaftan Canard",     cat: "imprime",  fabric: "Satin imprimé ikat", detail: "Sfifa bleu canard", price: null, isNew: false },
  { id: "camel",     name: "Kaftan Camel",      cat: "uni",      fabric: "Crêpe camel", detail: "Broderie assortie", price: null, isNew: false },
  { id: "menthe",    name: "Kaftan Menthe",     cat: "uni",      fabric: "Crêpe vert d’eau", detail: "Broderie ton sur ton", price: null, isNew: false },
  { id: "indigo",    name: "Kaftan Indigo",     cat: "imprime",  fabric: "Satin imprimé mosaïque", detail: "Sfifa bleu roi", price: null, isNew: false },
  { id: "jade",      name: "Kaftan Jade",       cat: "imprime",  fabric: "Satin imprimé mosaïque", detail: "Sfifa gris-vert", price: null, isNew: false },
  { id: "yaqout",    name: "Kaftan Yaqout",     cat: "imprime",  fabric: "Satin imprimé bleu", detail: "Sfifa rouge rubis", price: null, isNew: false },
  { id: "opale",     name: "Kaftan Opale",      cat: "imprime",  fabric: "Satin imprimé léopard", detail: "Sfifa vert d’eau", price: null, isNew: false },
  { id: "moutarde",  name: "Kaftan Moutarde",   cat: "uni",      fabric: "Crêpe moutarde", detail: "Galon assorti", price: null, isNew: false },
  { id: "fauve",     name: "Kaftan Fauve",      cat: "imprime",  fabric: "Satin imprimé léopard", detail: "Sfifa caramel", price: null, isNew: false },
  { id: "nuit",      name: "Kaftan Nuit",       cat: "soiree",   fabric: "Satin pailleté bleu nuit", detail: "Galon bleu roi", price: null, isNew: false },
  { id: "bronze",    name: "Kaftan Bronze",     cat: "soiree",   fabric: "Lamé bronze", detail: "Galon doré", price: null, isNew: false },
  { id: "brique",    name: "Kaftan Brique",     cat: "uni",      fabric: "Crêpe terracotta", detail: "Broderie assortie", price: null, isNew: false },
  { id: "jardin",    name: "Kaftan Jardin",     cat: "imprime",  fabric: "Satin imprimé floral", detail: "Sfifa gris anthracite", price: null, isNew: false },
  { id: "velours",   name: "Kaftan Velours",    cat: "soiree",   fabric: "Velours noir", detail: "Galon doré losange", price: null, isNew: false },
  { id: "sauge",     name: "Takchita Sauge",    cat: "ceinture", fabric: "Crêpe vert sauge", detail: "Broderie noire, ceinture assortie", price: null, isNew: false },
  { id: "safran",    name: "Takchita Safran",   cat: "ceinture", fabric: "Crêpe jaune safran", detail: "Broderie dorée, ceinture assortie", price: null, isNew: false },
  { id: "ivoire",    name: "Takchita Ivoire",   cat: "ceinture", fabric: "Crêpe ivoire", detail: "Broderie dorée, ceinture assortie", price: null, isNew: false },
  { id: "nude",      name: "Takchita Nude",     cat: "ceinture", fabric: "Crêpe beige rosé", detail: "Broderie dorée, ceinture assortie", price: null, isNew: false },
];

/* Photos supplémentaires par modèle : assets/img/gallery/<id>-2.jpg, <id>-3.jpg …
   Indiquez ici le nombre de photos supplémentaires. */
const GALLERY = {
  aquarelle: 2, sahara: 2, violette: 2, ambre: 2, taupe: 2,
  lilas: 2, mandarine: 2, mosaique: 2, "noir-dore": 2, rose: 1,
};

/* Guide des tailles (cm) — [À VÉRIFIER avec l’atelier] */
const SIZE_GUIDE = [
  { size: "S",  chest: "84–90",   hips: "90–96",   length: "140" },
  { size: "M",  chest: "90–96",   hips: "96–102",  length: "142" },
  { size: "L",  chest: "96–104",  hips: "102–110", length: "144" },
  { size: "XL", chest: "104–112", hips: "110–118", length: "146" },
];
