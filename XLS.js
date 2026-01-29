const XLSX = require('xlsx');

// Créer un nouveau classeur
const wb = XLSX.utils.book_new();

// Données pour la feuille CTA (en-têtes uniquement)
const headers = [
    "run_id", "created_at", "region", "category", "keyword", "radius_km", "source", "name",
    "business_type", "address", "postcode", "city", "country", "phone", "website", "email",
    "rating", "reviews_count", "price_level", "latitude", "longitude", "source_url",
    "opening_hours", "status", "dedupe_key", "notes"
];

// Créer la feuille CTA avec les en-têtes
const ws_cta = XLSX.utils.aoa_to_sheet([headers]);

// Créer la feuille Config avec les listes
const categories = ["restaurant", "garage", "coiffure", "bien-être", "hôtel", "boulangerie", "pharmacie"];
const dedupe_modes = ["strict", "smart", "none"];
const ws_config = XLSX.utils.aoa_to_sheet([
    ["categories"], ...categories.map(cat => [cat]),
    ["dedupe_mode"], ...dedupe_modes.map(mode => [mode])
]);

// Ajouter les feuilles au classeur
XLSX.utils.book_append_sheet(wb, ws_cta, "CTA");
XLSX.utils.book_append_sheet(wb, ws_config, "Config");

// Définir les styles pour les en-têtes (simulé, car SheetJS ne gère pas directement les styles dans aoa_to_sheet)
// Pour les styles avancés, il faudrait utiliser un outil comme ExcelJS ou manipuler le XML directement.

// Écrire le fichier
XLSX.writeFile(wb, "CTA-AXIORNET.xlsx");
