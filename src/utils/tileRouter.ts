import type {TileBase} from "./TileTypes";

export function getTileById(tiles: TileBase[], id: string): TileBase | undefined {
	return tiles.find(t => t.id === id);
}

export function router(
	tiles: TileBase[],
	onTileChange: (tile: TileBase) => void
) {
	const params = new URLSearchParams(window.location.search);
	const tileId = params.get("ou-je-me-trouve") || "root";
	const tile = getTileById(tiles, tileId);
	if (tile) onTileChange(tile);

	window.addEventListener("popstate", () => {
		const params = new URLSearchParams(window.location.search);
		const tileId = params.get("ou-je-me-trouve") || "root";
		const tile = getTileById(tiles, tileId);
		if (tile) onTileChange(tile);
	});
}

export function navigateToTile(tileId: string) {
	history.pushState({ tile: tileId }, "", `?ou-je-me-trouve=${tileId}`);
}