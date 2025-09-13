import { Database } from './types';

export const MOTIVATIONAL_MESSAGES: string[] = [
    "Chaque expert a un jour été un débutant. Continuez d'apprendre.",
    "L'apprentissage est un trésor qui suivra son propriétaire partout.",
    "La seule chose qui se dresse entre vous et votre rêve, c'est la volonté d'essayer et la conviction qu'il est réellement possible.",
    "Croyez en vous, même si personne d'autre ne le fait.",
    "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
    "N'attendez pas l'opportunité. Créez-la.",
    "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute."
];

export const INITIAL_DATABASE: Database = {
    classes: [
        {
            id: 'cls-seconde',
            name: 'Seconde',
            chapters: [
                {
                    id: 'chap-seconde-1',
                    name: 'Équations du second degré',
                    exercises: [
                        {
                            id: 'ex-seconde-1-1',
                            title: 'Résolution par le discriminant',
                            difficulty: 2,
                            statement: `<p>Résoudre l'équation suivante dans $\\mathbb{R}$ : $x^2 - 5x + 6 = 0$.</p>
                                <p>Pour cela, vous devez répondre aux questions suivantes :</p>
                                <ol>
                                    <li data-timestamp-index="1">Calculer le discriminant $\\Delta$.</li>
                                    <li data-timestamp-index="2">En déduire les solutions de l'équation.</li>
                                </ol>`,
                            video: {
                                youtubeId: 'zR-e_e-E-48',
                                timestamps: [
                                    { label: 'Introduction', time: 30 },
                                    { label: 'Calcul du discriminant', time: 95 },
                                    { label: 'Recherche des solutions', time: 152 }
                                ]
                            },
                            courseReminder: `
                                <h4>Discriminant d'un polynôme du second degré</h4>
                                <p>Pour une équation de la forme $ax^2 + bx + c = 0$ avec $a \\neq 0$, le discriminant est noté $\\Delta$ et est égal à :</p>
                                <p>$\\Delta = b^2 - 4ac$</p>
                                <ul>
                                    <li>Si $\\Delta > 0$, l'équation a deux solutions réelles distinctes : $x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a}$ et $x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}$.</li>
                                    <li>Si $\\Delta = 0$, l'équation a une unique solution réelle (dite "double") : $x_0 = \\frac{-b}{2a}$.</li>
                                    <li>Si $\\Delta < 0$, l'équation n'a pas de solution dans l'ensemble des nombres réels $\\mathbb{R}$.</li>
                                </ul>
                            `,
                            quiz: {
                                questions: [
                                    {
                                        type: 'qcm',
                                        question: 'Quel est le discriminant de l\'équation $2x^2 - 3x - 2 = 0$ ?',
                                        options: ['1', '17', '25', '-7'],
                                        answerIndex: 2,
                                    },
                                    {
                                        type: 'vrai-faux',
                                        question: 'L\'équation $x^2 + x + 1 = 0$ a au moins une solution réelle.',
                                        answer: false,
                                    },
                                     {
                                        type: 'qcm',
                                        question: 'Les solutions de $x^2 - 5x + 6 = 0$ sont :',
                                        options: ['-2 et -3', '2 et 3', '1 et 6', 'Aucune de ces réponses'],
                                        answerIndex: 1,
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: 'cls-premiere',
            name: 'Première',
            chapters: [
                {
                    id: 'chap-premiere-1',
                    name: 'Dérivation',
                    exercises: []
                },
                {
                    id: 'chap-premiere-2',
                    name: 'Suites numériques',
                    exercises: []
                }
            ]
        }
    ]
};