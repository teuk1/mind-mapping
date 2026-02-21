export interface TileBase {
	id?: string;          // optionnel car automatiquement initialisé si jamais
	title: string;
	description: string;
	article?: string;
	links?: string[];
	x: number;
	y: number;
	onClick?: () => void;
}