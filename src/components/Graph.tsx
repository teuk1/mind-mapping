//V5
import React, { useState, useEffect, useRef } from "react";
import { Tile } from "./Tile";
import graphData from "../data/graph.json";
import type { TileBase } from "../utils/TileTypes";
import { forceSimulation, forceManyBody, forceCenter, forceLink } from "d3-force";

type TileType = TileBase & { id: string; vx?: number; vy?: number };

const getTileById = (tiles: TileType[], id: string) => tiles.find(t => t.id === id);

export const Graph: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentTile, setCurrentTile] = useState<TileType>(getTileById(graphData, "root")!);
	const [nodes, setNodes] = useState<TileType[]>([]);

	useEffect(() => {
		const router = () => {
			const params = new URLSearchParams(window.location.search);
			const tileId = params.get("ou-je-me-trouve") || "root";
			const tile = getTileById(graphData, tileId);
			if (tile) setCurrentTile(tile);
		};

		// Initialisation au chargement
		router();

		// Écoute popstate pour boutons navigateur
		window.addEventListener("popstate", router);
		return () => window.removeEventListener("popstate", router);
	}, []);

	const navigateToTile = (tileId: string) => {
		history.pushState({ tile: tileId }, "", `?ou-je-me-trouve=${tileId}`);
		const tile = getTileById(graphData, tileId);
		if (tile) setCurrentTile(tile);
	};

	useEffect(() => {
		if (!currentTile || !containerRef.current) return;

		const container = containerRef.current;
		const centerX = container.clientWidth / 2;
		const centerY = container.clientHeight / 2;

		// nodes pour la simulation
		const linkNodes: TileType[] = [
			{ ...currentTile, id: currentTile.id || "root", x: centerX, y: centerY },
			...currentTile.links
				.map(linkId => {
					const tile = getTileById(graphData, linkId);
					return tile ? { ...tile, id: linkId, x: Math.random() * container.clientWidth, y: Math.random() * container.clientHeight } : null;
				})
				.filter(Boolean) as TileType[],
		];

		setNodes(linkNodes);

		const links = currentTile.links.map(linkId => ({ source: currentTile.id, target: linkId }));

		const simulation = forceSimulation(linkNodes)
			.force("charge", forceManyBody().strength(-350)) // plus fort pour plus de distance
			.force("link", forceLink(links).id(d => d.id).distance(250)) // lien plus long
			.force("center", forceCenter(centerX, centerY))
			//.alphaTarget(0.3) // permet mouvement continu (pas ouf pour les perf)
			.alpha(1)      // départ avec mouvement
			.alphaDecay(0.05) // vitesse de convergence (réduire pour plus de flottement)
			.on("tick", () => setNodes([...linkNodes]));

		return () => simulation.stop();
	}, [currentTile]);

	return (
		<div ref={containerRef} className="relative w-full h-full">
			{/* SVG des liens */}
			<svg className="absolute w-full h-full top-0 left-0 pointer-events-none">
				{nodes.map(node => (
					currentTile.id !== node.id &&
					<line
						key={`link-${node.id}`}
						x1={nodes.find(n => n.id === currentTile.id)?.x || 0}
						y1={nodes.find(n => n.id === currentTile.id)?.y || 0}
						x2={node.x || 0}
						y2={node.y || 0}
						stroke="rgba(0,0,0,0.3)"
						strokeWidth={2}
					/>
				))}
			</svg>

			{/* Tiles */}
			{nodes.map(node => (
				<Tile
					key={node.id}
					id={node.id}
					title={node.title}
					links={node.links}
					description={node.description}
					x={node.x || 0}
					y={node.y || 0}
					onClick={node.id !== currentTile.id ? () => navigateToTile(node.id) : undefined}
				/>
			))}

			{/* Article */}
			{currentTile.article && (
				<article className="absolute bottom-4 left-4 max-w-md bg-white p-4 rounded shadow">
					{currentTile.article}
				</article>
			)}
		</div>
	);
};