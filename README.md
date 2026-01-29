# CTA-AXIORNET

Workflow **n8n** : **Formulaire → Apify → Google Sheets → Logs Telegram → Récap Gmail**.

> Nom du workflow : **CTA-AXIORNET — n8n Workflow** 

---

## 🧩 Vue d’ensemble

- **Entrée** : formulaire n8n (région, catégorie, mot-clé, rayon…)
- **Collecte** : Apify (Actor)
- **Traitement** : normalisation + dédoublonnage
- **Sortie** : Google Sheets `CTA-AXIORNET` → onglet `CTA`
- **Logs** : Telegram (étapes clés)
- **Récap** : email HTML via Gmail

---

## ✅ Fonctionnalités

- Form Trigger (UI) + validation des inputs
- Lancement Actor Apify + récupération dataset items
- Filtres (note minimale, only phone, only website)
- Dédoublonnage (strict / smart / none)
- Écriture en append dans Google Sheets
- Logs Telegram et email final HTML

---

## 📦 Prérequis

- n8n v1+
- Compte Apify + un Actor configuré
- Google Sheets connecté dans n8n
- Bot Telegram + chat id
- Gmail OAuth2 connecté dans n8n

---

## 🔐 Configuration (sans secrets)

Configurer les credentials dans n8n :
- **Apify** : token + sélection Actor dans le node Apify
- **Google Sheets** : OAuth2
- **Telegram** : token bot + chat id
- **Gmail** : OAuth2

---

## 🧾 Champs du formulaire

| Champ | Requis | Description |
|------|:------:|------------|
| `region` | ✅ | Texte libre (ex: "Paris 11", "Rouen", "Île-de-France") |
| `category` | ✅ | Liste (restaurant, garage, coiffure, bien-être, etc.) |
| `keyword` | ➖ | Mot-clé optionnel (ex: vegan, pizza, barbier…) |
| `radius_km` | ➖ | Nombre (défaut: 5, min: 1, max: 50) |
| `max_results` | ➖ | Nombre (défaut: 50, min: 1, max: 500) |
| `min_rating` | ➖ | Nombre optionnel (ex: 4.2) |
| `only_with_phone` | ➖ | Bool (true/false) |
| `only_with_website` | ➖ | Bool (true/false) |
| `dedupe_mode` | ➖ | Liste: "strict" | "smart" | "none" |

---

## 📄 Google Sheets

- **Spreadsheet** : `CTA-AXIORNET`
- **Onglet** : `CTA`
- Mode : **Append rows**

### Colonnes (ordre strict)
```text
run_id, created_at, region, category, keyword, radius_km, source, name, business_type, address, postcode, city, country, phone, website, email, rating, reviews_count, price_level, latitude, longitude, source_url, opening_hours, status, dedupe_key, notes
```

---

## 🧠 Dédoublonnage

- **strict** : lower(name) + lower(address) + postcode  
- **smart** : si phone → phone, sinon lower(name) + city  
- **none** : aucun dédoublonnage  

---

## 🚀 Import du workflow

1. n8n → **Workflows**
2. **Import from clipboard / file**
3. Importer le JSON du workflow

> ⚠️ aucun fichier workflow trouvé à `./workflow.json` (optionnel)

---

## 🛠️ Dépannage rapide

- **Form “Problem loading”** : workflow non activé ou mauvaise URL de form.
- **Apify ne renvoie rien** : actorId non sélectionné / input incorrect.
- **Sheets KO** : mauvais docId / onglet / credentials.
- **Gmail KO** : OAuth2 non configuré / quotas.

---

## 🗂️ Structure conseillée

```text
.
├─ workflow.json
├─ README.md
└─ create-readme.js
```
