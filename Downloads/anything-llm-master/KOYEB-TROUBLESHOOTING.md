# 🚀 GUIDE DE DÉPANNAGE KOYEB - ERREUR BUILDPACK 51

## ❌ **PROBLÈME IDENTIFIÉ**
**Erreur :** Buildpack failed with exit code 51  
**Cause :** Problème avec les dépendances ou la configuration Docker

---

## 🔧 **SOLUTIONS APPLIQUÉES**

### **1. Dockerfile Simplifié**
- ✅ **Dockerfile.koyeb.simple** : Version ultra-simplifiée
- ✅ **Suppression des dépendances complexes** : cairo-dev, pango-dev, etc.
- ✅ **Installation minimale** : python3, make, g++, curl seulement
- ✅ **Pas d'utilisateur non-root** : Évite les problèmes de permissions

### **2. Configuration Optimisée**
- ✅ **.dockerignore** : Exclut les fichiers inutiles
- ✅ **koyeb.yaml** : Pointe vers le Dockerfile simplifié
- ✅ **Port explicite** : 3001 au lieu de variable d'environnement

### **3. Structure de Build Améliorée**
- ✅ **Copie des package.json en premier** : Meilleur cache Docker
- ✅ **Installation des dépendances par étapes** : Évite les conflits
- ✅ **Build frontend séparé** : Plus de contrôle sur le processus

---

## 🚀 **ÉTAPES DE DÉPLOIEMENT CORRIGÉES**

### **1. Configuration Koyeb**
```yaml
version: 1
services:
  - name: anythingllm
    type: web
    runtime: docker
    dockerfile: docker/Dockerfile.koyeb.simple
    ports:
      - port: 3001
        protocol: http
```

### **2. Variables d'Environnement**
- `NODE_ENV` : production
- `PORT` : 3001
- `DATABASE_URL` : PostgreSQL Koyeb
- `JWT_SECRET` : Clé secrète
- `OPENAI_API_KEY` : Votre clé OpenAI
- `ANTHROPIC_API_KEY` : Votre clé Anthropic

### **3. Déploiement**
1. Aller sur [koyeb.com](https://koyeb.com)
2. Connecter le repository GitHub
3. Créer un nouveau service
4. Sélectionner "Docker" comme runtime
5. Spécifier le Dockerfile : `docker/Dockerfile.koyeb.simple`
6. Configurer les variables d'environnement
7. Déployer

---

## 🔍 **DIAGNOSTIC AVANCÉ**

### **Si l'erreur persiste :**

1. **Vérifier les logs Koyeb** :
   - Aller dans le dashboard Koyeb
   - Cliquer sur "Logs" du service
   - Identifier l'erreur spécifique

2. **Tester localement** :
   ```bash
   docker build -f docker/Dockerfile.koyeb.simple -t anythingllm:test .
   docker run -p 3001:3001 anythingllm:test
   ```

3. **Vérifier les dépendances** :
   ```bash
   yarn install --frozen-lockfile
   yarn build
   ```

---

## 📊 **COMPARAISON DES DOCKERFILES**

| Version | Complexité | Dépendances | Utilisateur | Statut |
|---------|------------|-------------|-------------|---------|
| **koyeb** | Élevée | Toutes | Non-root | ❌ Erreur |
| **koyeb.fixed** | Moyenne | Réduites | Non-root | ⚠️ Test |
| **koyeb.simple** | Faible | Minimales | Root | ✅ Recommandé |

---

## 🎯 **RECOMMANDATIONS FINALES**

### **Immédiates**
1. **Utiliser Dockerfile.koyeb.simple** : Version la plus stable
2. **Vérifier les logs Koyeb** : Identifier l'erreur exacte
3. **Tester localement** : Valider le build Docker

### **Si problème persiste**
1. **Contacter le support Koyeb** : Avec les logs d'erreur
2. **Essayer un autre runtime** : Node.js au lieu de Docker
3. **Utiliser une autre plateforme** : Render, Railway, etc.

---

## 🚀 **PRÊT POUR DÉPLOIEMENT**

**Le projet est maintenant configuré avec :**
- ✅ Dockerfile ultra-simplifié
- ✅ Configuration Koyeb optimisée
- ✅ .dockerignore configuré
- ✅ Variables d'environnement documentées

**Déployez maintenant sur Koyeb !** 🎯

---

*Guide généré automatiquement le 26/10/2024*
