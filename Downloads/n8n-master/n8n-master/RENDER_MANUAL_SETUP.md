# Configuration Manuelle Render - Si Blueprint ne fonctionne pas

Si le Blueprint (render.yaml) ne fonctionne pas, configurez manuellement :

## 🔧 Configuration dans Render Dashboard

### 1. Créer la Base de Données PostgreSQL

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur **"New"** → **"PostgreSQL"**
3. Configurez :
   - **Name**: `workflow-automation-db`
   - **Database**: `workflow_automation`
   - **User**: `workflow_automation_user`
   - **Plan**: Starter
   - **Region**: Oregon (ou votre région préférée)

### 2. Créer le Service Web

1. Cliquez sur **"New"** → **"Web Service"**
2. Connectez votre repository GitHub : `ILYESS24/N8N`
3. Sélectionnez la branche : `main`

### 3. Configuration du Service

#### Environment
```
Node
```

#### Build Command
```
pnpm install --frozen-lockfile && pnpm build
```

#### Start Command
```
cd packages/cli && node dist/index.js start
```

#### Root Directory
```
(laisser vide - laisser à la racine)
```

#### Node Version
```
22.16.0
```

### 4. Variables d'Environnement

Dans la section **"Environment"**, ajoutez ces variables :

#### Variables de Base
```
NODE_ENV=production
N8N_PORT=$PORT
DB_TYPE=postgresdb
N8N_PROTOCOL=https
```

#### Variables de Base de Données
Copiez depuis les paramètres de votre base de données PostgreSQL :

```
DB_POSTGRESDB_HOST=<copier depuis la DB>
DB_POSTGRESDB_PORT=<copier depuis la DB>
DB_POSTGRESDB_DATABASE=<copier depuis la DB>
DB_POSTGRESDB_USER=<copier depuis la DB>
DB_POSTGRESDB_PASSWORD=<copier depuis la DB>
```

**Important** : Pour `N8N_PORT`, utilisez `$PORT` (Render le remplace automatiquement)

#### Variables Optionnelles (Sécurité - Recommandé)

Générez des secrets avec :
```bash
openssl rand -hex 16
```

Puis ajoutez :
```
N8N_ENCRYPTION_KEY=<votre-clé-générée>
N8N_USER_MANAGEMENT_JWT_SECRET=<votre-secret-généré>
```

### 5. Health Check Path
```
/healthz
```

### 6. Plan
```
Starter (ou supérieur selon vos besoins)
```

### 7. Region
```
Oregon (ou la même région que votre base de données)
```

---

## ✅ Vérification

Une fois déployé :

1. **Health Check** : `https://votre-app.onrender.com/healthz`
   - Devrait retourner `{"status":"ok"}`

2. **Interface** : `https://votre-app.onrender.com`
   - Devrait afficher la page de connexion

3. **Logs** : Vérifiez les logs dans Render Dashboard
   - Pas d'erreurs = succès ✅

---

## 🔍 Dépannage

### Erreur "No package.json found"
- Vérifiez que le **Root Directory** est vide (pas de `/n8n-master`)
- Vérifiez que le repository contient bien `package.json` à la racine

### Erreur "Port already in use"
- Assurez-vous que `N8N_PORT=$PORT` est configuré
- Render fournit automatiquement `$PORT`

### Erreur de connexion à la base de données
- Vérifiez que toutes les variables `DB_POSTGRESDB_*` sont correctes
- Assurez-vous que le service web et la DB sont dans la même région
- Vérifiez que la base de données est bien créée et en cours d'exécution

### Build échoue
- Vérifiez que Node.js version 22.16.0 est sélectionnée
- Vérifiez que pnpm est disponible (Render l'installe automatiquement)
- Consultez les logs de build pour plus de détails

---

## 📝 Notes

- Le build peut prendre 5-10 minutes la première fois
- Render redéploie automatiquement à chaque push sur `main`
- Les variables d'environnement sont sécurisées et ne sont pas visibles dans les logs

