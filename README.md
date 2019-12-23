Mon projet est découpé en deux parties:
* La scène d'introduction (/introScene/index.html), un cube blanc qui saute sur des plateformes dans l'espace (contrôle : ZQSD pour le direction et Space pour sauter), au moment d'arriver à la dernière plateforme, un bouton permet d'accéder à la seconde scène, un bouton en haut de l'écran est également disponible.
* La seconde scène (/trophiesScene/index.html) représente le travail réalisé en classe avec quelques ajouts, notamment un bouton avec une animation rebondie faisant tomber des balles à l'activation, il est aussi possible de changer le texte affiché sur les trophés en ajoutant #[texte] à la fin de l'URL.

L'instalation:

Un simple serveur local (php -S localhost:8000) suffit dans le dossier principal.
A la connexion à localhost:8000 une redirection automatique à la scène d'introduction est faite.

Mode debug:

Un mode debug est disponible qui supprime les contraintes de caméra, affiche des helpers et propose de modifier certaines variables globales avec un datGUI.
Pour activer le mode debug il suffit d'ajouter #debug à la fin de l'URL.

 
