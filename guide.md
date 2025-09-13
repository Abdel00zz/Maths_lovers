# Guide de Création de Contenu JSON pour Sigma

Ce guide explique comment structurer le fichier JSON pour importer des exercices dans la plateforme Sigma. Le respect de ce format est essentiel pour que l'importation fonctionne correctement.

## Structure Globale

Le fichier JSON doit contenir un unique **tableau (array)** d'objets, où chaque objet représente un exercice.

```json
[
  {
    "//": "Premier exercice",
    "...": "..."
  },
  {
    "//": "Deuxième exercice",
    "...": "..."
  }
]
```

## L'objet `Exercise`

Chaque objet du tableau doit contenir les clés suivantes :

| Clé              | Type                                 | Description                                                                                                                                                                                                                                        | Obligatoire |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `title`          | `string`                             | Le titre de l'exercice.                                                                                                                                                                                                                            | Oui         |
| `difficulty`     | `number`                             | Un entier de 1 (très facile) à 5 (très difficile) représentant la difficulté.                                                                                                                                                                      | Oui         |
| `statement`      | `string`                             | L'énoncé de l'exercice. Ce champ peut contenir du **HTML** pour la mise en forme et de la syntaxe **MathJax** pour les formules mathématiques (ex: `$\\Delta = b^2 - 4ac$`).                                                                        | Oui         |
| `video`          | `object`                             | Un objet contenant les informations de la vidéo de correction.                                                                                                                                                                                     | Oui         |
| `courseReminder` | `string`                             | Le contenu du rappel de cours. Ce champ supporte également le **HTML** et **MathJax**.                                                                                                                                                             | Oui         |
| `quiz`           | `object`                             | Un objet contenant les questions du quiz d'auto-évaluation.                                                                                                                                                                                        | Oui         |

### Détail de l'objet `video`

| Clé         | Type     | Description                                                          | Obligatoire |
| ----------- | -------- | -------------------------------------------------------------------- | ----------- |
| `youtubeId` | `string` | L'identifiant unique de la vidéo YouTube (ex: `zR-e_e-E-48`).        | Oui         |
| `timestamps`| `array`  | Un tableau d'objets `VideoTimestamp` (voir ci-dessous).              | Oui         |

### Détail de l'objet `VideoTimestamp`

| Clé         | Type     | Description                                                          | Obligatoire |
| ----------- | -------- | -------------------------------------------------------------------- | ----------- |
| `label`     | `string` | Le nom du marqueur (ex: "Introduction", "Question 1").               | Oui         |
| `time`      | `number` | Le temps en secondes où le segment commence.                         | Oui         |

---

### Rendre les questions interactives

Pour lier une partie de votre énoncé (comme une question dans une liste) à un moment précis de la vidéo, ajoutez l'attribut `data-timestamp-index` à votre élément HTML (par exemple, une balise `<li>`). La valeur de cet attribut doit correspondre à l'**index** (position, en commençant par 0) du marqueur temporel souhaité dans le tableau `timestamps`.

**Exemple :**
Supposons que votre objet `video` soit :
```json
"video": {
  "youtubeId": "XXXXXXXXX",
  "timestamps": [
    { "label": "Introduction", "time": 10 },
    { "label": "Explication Q1", "time": 65 },
    { "label": "Explication Q2", "time": 122 }
  ]
}
```

Votre `statement` HTML pourrait être :
```html
<p>Voici les questions :</p>
<ol>
  <li data-timestamp-index="1">Ceci est la première question. Cliquer ici démarrera la vidéo à 65 secondes.</li>
  <li data-timestamp-index="2">Ceci est la deuxième question. Cliquer ici démarrera la vidéo à 122 secondes.</li>
</ol>
```

**Note :** Le premier marqueur (`timestamps[0]`) est généralement utilisé pour l'introduction et est lu par défaut lorsque l'onglet vidéo est ouvert.

---

### Détail de l'objet `quiz`

| Clé         | Type      | Description                                | Obligatoire |
| ----------- | --------- | ------------------------------------------ | ----------- |
| `questions` | `array`   | Un tableau d'objets `QuizQuestion`.        | Oui         |

### Détail de l'objet `QuizQuestion`

| Clé           | Type                       | Description                                                                                                                                   | Obligatoire (selon `type`) |
| ------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `type`        | `'qcm'` ou `'vrai-faux'`   | Le type de la question.                                                                                                                       | Oui                        |
| `question`    | `string`                   | Le texte de la question. Supporte **HTML** et **MathJax**.                                                                                    | Oui                        |
| `options`     | `array` de `string`        | Pour le type `qcm`, un tableau de chaînes de caractères représentant les options de réponse. Supporte **HTML** et **MathJax**.                 | Pour `qcm`                 |
| `answerIndex` | `number`                   | Pour le type `qcm`, l'index (commençant à 0) de la réponse correcte dans le tableau `options`.                                                 | Pour `qcm`                 |
| `answer`      | `boolean`                  | Pour le type `vrai-faux`, la réponse correcte (`true` pour Vrai, `false` pour Faux).                                                          | Pour `vrai-faux`           |

---

## Exemple Complet

Voici un exemple complet d'un fichier JSON contenant un seul exercice avec la nouvelle structure de vidéo.

```json
[
  {
    "title": "Résolution par le discriminant",
    "difficulty": 2,
    "statement": "<p>Résoudre l'équation suivante dans $\\mathbb{R}$ : $x^2 - 5x + 6 = 0$.</p><p>Pour cela, vous devez répondre aux questions suivantes :</p><ol><li data-timestamp-index=\"1\">Calculer le discriminant $\\Delta$.</li><li data-timestamp-index=\"2\">En déduire les solutions de l'équation.</li></ol>",
    "video": {
      "youtubeId": "zR-e_e-E-48",
      "timestamps": [
        { "label": "Introduction", "time": 30 },
        { "label": "Calcul du discriminant", "time": 95 },
        { "label": "Recherche des solutions", "time": 152 }
      ]
    },
    "courseReminder": "<h4>Discriminant d'un polynôme du second degré</h4><p>Pour une équation de la forme $ax^2 + bx + c = 0$ avec $a \\neq 0$, le discriminant est noté $\\Delta$ et est égal à :</p><p>$\\Delta = b^2 - 4ac$</p><ul><li>Si $\\Delta > 0$, l'équation a deux solutions réelles distinctes : $x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a}$ et $x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}$.</li><li>Si $\\Delta = 0$, l'équation a une unique solution réelle (dite \"double\") : $x_0 = \\frac{-b}{2a}$.</li><li>Si $\\Delta < 0$, l'équation n'a pas de solution dans l'ensemble des nombres réels $\\mathbb{R}$.</li></ul>",
    "quiz": {
      "questions": [
        {
          "type": "qcm",
          "question": "Quel est le discriminant de l'équation $2x^2 - 3x - 2 = 0$ ?",
          "options": ["1", "17", "25", "-7"],
          "answerIndex": 2
        },
        {
          "type": "vrai-faux",
          "question": "L'équation $x^2 + x + 1 = 0$ a au moins une solution réelle.",
          "answer": false
        }
      ]
    }
  }
]
```