#!/usr/bin/env node

/**
 * Script pour corriger tous les imports de sous-chemins invalides
 * Remplace @workflow-automation/design-system/* et @workflow-automation/chat/* 
 * par des imports valides depuis les points d'entrée principaux
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative as pathRelative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Packages avec leurs exports valides
const PACKAGE_EXPORTS = {
	'@workflow-automation/design-system': {
		main: 'src/index.ts',
		validSubpaths: ['style.css'], // Seul export valide de sous-chemin
	},
	'@workflow-automation/chat': {
		main: 'src/index.ts',
		validSubpaths: ['style.css'], // Seul export valide de sous-chemin
	},
};

// Mappings des imports de sous-chemins vers leurs exports depuis le point d'entrée
const SUBPATH_MAPPINGS = {
	// Design system
	'@workflow-automation/design-system/utils': '@workflow-automation/design-system',
	'@workflow-automation/design-system/components/N8nBreadcrumbs/Breadcrumbs.vue': '@workflow-automation/design-system',
	'@workflow-automation/design-system/components/N8nIcon/icons': '@workflow-automation/design-system',
	'@workflow-automation/design-system/src/components/N8nIcon/icons': '@workflow-automation/design-system',
	'@workflow-automation/design-system/src/css/index.scss': '../../@n8n/design-system/src/css/index.scss', // Chemin relatif pour SCSS
	
	// Chat - chemins directs
	'@workflow-automation/chat/utils': '@workflow-automation/chat',
	'@workflow-automation/chat/src/event-buses': '@workflow-automation/chat',
	'@workflow-automation/chat/src/utils': '@workflow-automation/chat',
	'@workflow-automation/chat/src/types': '@workflow-automation/chat',
	'@workflow-automation/chat/src/constants': '@workflow-automation/chat',
	'@workflow-automation/chat/src/components/MessagesList.vue': '@workflow-automation/chat',
	'@workflow-automation/chat/src/components/Input.vue': '@workflow-automation/chat',
};

const FILE_EXTENSIONS = ['.ts', '.mts', '.vue'];
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.turbo', 'coverage'];

let totalFiles = 0;
let modifiedFiles = 0;
let totalReplacements = 0;

function shouldIgnore(path) {
	const parts = path.split(/[/\\]/);
	return IGNORE_DIRS.some((dir) => parts.includes(dir));
}

function getRelativePath(fromPath, toPath) {
	const fromDir = dirname(fromPath);
	let relPath = pathRelative(fromDir, toPath);
	// Normaliser les séparateurs de chemin
	relPath = relPath.replace(/\\/g, '/');
	// S'assurer que le chemin commence par ./
	if (!relPath.startsWith('.')) {
		relPath = `./${relPath}`;
	}
	return relPath;
}

function fixSubpathImports(content, filePath) {
	let modified = false;
	let replacements = 0;
	let newContent = content;

	// Étape 0: Corriger les imports internes du package @workflow-automation/chat
	// Si le fichier est dans packages/frontend/@n8n/chat/src, remplacer les imports depuis @workflow-automation/chat par des chemins relatifs
	const chatPackagePath = join(rootDir, 'packages', 'frontend', '@n8n', 'chat', 'src');
	const normalizedChatPath = chatPackagePath.replace(/\\/g, '/');
	const normalizedFilePath = filePath.replace(/\\/g, '/');
	
	if (normalizedFilePath.startsWith(normalizedChatPath)) {
		// CORRECTION FORCÉE: Remplacer TOUS les imports depuis @workflow-automation/chat par des chemins relatifs
		
		// Pattern 1: import DefaultName from "@workflow-automation/chat"
		const defaultImportPattern = /import\s+(\w+)\s+from\s+(['"])(@workflow-automation\/chat)(['"])/g;
		newContent = newContent.replace(defaultImportPattern, (match, importName, quote1, pkg, quote2) => {
			// Vérifier si le composant existe dans components/
			const componentPath = join(chatPackagePath, 'components', `${importName}.vue`);
			const componentIndexPath = join(chatPackagePath, 'components', 'index.ts');
			
			let targetPath;
			try {
				if (statSync(componentPath).isFile()) {
					// Le composant existe directement
					targetPath = componentPath;
				} else {
					// Essayer depuis components/index.ts
					targetPath = componentIndexPath;
				}
			} catch (e) {
				// Le composant n'existe pas, utiliser index.ts principal
				targetPath = join(chatPackagePath, 'index.ts');
			}
			
			// Calculer le chemin relatif
			const relativePath = getRelativePath(filePath, targetPath).replace(/\\/g, '/');
			modified = true;
			replacements++;
			return `import ${importName} from ${quote1}${relativePath}${quote2}`;
		});
		
		// Pattern 2: import { Name1, Name2 } from "@workflow-automation/chat"
		const namedImportPattern = /import\s+\{([^}]+)\}\s+from\s+(['"])(@workflow-automation\/chat)(['"])/g;
		newContent = newContent.replace(namedImportPattern, (match, imports, quote1, pkg, quote2) => {
			const targetPath = join(chatPackagePath, 'index.ts');
			const relativePath = getRelativePath(filePath, targetPath).replace(/\\/g, '/');
			modified = true;
			replacements++;
			return `import {${imports}} from ${quote1}${relativePath}${quote2}`;
		});
		
		// Pattern 3: import * as Name from "@workflow-automation/chat"
		const namespaceImportPattern = /import\s+\*\s+as\s+(\w+)\s+from\s+(['"])(@workflow-automation\/chat)(['"])/g;
		newContent = newContent.replace(namespaceImportPattern, (match, importName, quote1, pkg, quote2) => {
			const targetPath = join(chatPackagePath, 'index.ts');
			const relativePath = getRelativePath(filePath, targetPath).replace(/\\/g, '/');
			modified = true;
			replacements++;
			return `import * as ${importName} from ${quote1}${relativePath}${quote2}`;
		});
		
		// Pattern 4: Tous les autres imports depuis @workflow-automation/chat (avec ou sans sous-chemin)
		const internalImportPattern = /(['"])(@workflow-automation\/chat)(\/([^'"]+))?(['"])/g;
		newContent = newContent.replace(internalImportPattern, (match, quote1, pkg, subpathPart, subpath, quote2) => {
			// Nettoyer le sous-chemin (enlever src/ si présent)
			let cleanSubpath = subpath ? subpath.replace(/^src\//, '') : '';
			
			// Déterminer le chemin cible
			let targetPath;
			if (!cleanSubpath) {
				// Import depuis le point d'entrée principal -> utiliser index.ts
				targetPath = join(chatPackagePath, 'index.ts');
			} else {
				// Construire le chemin cible
				targetPath = join(chatPackagePath, cleanSubpath);
				
				// Si le chemin ne se termine pas par .ts, .vue, .mts, etc., essayer d'ajouter l'extension
				try {
					const stat = statSync(targetPath);
					if (stat.isDirectory()) {
						// C'est un répertoire, chercher index.ts
						targetPath = join(targetPath, 'index.ts');
					} else if (!targetPath.match(/\.(ts|vue|mts|js|mjs)$/)) {
						// Pas d'extension, essayer avec .ts
						const tsPath = targetPath + '.ts';
						try {
							if (statSync(tsPath).isFile()) {
								targetPath = tsPath;
							}
						} catch (e) {
							// Ignorer
						}
					}
				} catch (e) {
					// Le fichier n'existe pas, essayer avec .ts
					const tsPath = targetPath + '.ts';
					try {
						if (statSync(tsPath).isFile()) {
							targetPath = tsPath;
						}
					} catch (e2) {
						// Ignorer l'erreur, utiliser index.ts
						targetPath = join(chatPackagePath, 'index.ts');
					}
				}
			}
			
			// Calculer le chemin relatif
			const relativePath = getRelativePath(filePath, targetPath).replace(/\\/g, '/');
			modified = true;
			replacements++;
			return `${quote1}${relativePath}${quote2}`;
		});
	}

	// Étape 1: Corriger les chemins relatifs vers @workflow-automation/package/src/...
	// Pattern: ../../../../@workflow-automation/package/src/...
	// Ce pattern doit capturer n'importe quel nombre de ../ avant @workflow-automation
	const relativePathPattern = /(['"])((?:\.\.\/)+)@workflow-automation\/(chat|design-system)\/src\/([^'"]+)(['"])/g;
	newContent = newContent.replace(relativePathPattern, (match, quote1, dots, pkg, subpath, quote2) => {
		const fullPath = `@workflow-automation/${pkg}/src/${subpath}`;
		
		// Vérifier si c'est dans les mappings
		if (SUBPATH_MAPPINGS[fullPath]) {
			modified = true;
			replacements++;
			return `${quote1}${SUBPATH_MAPPINGS[fullPath]}${quote2}`;
		}
		
		// Sinon, remplacer par le point d'entrée principal
		modified = true;
		replacements++;
		return `${quote1}@workflow-automation/${pkg}${quote2}`;
	});

	// Étape 2: Remplacer tous les imports de sous-chemins connus (chemins directs)
	for (const [subpath, replacement] of Object.entries(SUBPATH_MAPPINGS)) {
		// Pattern pour import/from avec le sous-chemin
		const patterns = [
			// import ... from '@workflow-automation/package/subpath'
			new RegExp(`(import\\s+[^'"]*from\\s+['"])${subpath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`, 'g'),
			// import '@workflow-automation/package/subpath'
			new RegExp(`(import\\s+['"])${subpath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`, 'g'),
			// require('@workflow-automation/package/subpath')
			new RegExp(`(require\\(['"])${subpath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"]\\))`, 'g'),
		];

		for (const pattern of patterns) {
			if (pattern.test(newContent)) {
				newContent = newContent.replace(pattern, `$1${replacement}$2`);
				modified = true;
				replacements++;
			}
		}
	}

	// Étape 3: Remplacer les autres imports de sous-chemins génériques (sauf ceux valides)
	for (const [pkg, config] of Object.entries(PACKAGE_EXPORTS)) {
		// Pattern pour détecter les imports de sous-chemins
		const subpathPattern = new RegExp(
			`(['"])${pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([^'"]+)(['"])`,
			'g',
		);

		newContent = newContent.replace(subpathPattern, (match, quote1, subpath, quote2) => {
			// Si c'est un export valide, on le garde
			if (config.validSubpaths.includes(subpath)) {
				return match;
			}

			// Si c'est dans src/, on remplace par le point d'entrée principal
			if (subpath.startsWith('src/')) {
				modified = true;
				replacements++;
				return `${quote1}${pkg}${quote2}`;
			}

			// Sinon, on remplace par le point d'entrée principal
			modified = true;
			replacements++;
			return `${quote1}${pkg}${quote2}`;
		});
	}

	return { content: newContent, modified, replacements };
}

function walkDirectory(dir, callback) {
	try {
		const entries = readdirSync(dir);

		for (const entry of entries) {
			const fullPath = join(dir, entry);

			if (shouldIgnore(fullPath)) {
				continue;
			}

			const stat = statSync(fullPath);

			if (stat.isDirectory()) {
				walkDirectory(fullPath, callback);
			} else if (stat.isFile()) {
				const ext = entry.substring(entry.lastIndexOf('.'));
				if (FILE_EXTENSIONS.includes(ext)) {
					callback(fullPath);
				}
			}
		}
	} catch (error) {
		// Ignorer les erreurs
	}
}

function processFile(filePath) {
	totalFiles++;

	try {
		const content = readFileSync(filePath, 'utf8');
		
		// Vérifier si le fichier contient des imports problématiques
		const hasProblematicImports = /(\.\.\/)+@workflow-automation\/(chat|design-system)\/src\//.test(content) ||
			/@workflow-automation\/(chat|design-system)\/src\//.test(content);
		
		if (hasProblematicImports) {
			console.log(`⚠️  Fichier avec imports problématiques: ${filePath}`);
		}
		
		const { content: newContent, modified, replacements } = fixSubpathImports(content, filePath);

		if (modified) {
			writeFileSync(filePath, newContent, 'utf8');
			modifiedFiles++;
			totalReplacements += replacements;
			console.log(`✅ Corrigé: ${filePath} (${replacements} remplacements)`);
			return true;
		}
	} catch (error) {
		console.error(`❌ Erreur avec ${filePath}:`, error.message);
	}

	return false;
}

function main() {
	console.log('🔧 Correction de tous les imports de sous-chemins...\n');

	const startTime = Date.now();

	// Traiter editor-ui ET tous les autres packages frontend qui pourraient avoir des imports problématiques
	const frontendDir = join(rootDir, 'packages', 'frontend');
	
	// Traiter editor-ui
	const editorUiDir = join(frontendDir, 'editor-ui', 'src');
	if (statSync(editorUiDir).isDirectory()) {
		console.log(`📁 Traitement de: ${editorUiDir}`);
		walkDirectory(editorUiDir, processFile);
	}
	
	// Traiter aussi les autres packages frontend si nécessaire
	const otherDirs = ['design-system', 'chat'];
	for (const dir of otherDirs) {
		const dirPath = join(frontendDir, `@n8n`, dir, 'src');
		if (statSync(dirPath).isDirectory()) {
			console.log(`📁 Traitement de: ${dirPath}`);
			walkDirectory(dirPath, processFile);
		}
	}

	const duration = ((Date.now() - startTime) / 1000).toFixed(2);

	console.log('\n✅ Correction terminée!');
	console.log(`   Fichiers traités: ${totalFiles}`);
	console.log(`   Fichiers modifiés: ${modifiedFiles}`);
	console.log(`   Total de remplacements: ${totalReplacements}`);
	console.log(`   Durée: ${duration}s\n`);

	if (modifiedFiles > 0) {
		console.log('⚠️  Des fichiers ont été modifiés.\n');
		process.exit(0);
	} else {
		console.log('✨ Tous les imports sont déjà corrects!\n');
		process.exit(0);
	}
}

main();

