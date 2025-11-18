# Système Multi-Utilisateurs pour AURION

## Vue d'ensemble

AURION est maintenant un vrai SaaS multi-utilisateurs où chaque utilisateur peut utiliser les outils intégrés de manière indépendante, avec ses propres données et projets.

## Fonctionnalités Implémentées

### 1. Authentification par Utilisateur

- **Token d'authentification** : Chaque utilisateur reçoit un token unique lors de l'accès aux outils
- **Isolation des données** : Les données sont filtrées par `user_id` dans toutes les requêtes
- **Sessions utilisateur** : Suivi des sessions actives avec Supabase

### 2. Intégration des Outils via Iframe

Tous les outils sont intégrés via `ToolIframeWrapper` qui :
- Génère une URL authentifiée avec le token utilisateur
- Passe l'ID utilisateur et le token via les paramètres URL
- Écoute les messages `postMessage` depuis les outils
- Synchronise les données entre AURION et les outils

### 3. API de Synchronisation des Données

#### `/api/tools/auth`
- **POST** : Valide un token d'authentification
- **GET** : Récupère les informations utilisateur depuis un token

#### `/api/tools/data`
- **GET** : Charge les données utilisateur pour un outil spécifique
- **POST** : Sauvegarde les données utilisateur depuis un outil
- **PUT** : Met à jour les données utilisateur

### 4. Communication PostMessage

Les outils peuvent communiquer avec AURION via `postMessage` :

```javascript
// Depuis un outil intégré
window.parent.postMessage({
  type: 'aurion:save',
  payload: {
    type: 'workspace',
    data: { /* données à sauvegarder */ },
    title: 'Mon Projet'
  }
}, '*');

// Charger des données
window.parent.postMessage({
  type: 'aurion:load',
  payload: {
    type: 'workspace'
  }
}, '*');

// Tracker une activité
window.parent.postMessage({
  type: 'aurion:track',
  payload: {
    activity_type: 'code-saved',
    data: { /* données d'activité */ }
  }
}, '*');
```

### 5. Isolation des Données

Toutes les tables Supabase utilisent Row Level Security (RLS) :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Les requêtes sont automatiquement filtrées par `user_id`
- Les tokens d'authentification sont validés à chaque requête

## Structure des URLs Authentifiées

Les outils reçoivent des URLs avec les paramètres suivants :
- `aurion_token` : Token d'authentification (base64)
- `aurion_user_id` : ID utilisateur Supabase
- `aurion_api` : URL de l'API AURION pour les requêtes
- `workspace` : Espace de travail par défaut

Exemple :
```
https://tool.example.com/?aurion_token=xxx&aurion_user_id=yyy&aurion_api=https://aurion.com/api/tools&workspace=default
```

## Outils Intégrés

1. **Bolt.new** (`/tools/bolt`)
   - Builder de sites web avec IA
   - URL : `https://a0984a33.ai-assistant-xlv.pages.dev/`

2. **Open Agent Builder** (`/tools/agent-builder`)
   - Création d'agents IA avec workflows
   - URL : `https://open-agent-builder-lchp73l76-ibagencys-projects.vercel.app/`

3. **AI Editor** (`/tools/aieditor`)
   - Éditeur de texte riche avec IA
   - URL : `https://5ae0c482.aieditor.pages.dev/`

4. **Langchain** (`/tools/langchain`)
   - Framework LLM pour applications IA
   - URL : `https://34c96d83.langchain-ai.pages.dev/`

5. **Sandpack** (`/tools/sandpack`)
   - Éditeur de code avec preview
   - URL : `https://sandpack-33otn5ijo-ibagencys-projects.vercel.app/`

## Sécurité

- **Tokens expirables** : Les tokens expirent après 24h
- **Validation côté serveur** : Toutes les requêtes API valident le token
- **RLS activé** : Row Level Security sur toutes les tables
- **Sandbox iframe** : Les iframes utilisent `sandbox` pour la sécurité

## Prochaines Étapes

Pour que les outils externes utilisent pleinement ce système :

1. **Détecter les paramètres AURION** dans l'URL
2. **Valider le token** via `/api/tools/auth`
3. **Utiliser l'API AURION** pour sauvegarder/charger les données
4. **Envoyer des messages** via `postMessage` pour la synchronisation

## Exemple d'Intégration dans un Outil

```javascript
// Dans un outil intégré (ex: Bolt.new)
const urlParams = new URLSearchParams(window.location.search);
const aurionToken = urlParams.get('aurion_token');
const aurionUserId = urlParams.get('aurion_user_id');
const aurionApi = urlParams.get('aurion_api');

if (aurionToken && aurionApi) {
  // Valider le token
  const response = await fetch(`${aurionApi}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: aurionToken })
  });
  
  const { valid, userId } = await response.json();
  
  if (valid) {
    // Utiliser userId pour isoler les données
    // Sauvegarder via postMessage
    window.parent.postMessage({
      type: 'aurion:save',
      payload: {
        type: 'project',
        data: projectData,
        title: 'Mon Projet'
      }
    }, '*');
  }
}
```

## Conclusion

AURION est maintenant un vrai SaaS multi-utilisateurs où chaque utilisateur a :
- Ses propres projets et données
- Un accès authentifié aux outils
- Une synchronisation automatique des données
- Une expérience isolée et sécurisée

