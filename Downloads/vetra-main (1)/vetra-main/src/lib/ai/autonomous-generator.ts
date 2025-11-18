/**
 * Générateur IA Autonome
 * Génère un projet complet (front, backend, DB, workflow, assets) à partir d'une description
 */

import { aiOrchestrator } from './orchestrator';

export interface ProjectDescription {
  name: string;
  description: string;
  type: 'saas' | 'website' | 'app' | 'api';
  features: string[];
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
  };
}

export interface GeneratedProject {
  frontend: {
    structure: string[];
    code: Record<string, string>;
  };
  backend: {
    structure: string[];
    code: Record<string, string>;
    apiRoutes: string[];
  };
  database: {
    schema: string;
    migrations: string[];
  };
  workflow?: {
    nodes: any[];
    edges: any[];
  };
  assets?: {
    images: string[];
    videos: string[];
  };
  documentation: string;
}

export class AutonomousGenerator {
  /**
   * Génère un projet complet à partir d'une description
   */
  async generateProject(description: ProjectDescription): Promise<GeneratedProject> {
    const database = await this.generateDatabaseSchema(description);
    const backend = await this.generateBackend(description);
    const frontend = await this.generateFrontend(description);
    const workflow = await this.generateWorkflow(description);
    const assets = await this.generateAssets(description);
    const documentation = await this.generateDocumentation(description);

    return {
      frontend,
      backend,
      database,
      workflow,
      assets,
      documentation,
    };
  }

  /**
   * Génère le schéma de base de données
   */
  private async generateDatabaseSchema(description: ProjectDescription): Promise<{
    schema: string;
    migrations: string[];
  }> {
    const prompt = `Generate a PostgreSQL database schema for: ${description.description}

Features: ${description.features.join(', ')}

Return only the SQL CREATE TABLE statements, no explanations.`;

    const response = await aiOrchestrator.generateCode(prompt, 'sql', {
      temperature: 0.2,
    });

    return {
      schema: response.content,
      migrations: [response.content],
    };
  }

  /**
   * Génère le backend
   */
  private async generateBackend(description: ProjectDescription): Promise<{
    structure: string[];
    code: Record<string, string>;
    apiRoutes: string[];
  }> {
    const tech = description.techStack?.backend || 'Next.js API Routes';
    const prompt = `Generate a complete ${tech} backend for: ${description.description}

Features: ${description.features.join(', ')}

Include:
- API routes structure
- Authentication
- Database models
- Business logic

Return the code structure and implementation.`;

    const response = await aiOrchestrator.generateCode(prompt, 'typescript', {
      temperature: 0.3,
      maxTokens: 4000,
    });

    // Parser le code généré (simplifié)
    const code = this.parseCodeResponse(response.content);
    const apiRoutes = this.extractAPIRoutes(response.content);

    return {
      structure: Object.keys(code),
      code,
      apiRoutes,
    };
  }

  /**
   * Génère le frontend
   */
  private async generateFrontend(description: ProjectDescription): Promise<{
    structure: string[];
    code: Record<string, string>;
  }> {
    const tech = description.techStack?.frontend || 'Next.js + React + Tailwind';
    const prompt = `Generate a complete ${tech} frontend for: ${description.description}

Features: ${description.features.join(', ')}

Include:
- Page structure
- Components
- Styling with Tailwind
- State management
- Routing

Return the code structure and implementation.`;

    const response = await aiOrchestrator.generateCode(prompt, 'typescript', {
      temperature: 0.3,
      maxTokens: 4000,
    });

    const code = this.parseCodeResponse(response.content);

    return {
      structure: Object.keys(code),
      code,
    };
  }

  /**
   * Génère un workflow
   */
  private async generateWorkflow(description: ProjectDescription): Promise<{
    nodes: any[];
    edges: any[];
  } | undefined> {
    if (description.type === 'saas' || description.features.includes('automation')) {
      const prompt = `Generate a workflow for: ${description.description}

Features: ${description.features.join(', ')}

Return a JSON structure with nodes and edges for a workflow builder.`;

      const response = await aiOrchestrator.generateCode(prompt, 'json', {
        temperature: 0.2,
      });

      try {
        const workflow = JSON.parse(response.content);
        return {
          nodes: workflow.nodes || [],
          edges: workflow.edges || [],
        };
      } catch {
        return undefined;
      }
    }

    return undefined;
  }

  /**
   * Génère des assets (images, vidéos)
   */
  private async generateAssets(description: ProjectDescription): Promise<{
    images: string[];
    videos: string[];
  }> {
    const assets = {
      images: [] as string[],
      videos: [] as string[],
    };

    // Générer des images pour le projet
    try {
      const imagePrompts = [
        `Logo for ${description.name}: ${description.description}`,
        `Hero image for ${description.name}`,
      ];

      for (const prompt of imagePrompts) {
        const response = await aiOrchestrator.generateImage(prompt);
        if (response.content) {
          assets.images.push(response.content);
        }
      }
    } catch (error) {
      console.error('Asset generation error:', error);
    }

    return assets;
  }

  /**
   * Génère la documentation
   */
  private async generateDocumentation(description: ProjectDescription): Promise<string> {
    const prompt = `Generate comprehensive documentation for: ${description.name}

Description: ${description.description}
Features: ${description.features.join(', ')}

Include:
- Setup instructions
- Architecture overview
- API documentation
- Deployment guide
- Usage examples`;

    const response = await aiOrchestrator.generateText({
      task: 'text',
      prompt,
      options: {
        temperature: 0.5,
        maxTokens: 3000,
      },
    });

    return response.content;
  }

  /**
   * Parse le code généré en fichiers
   */
  private parseCodeResponse(content: string): Record<string, string> {
    const files: Record<string, string> = {};
    const lines = content.split('\n');
    let currentFile = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      // Détecter les noms de fichiers (simplifié)
      if (line.match(/^\/\/ File:|^\/\/ \/|^# File:/)) {
        if (currentFile) {
          files[currentFile] = currentContent.join('\n');
        }
        currentFile = line.replace(/^\/\/ File:|^\/\/ \/|^# File:/, '').trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentFile) {
      files[currentFile] = currentContent.join('\n');
    }

    // Si aucun fichier détecté, mettre tout dans un fichier par défaut
    if (Object.keys(files).length === 0) {
      files['generated.ts'] = content;
    }

    return files;
  }

  /**
   * Extrait les routes API du code
   */
  private extractAPIRoutes(content: string): string[] {
    const routes: string[] = [];
    const routePattern = /(?:route|api|endpoint)[\s:]*['"`]([^'"`]+)['"`]/gi;
    let match;

    while ((match = routePattern.exec(content)) !== null) {
      routes.push(match[1]);
    }

    return [...new Set(routes)]; // Dédupliquer
  }
}

export const autonomousGenerator = new AutonomousGenerator();

