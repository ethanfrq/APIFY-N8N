/**
 * create-readme.js
 * Node.js script that generates a professional README.md for an n8n workflow project
 * (Form → Apify → Google Sheets → Telegram logs → Gmail HTML recap).
 *
 * Usage:
 *   node create-readme.js
 *   node create-readme.js --project "CTA-AXIORNET" --sheet "CTA-AXIORNET" --tab "CTA" --workflow "./workflow.json"
 */

const fs = require("fs");
const path = require("path");

function getArg(name, defaultValue = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith("--")) {
    return process.argv[idx + 1];
  }
  return defaultValue;
}

function safeReadJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function inferWorkflowName(workflowJson) {
  if (!workflowJson) return null;
  return workflowJson.name || workflowJson?.meta?.instanceId || null;
}

function nowISO() {
  return new Date().toISOString();
}

function writeFileIfChanged(filePath, content) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    const current = fs.readFileSync(filePath, "utf8");
    if (current === content) {
      console.log(`✅ README already up to date: ${filePath}`);
      return;
    }
  }
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`📝 README generated: ${filePath}`);
}

const PROJECT_NAME = getArg("project", "CTA-AXIORNET");
const SHEET_NAME = getArg("sheet", "CTA-AXIORNET");
const TAB_NAME = getArg("tab", "CTA");
const WORKFLOW_PATH = getArg("workflow", "./workflow.json");
const OUTPUT = getArg("out", "./README.md");

const workflowJson = safeReadJson(WORKFLOW_PATH);
const WORKFLOW_NAME = inferWorkflowName(workflowJson) || `${PROJECT_NAME} — n8n Workflow`;
const HAS_WORKFLOW_FILE = fs.existsSync(WORKFLOW_PATH);

const formFields = [
  { key: "region", required: true, desc: 'Texte libre (ex: "Paris 11", "Rouen", "Île-de-France")' },
  { key: "category", required: true, desc: "Liste (restaurant, garage, coiffure, bien-être, etc.)" },
  { key: "keyword", required: false, desc: "Mot-clé optionnel (ex: vegan, pizza, barbier…)" },
  { key: "radius_km", required: false, desc: "Nombre (défaut: 5, min: 1, max: 50)" },
  { key: "max_results", required: false, desc: "Nombre (défaut: 50, min: 1, max: 500)" },
  { key: "min_rating", required: false, desc: "Nombre optionnel (ex: 4.2)" },
  { key: "only_with_phone", required: false, desc: "Bool (true/false)" },
  { key: "only_with_website", required: false, desc: "Bool (true/false)" },
  { key: "dedupe_mode", required: false, desc: 'Liste: "strict" | "smart" | "none"' },
];

const sheetColumns = [
  "run_id",
  "created_at",
  "region",
  "category",
  "keyword",
  "radius_km",
  "source",
  "name",
  "business_type",
  "address",
  "postcode",
  "city",
  "country",
  "phone",
  "website",
  "email",
  "rating",
  "reviews_count",
  "price_level",
  "latitude",
  "longitude",
  "source_url",
  "opening_hours",
  "status",
  "dedupe_key",
  "notes",
];

const readme = `# ${PROJECT_NAME}

Workflow **n8n** pour collecter des commerces (restaurants, garages, coiffure, bien-être, etc.) via **Apify**, enregistrer dans **Google Sheets**, tracer des étapes via **Telegram**, puis envoyer un **récap HTML** via **Gmail**.

> Généré automatiquement le ${nowISO()}

---

## 🧩 Aperçu

- **Entrée** : formulaire n8n (région, type de commerce, mot-clé, rayon, etc.)
- **Collecte** : Apify (Actor) via les nœuds Apify n8n
- **Traitement** : normalisation + dédoublonnage
- **Sortie** : Google Sheets \`${SHEET_NAME}\` → onglet \`${TAB_NAME}\`
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
  - \`TELEGRAM_BOT_TOKEN\`
  - \`TELEGRAM_CHAT_ID\`

### Gmail
- Node **Gmail** configuré via OAuth2 dans n8n
- Destinataire: \`franquevilleethan@gmail.com\`

---

## 🚀 Installation / Import du workflow

1. Ouvre n8n → **Workflows**
2. **Import from file / clipboard**
3. Importer le JSON du workflow

${HAS_WORKFLOW_FILE ? `> ✅ Fichier workflow détecté: \`${WORKFLOW_PATH}\`` : `> ⚠️ Aucun fichier workflow détecté à \`${WORKFLOW_PATH}\` (optionnel)`}

---

## 🧾 Champs du formulaire

| Champ | Requis | Description |
|------|:------:|------------|
${formFields
  .map((f) => `| \`${f.key}\` | ${f.required ? "✅" : "➖"} | ${f.desc} |`)
  .join("\n")}

---

## 📄 Google Sheets

- **Spreadsheet** : \`${SHEET_NAME}\`
- **Onglet** : \`${TAB_NAME}\`
- Mode d’écriture : **Append rows**

### Colonnes (ordre strict)

\`\`\`text
${sheetColumns.join(", ")}
\`\`\`

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
- Sujet : \`CTA-AXIORNET — Résultats collecte (run_id) — N prospects\`
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

\`\`\`text
.
├─ workflow.json           # Export n8n (sans secrets)
├─ README.md               # Documentation
└─ create-readme.js        # Script de génération du README
\`\`\`

---

## 📜 Licence

À définir (MIT, Propriétaire, etc.).
`;

(function main() {
  const outPath = path.resolve(process.cwd(), OUTPUT);
  writeFileIfChanged(outPath, readme);
})();
