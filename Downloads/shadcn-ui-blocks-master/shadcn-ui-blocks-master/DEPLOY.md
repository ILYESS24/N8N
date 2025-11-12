# Guide de déploiement sur Vercel

Ce projet est optimisé pour le déploiement sur **Vercel**, la plateforme recommandée pour les applications Next.js.

## Pourquoi Vercel ?

- ✅ Support natif et complet de Next.js 15
- ✅ Support des Server Components et Server Actions
- ✅ Gestion optimale du système de fichiers pour la lecture de fichiers statiques
- ✅ Déploiement automatique depuis Git
- ✅ Configuration minimale requise
- ✅ Plan gratuit généreux

## Déploiement rapide

### Option 1 : Via l'interface Vercel (Recommandé)

1. **Connectez-vous à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub/GitLab/Bitbucket

2. **Importez votre projet**
   - Cliquez sur "Add New Project"
   - Sélectionnez votre dépôt Git
   - Vercel détectera automatiquement Next.js

3. **Configuration**
   - **Framework Preset**: Next.js (détecté automatiquement)
   - **Root Directory**: `shadcn-ui-blocks-master` (si nécessaire)
   - **Build Command**: `npm run build` (par défaut)
   - **Output Directory**: `.next` (par défaut)
   - **Install Command**: `npm install` (par défaut)

4. **Variables d'environnement**
   - Aucune variable d'environnement requise pour ce projet

5. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (2-3 minutes)
   - Votre site sera disponible sur une URL `*.vercel.app`

### Option 2 : Via la CLI Vercel

1. **Installez la CLI Vercel**
   ```bash
   npm i -g vercel
   ```

2. **Connectez-vous**
   ```bash
   vercel login
   ```

3. **Déployez**
   ```bash
   cd shadcn-ui-blocks-master
   vercel
   ```

4. **Pour la production**
   ```bash
   vercel --prod
   ```

## Configuration du projet

Le fichier `vercel.json` est déjà configuré avec les paramètres optimaux pour Next.js.

## Vérification post-déploiement

Après le déploiement, vérifiez que :
- ✅ Le build s'est terminé sans erreur
- ✅ Les pages se chargent correctement
- ✅ Les composants sont rendus
- ✅ La coloration syntaxique fonctionne (composants serveur)

## Support

- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs
- Issues : https://github.com/shadcnblocks/shadcn-ui-blocks/issues

