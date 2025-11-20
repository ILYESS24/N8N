# Script de Correction Automatique des Imports

## 📋 Description

Ce script (`scripts/fix-imports.mjs`) corrige automatiquement **TOUS** les imports dans le codebase avant chaque build, garantissant que le déploiement fonctionne du premier coup.

## 🔧 Fonctionnement

Le script :
1. ✅ Parcourt récursivement tous les fichiers TypeScript/JavaScript/Vue
2. ✅ Remplace `@n8n/` par `@workflow-automation/` (sauf packages externes)
3. ✅ Remplace `n8n-workflow` par `workflow-automation-workflow`
4. ✅ Remplace `n8n-core` par `workflow-automation-core`
5. ✅ **Préserve** les packages externes qui doivent rester `@n8n/`:
   - `@n8n/typeorm`
   - `@n8n_io/ai-assistant-sdk`
   - `@n8n_io/license-sdk`
   - `@n8n/localtunnel`
   - `@n8n/vm2`
   - `@n8n/imap`
   - `@n8n/client-oauth2`
   - `@n8n/tournament`

## 🚀 Utilisation

### Exécution manuelle

```bash
pnpm fix:imports
# ou
node scripts/fix-imports.mjs
```

### Exécution automatique

Le script s'exécute automatiquement :
- ✅ **Avant chaque build** (`prebuild` hook dans `package.json`)
- ✅ **Pendant le déploiement sur Render** (intégré dans `render.yaml`)

## 📦 Intégration

### package.json

```json
{
  "scripts": {
    "fix:imports": "node scripts/fix-imports.mjs",
    "prebuild": "node scripts/fix-imports.mjs",
    "build": "turbo run build"
  }
}
```

### render.yaml

```yaml
buildCommand: pnpm install --frozen-lockfile && node scripts/fix-imports.mjs && pnpm build
```

## ⚡ Performance

- Traite ~9000+ fichiers en ~2 minutes
- Ignore automatiquement `node_modules`, `.git`, `dist`, `build`
- Ne modifie que les fichiers nécessaires

## ✅ Résultat

Le script garantit que **tous les imports sont corrects** avant le build, évitant les erreurs de déploiement liées aux imports incorrects.

## 🔍 Vérification

Après exécution, le script affiche :
- Nombre de fichiers traités
- Nombre de fichiers modifiés
- Nombre total de remplacements
- Durée d'exécution

---

**Note**: Les modifications sont faites directement dans les fichiers. Assurez-vous de vérifier les changements avant de commiter.

