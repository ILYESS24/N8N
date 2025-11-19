# Déploiement sur Render

Ce guide explique comment déployer Workflow Automation sur Render.

## Méthode 1 : Déploiement automatique avec render.yaml

1. **Connectez votre repository GitHub à Render**
   - Allez sur [Render Dashboard](https://dashboard.render.com)
   - Cliquez sur "New" → "Blueprint"
   - Connectez votre repository GitHub
   - Render détectera automatiquement le fichier `render.yaml`

2. **Render créera automatiquement :**
   - Un service web (Workflow Automation)
   - Une base de données PostgreSQL
   - Toutes les variables d'environnement nécessaires

3. **Le déploiement commencera automatiquement**

## Méthode 2 : Déploiement manuel

### Étape 1 : Créer la base de données PostgreSQL

1. Dans Render Dashboard, cliquez sur "New" → "PostgreSQL"
2. Configurez :
   - **Name**: `workflow-automation-db`
   - **Database**: `workflow_automation`
   - **User**: `workflow_automation_user`
   - **Plan**: Starter (ou supérieur selon vos besoins)
   - **Region**: Choisissez la région la plus proche

### Étape 2 : Créer le service web

1. Dans Render Dashboard, cliquez sur "New" → "Web Service"
2. Connectez votre repository GitHub
3. Configurez :
   - **Name**: `workflow-automation`
   - **Environment**: `Node`
   - **Region**: Même région que la base de données
   - **Branch**: `main` (ou votre branche principale)
   - **Root Directory**: `/` (racine du projet)
   - **Build Command**: `pnpm install --frozen-lockfile && pnpm build`
   - **Start Command**: `node packages/cli/dist/index.js start`

### Étape 3 : Configurer les variables d'environnement

Dans les paramètres du service web, ajoutez ces variables d'environnement :

```
NODE_ENV=production
N8N_PORT=$PORT
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=<host-from-database>
DB_POSTGRESDB_PORT=<port-from-database>
DB_POSTGRESDB_DATABASE=<database-name>
DB_POSTGRESDB_USER=<user-from-database>
DB_POSTGRESDB_PASSWORD=<password-from-database>
N8N_PROTOCOL=https
```

**Note**: Render fournit automatiquement `$PORT`, utilisez-le pour `N8N_PORT`.

### Étape 4 : Configurer la base de données

Dans les paramètres de la base de données, copiez les informations de connexion et ajoutez-les comme variables d'environnement dans le service web.

## Configuration avancée

### Variables d'environnement optionnelles

- `N8N_ENCRYPTION_KEY`: Clé de chiffrement (générez-en une aléatoire)
- `N8N_USER_MANAGEMENT_JWT_SECRET`: Secret JWT (générez-en un aléatoire)
- `WORKFLOW_AUTOMATION_LOG_LEVEL`: Niveau de log (`info`, `debug`, `error`)
- `N8N_DISABLE_UI`: Désactiver l'interface utilisateur (`true`/`false`)

### Génération de secrets

Pour générer des secrets sécurisés :

```bash
# Encryption key (32 caractères)
openssl rand -hex 16

# JWT Secret (32 caractères)
openssl rand -hex 16
```

## Vérification du déploiement

Une fois déployé, vous pouvez vérifier :

1. **Health check**: `https://your-app.onrender.com/healthz`
2. **Interface utilisateur**: `https://your-app.onrender.com`
3. **Logs**: Consultez les logs dans le dashboard Render

## Dépannage

### Le service ne démarre pas

- Vérifiez les logs dans Render Dashboard
- Assurez-vous que toutes les variables d'environnement sont configurées
- Vérifiez que la base de données est accessible

### Erreurs de connexion à la base de données

- Vérifiez que les variables d'environnement de la base de données sont correctes
- Assurez-vous que le service web et la base de données sont dans la même région
- Vérifiez que la base de données est en cours d'exécution

### Port déjà utilisé

- Render gère automatiquement le port via la variable `$PORT`
- Assurez-vous que `N8N_PORT=$PORT` est configuré

## Support

Pour plus d'aide, consultez :
- [Documentation Render](https://render.com/docs)
- [Documentation Workflow Automation](../README.md)

