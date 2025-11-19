# 🎬 Studio Vidéo IA - Guide de Configuration

Ce guide vous permet de configurer et activer le Studio Vidéo IA dans AURION.

## 📋 Étape 1 : Appliquer le schéma Supabase

### 1.1 Exécuter le schéma SQL

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Exécutez les fichiers dans cet ordre :
   - `supabase-schema.sql` (si pas déjà fait)
   - `supabase-schema-extended.sql` (si pas déjà fait)
   - `supabase-video-jobs-schema.sql` (nouveau)

### 1.2 Vérifier la création

Exécutez cette requête pour vérifier que la table existe :

```sql
SELECT * FROM video_jobs LIMIT 1;
```

Vous devriez voir une table vide (normal si aucun job n'a été créé).

## 🔧 Étape 2 : Configurer Vercel

### 2.1 Variables d'environnement

Dans votre projet Vercel, ajoutez ces variables d'environnement (optionnel pour l'instant, nécessaire seulement pour les vrais moteurs) :

```bash
# Moteurs vidéo (optionnel - pour activer les vrais moteurs)
MOCHI_API_URL=https://votre-mochi-api.com
MOCHI_API_KEY=votre_cle_api

OPEN_SORA_API_URL=https://votre-open-sora-api.com
OPEN_SORA_API_KEY=votre_cle_api

WAN_API_URL=https://votre-wan-api.com
WAN_API_KEY=votre_cle_api
```

**Note** : Pour l'instant, le système utilise des résultats mock. Les variables ci-dessus ne sont nécessaires que lorsque vous voulez brancher les vrais moteurs.

### 2.2 Redéployer

Après avoir ajouté les variables (si nécessaire), redéployez votre application :

```bash
git push origin main
```

Vercel redéploiera automatiquement.

## ✅ Étape 3 : Tester le système

### 3.1 Accéder au Studio Vidéo

1. Connectez-vous à votre dashboard AURION
2. Faites défiler jusqu'à la section **"Studio Vidéo IA"**
3. Vous devriez voir le formulaire de génération

### 3.2 Créer un job de test

1. Sélectionnez un moteur (Mochi, Open Sora, ou Wan)
2. Entrez un prompt (minimum 10 caractères) :
   ```
   Une scène futuriste avec une ville cyberpunk, néons colorés, pluie, ambiance nocturne
   ```
3. Configurez la durée (ex: 10 secondes) et l'aspect (ex: 16:9)
4. Cliquez sur **"Lancer la génération"**

### 3.3 Vérifier le résultat

- Le job devrait apparaître dans l'historique avec le statut **"completed"**
- Un lien **"Voir la vidéo générée"** devrait être disponible (mock pour l'instant)
- Le job devrait être enregistré dans Supabase

### 3.4 Vérifier les limites d'abonnement

- Allez dans la section **"Usage & Limites"**
- Vérifiez que la génération vidéo est comptabilisée dans **"Générations IA > Vidéos"**

## 🚀 Étape 4 : Brancher les vrais moteurs

### 4.1 Structure actuelle

Le système est déjà prêt pour les vrais moteurs. Le fichier `src/lib/video-engines/index.ts` contient la structure d'intégration.

### 4.2 Implémenter un moteur

Pour activer un moteur réel (ex: Mochi), modifiez `src/lib/video-engines/index.ts` :

```typescript
export async function generateWithMochi(
  config: VideoGenerationConfig
): Promise<VideoGenerationResult> {
  const endpoint = ENGINE_ENDPOINTS.mochi;
  
  if (!endpoint) {
    throw new Error('Mochi API URL not configured');
  }

  // Appel API réel
  const response = await fetch(`${endpoint}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MOCHI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: config.prompt,
      duration: config.duration || 10,
      aspect_ratio: config.aspect || '16:9',
      style: config.style,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mochi API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    result_url: data.video_url,
    thumbnail_url: data.thumbnail_url,
    metadata: {
      duration: data.duration,
      resolution: data.resolution,
      file_size: data.file_size,
    },
  };
}
```

### 4.3 Déployer les moteurs GPU

Les moteurs Mochi, Open Sora et Wan nécessitent des serveurs GPU. Options :

1. **Déployer sur un serveur GPU** (AWS EC2 G4, Google Cloud GPU, etc.)
2. **Utiliser un service cloud** (Replicate, RunPod, etc.)
3. **Déployer localement** et exposer via tunnel (ngrok, Cloudflare Tunnel)

### 4.4 Tester avec un moteur réel

Une fois un moteur configuré :

1. Ajoutez les variables d'environnement dans Vercel
2. Redéployez
3. Créez un nouveau job vidéo
4. Le système utilisera automatiquement le moteur réel au lieu du mock

## 🔍 Dépannage

### Erreur : "Table video_jobs does not exist"
→ Exécutez `supabase-video-jobs-schema.sql` dans Supabase SQL Editor

### Erreur : "Unauthorized" lors de la création d'un job
→ Vérifiez que vous êtes connecté et que RLS est activé

### Les jobs ne s'affichent pas
→ Vérifiez la console du navigateur et les logs Vercel

### Les limites ne sont pas respectées
→ Vérifiez que `subscription-checker.ts` est bien appelé dans l'API

## 📊 Monitoring

- **Jobs créés** : Vérifiez la table `video_jobs` dans Supabase
- **Usage** : Vérifiez la table `analytics` (événements `ai_video_generation`)
- **Erreurs** : Consultez les logs Vercel pour les erreurs API

## 🎯 Prochaines étapes

- [ ] Implémenter les vrais moteurs GPU
- [ ] Ajouter un système de file d'attente (queue) pour les jobs longs
- [ ] Ajouter des webhooks pour notifier la fin de génération
- [ ] Créer une page dédiée pour la galerie de vidéos
- [ ] Ajouter l'export et le téléchargement des vidéos

---

**Status actuel** : ✅ Système fonctionnel avec mock, prêt pour intégration des vrais moteurs

