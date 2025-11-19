# 🚀 Guide Rapide - Déploiement Render

## Configuration Actuelle

Votre `render.yaml` est configuré avec :

### ✅ Build Command
```
pnpm install --frozen-lockfile && pnpm build
```

### ✅ Start Command
```
cd packages/cli && node dist/index.js start
```

### ✅ Variables d'Environnement (Automatiques)
Toutes les variables sont configurées automatiquement via `render.yaml` :
- `NODE_ENV=production`
- `N8N_PORT=$PORT` (fourni par Render)
- `DB_TYPE=postgresdb`
- Variables de base de données PostgreSQL (connectées automatiquement)

---

## 📝 Si Configuration Manuelle Nécessaire

Si vous devez configurer manuellement dans Render Dashboard :

### Build Command
```
pnpm install --frozen-lockfile && pnpm build
```

### Start Command
```
cd packages/cli && node dist/index.js start
```

### Root Directory
```
Downloads/n8n-master/n8n-master
```

### Variables d'Environnement Minimales
```
NODE_ENV=production
N8N_PORT=$PORT
DB_TYPE=postgresdb
N8N_PROTOCOL=https
```

Plus les variables de base de données depuis votre DB PostgreSQL.

---

## ⚠️ Important

Le `rootDir` dans render.yaml pointe vers `Downloads/n8n-master/n8n-master` car c'est là que se trouve le `package.json` dans votre structure de repository GitHub.

Si Render ne trouve toujours pas le fichier, vérifiez la structure de votre repo sur GitHub et ajustez le `rootDir` en conséquence.

