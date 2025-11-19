# Configuration Render - Guide Complet

## 📋 Commandes Build et Start

### Build Command
```
pnpm install --frozen-lockfile && pnpm build
```

**Explication :**
- `pnpm install --frozen-lockfile` : Installe les dépendances en utilisant le lockfile exact (pas de mise à jour)
- `pnpm build` : Compile tous les packages du monorepo

### Start Command
```
cd packages/cli && node dist/index.js start
```

**Explication :**
- Change dans le répertoire du CLI
- Lance l'application avec Node.js

---

## 🔧 Variables d'Environnement Requises

### Variables Automatiques (Render les configure)
Ces variables sont automatiquement configurées par Render via `render.yaml` :

| Variable | Source | Description |
|----------|--------|-------------|
| `N8N_PORT` | `$PORT` (Render) | Port fourni par Render |
| `DB_POSTGRESDB_HOST` | Base de données | Host PostgreSQL |
| `DB_POSTGRESDB_PORT` | Base de données | Port PostgreSQL |
| `DB_POSTGRESDB_DATABASE` | Base de données | Nom de la base |
| `DB_POSTGRESDB_USER` | Base de données | Utilisateur |
| `DB_POSTGRESDB_PASSWORD` | Base de données | Mot de passe |

### Variables à Configurer Manuellement (Optionnel)

Si vous configurez manuellement dans Render Dashboard, ajoutez ces variables :

#### Variables Obligatoires
```bash
NODE_ENV=production
N8N_PORT=$PORT
DB_TYPE=postgresdb
N8N_PROTOCOL=https
```

#### Variables de Base de Données
```bash
DB_POSTGRESDB_HOST=<host-from-database>
DB_POSTGRESDB_PORT=<port-from-database>
DB_POSTGRESDB_DATABASE=<database-name>
DB_POSTGRESDB_USER=<user-from-database>
DB_POSTGRESDB_PASSWORD=<password-from-database>
```

#### Variables Optionnelles (Sécurité)
```bash
# Générer avec: openssl rand -hex 16
N8N_ENCRYPTION_KEY=<votre-clé-32-caractères>
N8N_USER_MANAGEMENT_JWT_SECRET=<votre-secret-32-caractères>
```

#### Variables Optionnelles (Configuration)
```bash
# Logs
WORKFLOW_AUTOMATION_LOG_LEVEL=info

# URL de base (Render le fait automatiquement)
N8N_HOST=votre-app.onrender.com

# Désactiver certaines fonctionnalités si besoin
N8N_DISABLE_UI=false
N8N_DISABLE_PRODUCTION_MAIN_PROCESS=false
```

---

## 🚀 Configuration dans Render Dashboard

### Méthode 1 : Utiliser render.yaml (Recommandé)
Le fichier `render.yaml` est déjà configuré. Il suffit de :
1. Connecter votre repo GitHub à Render
2. Sélectionner "New" → "Blueprint"
3. Render détectera automatiquement `render.yaml`

### Méthode 2 : Configuration Manuelle

#### Étape 1 : Créer la Base de Données
1. **New** → **PostgreSQL**
2. Configurer :
   - **Name**: `workflow-automation-db`
   - **Database**: `workflow_automation`
   - **User**: `workflow_automation_user`
   - **Plan**: Starter

#### Étape 2 : Créer le Service Web
1. **New** → **Web Service**
2. Connecter votre repo GitHub
3. Configurer :

**Build Command :**
```
pnpm install --frozen-lockfile && pnpm build
```

**Start Command :**
```
cd packages/cli && node dist/index.js start
```

**Root Directory :**
```
/ (laisser vide ou mettre /)
```

**Node Version :**
```
22 (ou laisser vide pour utiliser la version par défaut)
```

#### Étape 3 : Variables d'Environnement

Dans les paramètres du service web, ajoutez :

**Variables de Base :**
```
NODE_ENV=production
N8N_PORT=$PORT
DB_TYPE=postgresdb
N8N_PROTOCOL=https
```

**Variables de Base de Données :**
Copiez depuis les paramètres de la base de données :
```
DB_POSTGRESDB_HOST=<copier depuis la DB>
DB_POSTGRESDB_PORT=<copier depuis la DB>
DB_POSTGRESDB_DATABASE=<copier depuis la DB>
DB_POSTGRESDB_USER=<copier depuis la DB>
DB_POSTGRESDB_PASSWORD=<copier depuis la DB>
```

**Variables de Sécurité (Optionnel mais Recommandé) :**
```
N8N_ENCRYPTION_KEY=<générer avec openssl rand -hex 16>
N8N_USER_MANAGEMENT_JWT_SECRET=<générer avec openssl rand -hex 16>
```

---

## ✅ Vérification

Une fois déployé, vérifiez :

1. **Health Check** : `https://votre-app.onrender.com/healthz`
   - Devrait retourner `{"status":"ok"}`

2. **Interface** : `https://votre-app.onrender.com`
   - Devrait afficher la page de connexion/création de compte

3. **Logs** : Dans Render Dashboard → Logs
   - Vérifiez qu'il n'y a pas d'erreurs

---

## 🔍 Dépannage

### Erreur "Port already in use"
- Assurez-vous que `N8N_PORT=$PORT` est configuré
- Render fournit automatiquement `$PORT`

### Erreur de connexion à la base de données
- Vérifiez que toutes les variables `DB_POSTGRESDB_*` sont correctes
- Assurez-vous que le service web et la DB sont dans la même région

### Build échoue
- Vérifiez que Node.js version >= 22.16
- Vérifiez que pnpm est disponible (Render l'installe automatiquement)

### Application ne démarre pas
- Vérifiez les logs dans Render Dashboard
- Assurez-vous que `packages/cli/dist/index.js` existe après le build

---

## 📝 Notes Importantes

1. **Port** : Render fournit automatiquement `$PORT`, utilisez-le pour `N8N_PORT`
2. **Base de données** : Utilisez PostgreSQL (SQLite ne fonctionne pas sur Render)
3. **Build** : Le build peut prendre 5-10 minutes la première fois
4. **Déploiement** : Render redéploie automatiquement à chaque push sur la branche principale

