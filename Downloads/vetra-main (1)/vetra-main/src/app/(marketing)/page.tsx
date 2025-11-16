"use client";

export const dynamic = 'force-dynamic';

import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { AnomalousMatterHero } from "@/components/anomalous-matter-hero";
import { AIChatInput } from "@/components/ui/ai-chat-input";
import { Globe } from "@/components/ui/globe";
import { Pricing } from "@/components/pricing";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { BentoGridShowcase } from "@/components/bento-product-features";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesCore } from "@/components/ui/sparkles";
import { Features } from "@/components/features-8";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import IntegrationsSection from "@/components/integrations-section";
import PinkyNewsletter from "@/components/pinky-newsletter";
import { useEffect } from "react";
import { renderCanvas } from "@/components/canvas-effect";

const HomePage = () => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const timer = setTimeout(() => {
            renderCanvas();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-black min-h-screen relative overflow-x-hidden">
            <canvas id="canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
            
            {/* ========== HERO SECTION ========== */}
            <section className="relative w-full h-screen z-[1] flex items-center justify-center">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                    <GooeyText 
                        texts={["PROMPTING", "IS ALL", "YOU NEED"]}
                        morphTime={1}
                        cooldownTime={0.25}
                        className="w-full"
                        textClassName="text-white"
                    />
                </div>
            </section>

            {/* ========== TRANSITION VISUAL ========== */}
            <AnomalousMatterHero 
                title="La Plateforme IA Tout-en-Un Qui Change Tout"
                subtitle="Créez Sites Web, Applications, Agents IA, Images & Vidéos en Quelques Minutes"
                description="AURION est la seule plateforme qui combine création de sites web, développement d'applications, agents IA intelligents, éditeurs de texte par IA, chat IA avancé, génération d'images et vidéos, éditeur de code comme Cursor AI, et bibliothèques UI/UX complètes. Tout ce dont vous avez besoin pour construire, personnaliser et déployer vos projets digitaux avec les meilleures IA du marché. Plus de 50,000+ créateurs nous font déjà confiance."
            />

            {/* ========== FEATURES - BENTO GRID ========== */}
            <section id="features" className="relative w-full min-h-screen z-[2] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                            Tout Ce Dont Vous Avez Besoin Pour Créer Sans Limites
                        </h2>
                        <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto">
                            <strong className="text-white">Arrêtez de jongler entre 10 outils différents.</strong> AURION centralise tout : création de sites web professionnels, développement d'applications complètes, agents IA sur-mesure, génération de contenu texte/image/vidéo, et édition de code avancée. <span className="text-white font-semibold">Gagnez 20+ heures par semaine</span> en utilisant une seule plateforme alimentée par les meilleures IA du marché (GPT-4, Claude, Midjourney, Stable Diffusion, et plus).
                        </p>
                        <p className="text-base text-white/60 max-w-3xl mx-auto mt-4">
                            ⚡ <strong className="text-white">Résultat garanti</strong> : Créez votre premier site web ou application en moins de 5 minutes, même sans expérience technique.
                        </p>
                    </div>
                    <BentoGridShowcase
                        integration={
                            <Card className="h-full bg-black/50 border-white/10 text-white relative">
                                <GlowingEffect disabled={false} variant="default" proximity={50} spread={30} />
                                <CardHeader>
                                    <CardTitle>Création de Sites Web & Apps</CardTitle>
                                    <CardDescription className="text-white/70">
                                        Sites web & applications en minutes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/80">
                                        Créez des sites web professionnels et des applications complètes avec notre IA. Plus besoin de code, de design, ou de développement complexe. <strong className="text-white">De l'idée au déploiement en 5 minutes.</strong>
                                    </p>
                                </CardContent>
                            </Card>
                        }
                        trackers={
                            <Card className="h-full bg-black/50 border-white/10 text-white relative">
                                <GlowingEffect disabled={false} variant="default" proximity={50} spread={30} />
                                <CardHeader>
                                    <CardTitle>Agents IA Personnalisés</CardTitle>
                                    <CardDescription className="text-white/70">
                                        Automatisez vos tâches
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/80">
                                        Créez des agents IA sur-mesure qui travaillent 24/7 pour vous. Automatisation complète de vos processus métier avec les meilleures IA du marché.
                                    </p>
                                </CardContent>
                            </Card>
                        }
                        statistic={
                            <Card className="h-full bg-black/50 border-white/10 text-white relative">
                                <GlowingEffect disabled={false} variant="default" proximity={50} spread={30} />
                                <CardHeader>
                                    <CardTitle>Génération Images & Vidéos</CardTitle>
                                    <CardDescription className="text-white/70">
                                        Créez du contenu visuel instantanément
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/80">
                                        Générez des images professionnelles et des vidéos époustouflantes avec l'IA. <strong className="text-white">Économisez des milliers d'euros</strong> en design et production vidéo.
                                    </p>
                                </CardContent>
                            </Card>
                        }
                        focus={
                            <Card className="h-full bg-black/50 border-white/10 text-white relative">
                                <GlowingEffect disabled={false} variant="default" proximity={50} spread={30} />
                                <CardHeader>
                                    <CardTitle>Éditeur de Code IA (Style Cursor)</CardTitle>
                                    <CardDescription className="text-white/70">
                                        Codez 10x plus vite
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/80">
                                        Éditeur de code intelligent comme Cursor AI intégré. Modifiez et améliorez manuellement vos sites/apps avec une assistance IA qui comprend votre contexte.
                                    </p>
                                </CardContent>
                            </Card>
                        }
                        productivity={
                            <Card className="h-full bg-black/50 border-white/10 text-white relative">
                                <GlowingEffect disabled={false} variant="default" proximity={50} spread={30} />
                                <CardHeader>
                                    <CardTitle>Chat IA & Éditeur Texte</CardTitle>
                                    <CardDescription className="text-white/70">
                                        Rédaction assistée par IA
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/80">
                                        Chat IA avancé et éditeur de texte intelligent. Créez du contenu optimisé SEO, articles, scripts, et plus encore avec les meilleurs modèles de langage.
                                    </p>
                                </CardContent>
                            </Card>
                        }
                        shortcuts={
                            <Card className="h-full bg-black/50 border-white/10 text-white relative">
                                <GlowingEffect disabled={false} variant="default" proximity={50} spread={30} />
                                <CardHeader>
                                    <CardTitle>Bibliothèques UI/UX Complètes</CardTitle>
                                    <CardDescription className="text-white/70">
                                        Personnalisez sans limites
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/80">
                                        Accédez à des milliers de composants UI/UX professionnels. Personnalisez chaque détail de vos créations avec des designs modernes et responsive.
                                    </p>
                                </CardContent>
                            </Card>
                        }
                    />
                </div>
            </section>

            {/* ========== FEATURES DETAILS ========== */}
            <section className="relative w-full min-h-screen z-[3] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                            Pourquoi 50,000+ Créateurs Choisissent AURION
                        </h2>
                        <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto">
                            <strong className="text-white">La seule plateforme qui remplace 10+ outils coûteux</strong> : WordPress, Figma, Canva, ChatGPT, Midjourney, Cursor AI, et plus encore. <span className="text-white font-semibold">Économisez jusqu'à 500€/mois</span> en abonnements multiples tout en gagnant en productivité. 
                        </p>
                        <p className="text-base text-white/60 max-w-3xl mx-auto mt-4">
                            🚀 <strong className="text-white">Résultat mesurable</strong> : Nos utilisateurs créent en moyenne 3x plus de projets qu'avant, avec une qualité professionnelle garantie.
                        </p>
                    </div>
            <Features />
                </div>
            </section>

            {/* ========== ARCHITECTURE & TECHNOLOGY ========== */}
            <section id="technology" className="relative w-full min-h-screen z-[4] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                            Alimenté Par Les Meilleures IA Du Marché
                        </h2>
                        <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto mb-4">
                            <strong className="text-white">AURION utilise les modèles IA les plus puissants</strong> : GPT-4, Claude 3.5, Midjourney, Stable Diffusion, DALL-E, et bien plus. <span className="text-white font-semibold">Pas besoin de choisir</span> - nous optimisons automatiquement le meilleur modèle pour chaque tâche. Architecture distribuée garantissant 99.9% de disponibilité et des performances instantanées.
                        </p>
                        <p className="text-base text-white/60 max-w-3xl mx-auto">
                            ⚡ <strong className="text-white">Avantage concurrentiel</strong> : Accédez aux dernières innovations IA avant qu'elles ne deviennent mainstream. Mises à jour automatiques incluses.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <CpuArchitecture 
                            width="100%"
                            height="500"
                            text="AURION"
                            showCpuConnections={true}
                            animateText={true}
                            animateLines={true}
                            animateMarkers={true}
                            className="text-white"
                        />
                    </div>
                </div>
            </section>

            {/* ========== GLOBAL REACH ========== */}
            <section className="relative w-full min-h-screen z-[5] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                            Déployez Partout Dans Le Monde En Un Clic
                        </h2>
                        <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto mb-4">
                            <strong className="text-white">Infrastructure mondiale optimisée</strong> : Déployez vos sites web et applications sur 200+ serveurs répartis sur tous les continents. <span className="text-white font-semibold">Latence ultra-faible</span> garantie partout dans le monde. Que vous soyez à Paris, New York, Tokyo ou Dubaï, vos utilisateurs bénéficient de la même vitesse fulgurante.
                        </p>
                        <p className="text-base text-white/60 max-w-3xl mx-auto">
                            🌍 <strong className="text-white">Preuve sociale</strong> : Rejoignez 50,000+ créateurs, startups et entreprises Fortune 500 qui font confiance à AURION pour leurs projets critiques. <span className="text-white">99.9% d'uptime garanti</span> avec support 24/7.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Globe />
                    </div>
                </div>
            </section>

            {/* ========== BRAND MOMENT - AURION ========== */}
            <section className="relative w-full min-h-screen z-[6] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 space-y-4">
                        <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
                            <strong className="text-white text-2xl">La Plateforme IA La Plus Complète Du Marché</strong>
                        </p>
                        <p className="text-base text-white/70 max-w-2xl mx-auto">
                            Pour ceux qui refusent de se contenter de solutions partielles. Pour ceux qui veulent tout créer, tout personnaliser, tout déployer - en un seul endroit.
                        </p>
                    </div>
                    <div className="relative w-full h-[600px] flex items-center justify-center">
                        <SparklesCore
                            background="transparent"
                            minSize={0.6}
                            maxSize={1.4}
                            particleDensity={120}
                            className="w-full h-full"
                            particleColor="#FFFFFF"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white z-10">
                                AURION
                            </h1>
                        </div>
                    </div>
                    <div className="text-center mt-12 space-y-2">
                        <p className="text-base text-white/60 max-w-xl mx-auto">
                            Where intelligence meets innovation. Where possibilities become reality.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== INTEGRATIONS ========== */}
            <section id="integrations" className="relative w-full min-h-screen z-[7] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                            Intégrations Parfaites Avec Votre Stack Actuel
                        </h2>
                        <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto">
                            <strong className="text-white">Connectez AURION à tous vos outils existants</strong> : GitHub, Slack, Notion, Zapier, Webhooks, API REST, et 100+ autres intégrations. <span className="text-white font-semibold">Aucune disruption</span> de votre workflow actuel - AURION s'intègre parfaitement et améliore votre productivité instantanément.
                        </p>
                        <p className="text-base text-white/60 max-w-3xl mx-auto">
                            🔌 <strong className="text-white">Approche API-first</strong> : Intégration en moins de 5 minutes. Compatible avec tous les écosystèmes tech modernes.
                        </p>
                    </div>
                    <IntegrationsSection />
                </div>
            </section>

            {/* ========== FAQ / SUPPORT ========== */}
            <section id="faq" className="relative w-full min-h-screen z-[8] flex flex-col items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white">
                            Des Questions ? Notre IA Répond Instantanément
                        </h2>
                        <p className="text-lg sm:text-xl text-white/80 max-w-3xl">
                            <strong className="text-white">Assistant IA disponible 24/7</strong> : Posez n'importe quelle question sur AURION - fonctionnalités, tarifs, intégrations, création de sites web, agents IA, génération d'images/vidéos, édition de code, ou comment démarrer. <span className="text-white font-semibold">Réponses instantanées et précises</span> alimentées par nos meilleurs modèles IA.
                        </p>
                        <p className="text-base text-white/60 max-w-2xl">
                            💡 <strong className="text-white">Conseils personnalisés</strong> : Obtenez des recommandations adaptées à votre projet spécifique. Architecture, déploiement, meilleures pratiques - tout est couvert.
                        </p>
                    </div>
                    <AIChatInput />
                </div>
            </section>

            {/* ========== PRICING ========== */}
            <section id="pricing" className="relative w-full min-h-screen z-[9] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 space-y-4">
                        <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto">
                            <strong className="text-white">Choisissez le plan qui correspond à vos ambitions</strong> : Tous les plans incluent l'accès complet à AURION - création de sites web, apps, agents IA, génération images/vidéos, éditeur de code, et bibliothèques UI/UX. <span className="text-white font-semibold">Commencez avec Starter</span> et évoluez sans limite, ou optez directement pour Professional pour des fonctionnalités avancées et un volume illimité.
                        </p>
                        <p className="text-base text-white/60 max-w-3xl mx-auto">
                            🎯 <strong className="text-white">ROI garanti</strong> : Économisez des milliers d'euros en outils multiples. <span className="text-white">Support prioritaire 24/7</span> et mises à jour automatiques incluses. Clients Enterprise : solutions sur-mesure avec gestionnaire de compte dédié et SLA garantis.
                        </p>
                    </div>
                    <Pricing
                        title="Tarification Simple et Transparente"
                        description="Choisissez le plan adapté à vos besoins\nTous les plans incluent l'accès complet à AURION : création de sites web, applications, agents IA, génération d'images/vidéos, éditeur de code IA, bibliothèques UI/UX, et support dédié."
                        plans={[
                            {
                                name: "Starter",
                                price: "29",
                                yearlyPrice: "24",
                                period: "month",
                                features: [
                                    "Création de sites web illimités",
                                    "Création d'applications (jusqu'à 3)",
                                    "Agents IA (jusqu'à 5)",
                                    "Génération images/vidéos (100/mois)",
                                    "Éditeur de code IA inclus",
                                    "Bibliothèques UI/UX complètes",
                                    "Chat IA & éditeur texte",
                                    "Support email",
                                ],
                                description: "Parfait pour démarrer vos projets",
                                buttonText: "Commencer Maintenant",
                                href: "#",
                                isPopular: false,
                            },
                            {
                                name: "Professional",
                                price: "99",
                                yearlyPrice: "79",
                                period: "month",
                                features: [
                                    "Tout dans Starter",
                                    "Applications illimitées",
                                    "Agents IA illimités",
                                    "Génération images/vidéos (1000/mois)",
                                    "Éditeur de code IA avancé",
                                    "Accès prioritaire aux nouvelles IA",
                                    "Support prioritaire 24/7",
                                    "Déploiement automatique",
                                    "Analytics avancés",
                                ],
                                description: "Idéal pour les créateurs professionnels",
                                buttonText: "Commencer Maintenant",
                                href: "#",
                                isPopular: true,
                            },
                            {
                                name: "Enterprise",
                                price: "299",
                                yearlyPrice: "239",
                                period: "month",
                                features: [
                                    "Tout dans Professional",
                                    "Génération images/vidéos illimitée",
                                    "Gestionnaire de compte dédié",
                                    "Intégrations personnalisées",
                                    "SLA garantis (99.9% uptime)",
                                    "Formation équipe incluse",
                                    "Support téléphonique prioritaire",
                                    "API personnalisée",
                                    "White-label disponible",
                                ],
                                description: "Pour les grandes organisations",
                                buttonText: "Contacter les Ventes",
                                href: "#",
                                isPopular: false,
                            },
                        ]}
                    />
                </div>
            </section>

            {/* ========== BRAND REINFORCEMENT ========== */}
            <section className="relative w-full min-h-[500px] z-[10] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 space-y-4">
                        <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
                            <strong className="text-white text-2xl">Expérimentez La Puissance De La Création IA Complète</strong>
                        </p>
                        <p className="text-base text-white/70 max-w-2xl mx-auto">
                            Transformez votre façon de créer. Sites web, apps, agents IA, contenu visuel, code - tout en un seul endroit.
                        </p>
                    </div>
                    <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center">
                        <TextHoverEffect text="AURION" duration={0.3} />
                    </div>
                    <div className="text-center mt-12 space-y-2">
                        <p className="text-base text-white/60 max-w-2xl mx-auto">
                            <strong className="text-white">L'avenir de la création digitale est là.</strong> Rejoignez 50,000+ créateurs, entrepreneurs et entreprises qui ont déjà fait le switch vers AURION. <span className="text-white font-semibold">Ne manquez pas cette révolution.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ========== NEWSLETTER CTA ========== */}
            <section className="relative w-full min-h-[500px] z-[11] flex items-center justify-center py-20 sm:py-32 bg-transparent">
                <GlowingEffect disabled={false} variant="white" proximity={100} spread={30} />
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                            Restez En Avance Sur Vos Concurrents
                        </h2>
                        <p className="text-lg sm:text-xl text-white/70 max-w-4xl mx-auto">
                            <strong className="text-white">Rejoignez notre communauté exclusive</strong> : Accès prioritaire aux nouvelles fonctionnalités IA, insights sur les dernières tendances, astuces productivité, et <span className="text-white font-semibold">early access aux innovations</span> avant qu'elles ne soient publiques. Soyez le premier informé des lancements majeurs.
                        </p>
                        <p className="text-base text-white/60 max-w-3xl mx-auto">
                            ✉️ <strong className="text-white">Contenu premium uniquement</strong> : Pas de spam, juste de la valeur. Conseils SEO, stratégies marketing, cas d'usage réels, et plus. Désabonnement en un clic.
                        </p>
                    </div>
                    <PinkyNewsletter />
                </div>
            </section>
        </div>
    )
};

export default HomePage
