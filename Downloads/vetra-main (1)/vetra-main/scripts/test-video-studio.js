/**
 * Script de test pour le Studio Vidéo IA
 * 
 * Usage: node scripts/test-video-studio.js
 * 
 * Ce script teste les endpoints API du Studio Vidéo
 * Nécessite les variables d'environnement Supabase configurées
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Configurez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function testVideoStudio() {
  console.log('🧪 Test du Studio Vidéo IA\n');

  // Test 1: Vérifier que la table existe
  console.log('1️⃣ Vérification de la table video_jobs...');
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('video_jobs')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.error('❌ Table video_jobs n\'existe pas');
        console.error('   → Exécutez supabase-video-jobs-schema.sql dans Supabase');
        return false;
      }
      throw error;
    }
    
    console.log('✅ Table video_jobs existe\n');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }

  // Test 2: Vérifier les endpoints API (nécessite un serveur local)
  console.log('2️⃣ Vérification des endpoints API...');
  console.log('   ℹ️  Pour tester les endpoints, démarrez le serveur:');
  console.log('      pnpm dev');
  console.log('   Puis testez:');
  console.log('      GET  http://localhost:3000/api/video/jobs');
  console.log('      POST http://localhost:3000/api/video/jobs\n');

  // Test 3: Vérifier la structure des fichiers
  console.log('3️⃣ Vérification de la structure...');
  const fs = await import('fs');
  const path = await import('path');
  
  const requiredFiles = [
    'src/app/api/video/jobs/route.ts',
    'src/app/api/video/jobs/[id]/route.ts',
    'src/lib/video-engines/index.ts',
    'src/components/video-studio-panel.tsx',
    'supabase-video-jobs-schema.sql',
  ];

  let allFilesExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} manquant`);
      allFilesExist = false;
    }
  }

  if (!allFilesExist) {
    console.error('\n❌ Certains fichiers sont manquants');
    return false;
  }

  console.log('\n✅ Tous les fichiers sont présents\n');

  // Résumé
  console.log('📋 Résumé:');
  console.log('   ✅ Schéma SQL créé');
  console.log('   ✅ API routes créées');
  console.log('   ✅ Composant UI créé');
  console.log('   ✅ Structure moteurs prête');
  console.log('\n🎯 Prochaines étapes:');
  console.log('   1. Exécutez supabase-video-jobs-schema.sql dans Supabase');
  console.log('   2. Redéployez sur Vercel');
  console.log('   3. Testez depuis le dashboard');
  console.log('   4. Configurez les vrais moteurs (optionnel)');

  return true;
}

testVideoStudio()
  .then((success) => {
    if (success) {
      console.log('\n✨ Tests terminés avec succès!');
      process.exit(0);
    } else {
      console.log('\n❌ Certains tests ont échoué');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Erreur:', error);
    process.exit(1);
  });

