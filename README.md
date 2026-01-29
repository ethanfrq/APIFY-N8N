# CTA-AXIORNET

Workflow **n8n** pour collecter des commerces (restaurants, garages, coiffure, bien-être, etc.) via **Apify**, enregistrer dans **Google Sheets**, tracer des étapes via **Telegram**, puis envoyer un **récap HTML** via **Gmail**.

> Généré automatiquement le 2026-01-29T07:38:10.699Z

---

## 🧩 Aperçu

- **Entrée** : formulaire n8n (région, type de commerce, mot-clé, rayon, etc.)
- **Collecte** : Apify (Actor) via les nœuds Apify n8n
- **Traitement** : normalisation + dédoublonnage
- **Sortie** : Google Sheets `CTA-AXIORNET` → onglet `CTA`
- **Observabilité** : logs Telegram aux étapes clés
- **Récap** : email HTML via Gmail

---

## ✅ Fonctionnalités

- Formulaire guidé (champ région, catégorie, filtres, limites)
- Validation des inputs + gestion des erreurs
- Dédoublonnage (modes strict/smart/none)
- Écriture en **append** dans Google Sheets
- Logs Telegram (début, post-Apify, post-dédoublonnage, post-Sheets, erreurs)
- Email HTML final (KPIs, top 10, erreurs, lien vers sheet)

---

## 📦 Prérequis

- n8n v1+
- Compte Apify + un Actor configuré
- Compte Google (Sheets) connecté dans n8n
- Bot Telegram (token) + Chat ID
- Gmail connecté dans n8n (OAuth2)

---

## 🔐 Configuration (Credentials / Variables)

> **Ne mets jamais de secrets dans le workflow exporté.**

### Apify
- Credentials Apify configurés dans n8n (token)
- Un Actor (ID ou nom) accessible par le nœud Apify

### Google Sheets
- Credentials Google Sheets (OAuth) dans n8n

### Telegram
- Credentials Telegram dans n8n (ou env)
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

### Gmail
- Node **Gmail** configuré via OAuth2 dans n8n
- Destinataire: `franquevilleethan@gmail.com`

---

## 🚀 Installation / Import du workflow

1. Ouvre n8n → **Workflows**
2. **Import from file / clipboard**
3. Importer le JSON du workflow

> ⚠️ Aucun fichier workflow détecté à `./workflow.json` (optionnel)

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
- Mode d’écriture : **Append rows**

### Colonnes (ordre strict)

```text
run_id, created_at, region, category, keyword, radius_km, source, name, business_type, address, postcode, city, country, phone, website, email, rating, reviews_count, price_level, latitude, longitude, source_url, opening_hours, status, dedupe_key, notes
```

---

## 🧠 Dédoublonnage

- **strict** : lower(name) + lower(address) + postcode  
- **smart** : si phone dispo → phone ; sinon lower(name) + city  
- **none** : aucun dédoublonnage  

---

## 📣 Logs Telegram

Logs envoyés aux moments clés :
1) Début (inputs + run_id)  
2) Avant Apify (lancement Actor)  
3) Après Apify (nombre brut)  
4) Après dédoublonnage (restants + doublons)  
5) Après Google Sheets (lignes écrites)  
6) Erreur (étape + message)  

---

## ✉️ Email final (Gmail)

Envoi via node **Gmail → Send** :
- Sujet : `CTA-AXIORNET — Résultats collecte (run_id) — N prospects`
- HTML : KPIs + critères + tableau Top 10 + erreurs + lien Google Sheets

---

## 🛠️ Dépannage

- **0 résultat** : vérifier la région/keyword/rayon, et la config de l’Actor Apify.
- **429 / rate limit** : augmenter les délais / activer retries (backoff).
- **Sheets** : vérifier l’accès OAuth, et l’existence du fichier/onglet.
- **Gmail** : vérifier la connexion OAuth2 et les quotas.

---

## 🔒 Sécurité

- Ne jamais versionner: tokens, credentials, exports contenant des secrets.
- Utiliser les **Credentials n8n** et/ou variables d’environnement.

---

## 🗂️ Structure conseillée du repo

```text
.
├─ workflow.json           # Export n8n (sans secrets)
├─ README.md               # Documentation
└─ create-readme.js        # Script de génération du README
```

---

## 📜 Licence

À définir (MIT, Propriétaire, etc.).
