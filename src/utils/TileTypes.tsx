export interface TileBase {
	id?: string;               // optionnel pour le composant React
	title: string;
	description: string;
	article?: string;
	links?: string[];
	onClick?: () => void;      // pour le composant React
}