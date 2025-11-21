# Configuration des Variables d'Environnement Vercel

## ⚠️ Erreur Actuelle
```
Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

Cette erreur indique que les variables d'environnement Supabase ne sont pas configurées dans Vercel.

## 🔧 Solution : Configurer les Variables dans Vercel

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. **Accédez au Dashboard Vercel**
   - Allez sur https://vercel.com/dashboard
   - Sélectionnez votre projet `vetra-main`

2. **Ouvrez les Settings**
   - Cliquez sur **Settings** dans le menu du projet
   - Allez dans **Environment Variables**

3. **Ajoutez les Variables Suivantes**

   Pour **Production**, **Preview**, et **Development** :

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gvfuxlqvfvqdqhzjkyok.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZnV4bHF2ZnZxZHFoempreW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTkyNzgsImV4cCI6MjA3ODk5NTI3OH0.y0f05lxJevY7wkS82FW2y2Kz4GbUauWzn0enH8-rDmE
   ```

   **Variables Optionnelles (Recommandées)** :
   ```
   ENCRYPTION_KEY=<générer avec: openssl rand -hex 32>
   DEEPSEEK_API_KEY=sk-491b1fc66cc14b3aaf40ea6511008bfa
   NEXT_PUBLIC_APP_URL=https://vetra-main-1he9ob28z-ibagencys-projects.vercel.app
   ```

4. **Redéployez**
   - Après avoir ajouté les variables, allez dans **Deployments**
   - Cliquez sur les 3 points (...) du dernier déploiement
   - Sélectionnez **Redeploy**

### Méthode 2 : Via la CLI Vercel

```bash
# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Collez: https://gvfuxlqvfvqdqhzjkyok.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Collez: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZnV4bHF2ZnZxZHFoempreW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTkyNzgsImV4cCI6MjA3ODk5NTI3OH0.y0f05lxJevY7wkS82FW2y2Kz4GbUauWzn0enH8-rDmE

# Redéployer
vercel --prod
```

### Méthode 3 : Fichier `.env.production` (Non recommandé pour les secrets)

Si vous préférez, vous pouvez créer un fichier `.env.production` localement, mais **ne le commitez JAMAIS** dans Git.

## ✅ Vérification

Après avoir configuré les variables et redéployé, vérifiez que l'erreur a disparu en visitant :
```
https://vetra-main-1he9ob28z-ibagencys-projects.vercel.app
```

## 🔐 Variables Requises (Minimum)

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📋 Variables Recommandées (Pour toutes les fonctionnalités)

- `ENCRYPTION_KEY` - Pour le chiffrement des données
- `DEEPSEEK_API_KEY` - Pour l'IA
- `NEXT_PUBLIC_APP_URL` - Pour les callbacks et webhooks
- `STRIPE_SECRET_KEY` - Pour les paiements
- `STRIPE_PUBLISHABLE_KEY` - Pour les paiements
- `STRIPE_WEBHOOK_SECRET` - Pour les webhooks Stripe

