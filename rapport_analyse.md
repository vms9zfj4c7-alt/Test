# Rapport d'Analyse : Rock Star Career

Ce rapport détaille les erreurs trouvées et propose des améliorations pour le jeu "Rock Star Career".

## 1. Erreurs et Bugs Potentiels

### A. Duplication de la Boucle de Jeu (Game Loop)

**Fichiers :** `player.js` (lignes 145-150) et `game.js` (lignes 22-27)
**Problème :** La logique `setInterval` est dupliquée à l'identique dans `loadGame()` et `startGame()`. Si les règles de temps (ex: vitesse du jeu) changent, il faut modifier deux endroits.
**Correction :** Créer une fonction unique `startGameLoop()` dans `game.js` et l'appeler depuis les deux endroits.

### B. Gestion des Flottants pour l'Âge

**Fichier :** `game.js`
**Problème :** `player.age` est incrémenté de `0.15` à chaque cycle `passTime`. L'addition répétée de nombres flottants peut causer des erreurs de précision (ex: `18.15000000002`).
**Correction :** Utiliser `toFixed(1)` ou travailler avec des entiers (jours) et convertir en années pour l'affichage.

### C. Bloquage de l'UI

**Fichiers :** `game.js`, `player.js`, `concerts.js`, `training.js`
**Problème :** Utilisation de `alert()` (ex: `alert('Entre un nom de scène !')`) et `confirm()` (sauvegarde). Cela stoppe l'exécution du script et casse l'immersion "Rock Star" et le design soigné.
**Correction :** Remplacer par des modales HTML/CSS personnalisées (`<dialog>` ou `div` overlay).

### D. Chargement des Scripts et Portée Globale

**Fichiers :** Tous
**Observation :** Le jeu repose massivement sur des variables globales (`player`, `gameTime`, `skills`, `shopItems`) définies dans différents fichiers. Bien que fonctionnel car chargé séquentiellement dans `index.html`, cela rend le code fragile et difficile à maintenir.

## 2. Idées d'Amélioration

### A. Refonte de l'Interface (UI/UX)

* **Feedback Visuel :** Ajouter des animations lors des gains d'argent ou de fans (ex: "+50€" flottant vers le haut).
* **Notifications :** Remplacer les messages "Activité en cours..." par un système de notification toast (petite bulle non intrusive).
* **Thème Dynamique :** Changer légèrement le fond ou la musique selon le niveau de *popularité* ou de *santé* (plus sombre si santé basse).

### B. Fonctionnalités de Gameplay

* **Événements Aléatoires :** Ajouter un système d'événements aléatoires dans `passTime` (ex: "Scandale dans la presse", "Panne de bus", "Rencontre avec un producteur") pour briser la monotonie.
* **Mini-jeux :** Rendre les concerts interactifs (ex: cliquer en rythme) au lieu d'un simple clic avec résultat probabiliste.
* **Système de Rivals :** Ajouter d'autres groupes concurrents qui montent dans les charts.

### C. Architecture du Code

* **Modularité :** Regrouper la logique du joueur dans une classe `Player` avec des méthodes propres (`player.train()`, `player.performConcert()`).
* **Configuration :** S'assurer que toutes les constantes de jeu (coûts, gains, temps) sont dans `config.js` pour un équilibrage facile.

### D. Optimisation CSS

* **Background Animé :** Le dégradé actuel est statique. Ajouter une animation CSS lente sur le `body` pour donner vie au fond.

## 3. Actions Recommandées (Prioritaires)

1. **Refactoriser la Game Loop** : Supprimer la duplication dans `player.js` et `game.js`.
2. **Supprimer `alert`/`confirm`** : Créer une fonction `showNotification(message)` et une modale de confirmation simple.
3. **Corriger l'affichage de l'âge** : S'assurer que le calcul de l'âge reste propre visuellement.
