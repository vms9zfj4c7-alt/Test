# Plan d'Amélioration Visuelle et Navigation

## Objectifs

1. **Navigation Fluide (SPA)** : Faire en sorte que le contenu défile "au même endroit" (zone de contenu scrollable) sans recharger la page ni bouger la sidebar.
2. **Qualité Visuelle (Premium)** : Adopter un style "Glassmorphism" (transparence floutée), des polices modernes, et des effets néon/rock.
3. **Transitions** : Ajouter des animations d'entrée/sortie lors du changement d'onglet.
4. **Idées de Gameplay** : Fournir une liste de suggestions pour le futur.

## 1. Modifications Techniques

### A. Structure et Style (`index.html` & `style.css`)

* **Google Fonts** : Ajouter `Montserrat` (textes) et `Rye` ou `Metal Mania` (titres) pour l'ambiance Rock.
* **Layout Fixe** :
  * Le `body` prend 100vh et ne scrolle pas.
  * Le `.container` prend toute la hauteur.
  * La `.sidebar` est fixe à gauche.
  * Le `.content-area` prend le reste, avec `overflow-y: auto` (scroll interne) et un scrollbar stylisé.
* **Glassmorphism** :
  * Utiliser `backdrop-filter: blur(10px)` sur les panneaux.
  * Bordures fines semi-transparentes (`rgba(255, 255, 255, 0.1)`).
  * Ombres portées douces + lueurs néon (`box-shadow`).
* **Composants** :
  * Boutons avec états hover animés (glow).
  * Barres de progression (santé/compétences) plus stylisées (dégradés, reflets).

### B. Logique d'Affichage (`views.js`)

* Modifier `showView(view)` pour :
    1. Appliquer une classe de sortie (`fade-out`).
    2. Attendre la fin de l'anim (ex: 200ms).
    3. Changer le contenu.
    4. Appliquer une classe d'entrée (`fade-in`) et scroller en haut du `.content-area`.

## 2. Idées de Gameplay (à livrer en fin de tâche)

* **Recrutement de Musiciens** : Chaque musicien a ses stats et sa personnalité.
* **Production d'Album** : Mini-jeu de mixage ou choix de style (Ballade, Hard Rock, Punk).
* **Tournées Mondiales** : Carte interactive avec choix des villes et logistique.
* **Système de Scandales** : Gérer la presse people (drogue, bagarres).
* **Labels** : Signer des contrats avec des conditions (avances, % royalties).
* **Matériel Personnalisable** : Acheter des guitares spécifiques (Gibson, Fender) avec des bonus uniques.

## Fichiers Impactés

* `index.html` (imports fonts)
* `style.css` (refonte totale)
* `views.js` (transitions)
* `idees.md` (nouveau fichier)
