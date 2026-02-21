//V5
import React, { useState, useEffect, useRef } from "react";
import { Tile } from "./Tile";
import graphData from "../data/graph.json";
import type { TileBase } from "../interfaces/Tile.interface";
import { forceSimulation, forceManyBody, forceCenter, forceLink } from "d3-force";

type TileType = TileBase & { id: string; x?: number; y?: number; vx?: number; vy?: number };

const getTileById = (tiles: TileType[], id: string) => tiles.find(t => t.id === id);

interface GraphProps {
	mode: 'recenter' | 'navigate';
}

export const Graph: React.FC<GraphProps> = ({ mode }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [currentTile, setCurrentTile] = useState<TileType>(getTileById(graphData, "root")!);
	const [nodes, setNodes] = useState<TileType[]>([]);

	const navigateToTile = (tileId: string) => {
		history.pushState({ tile: tileId }, "", `?ou-je-me-trouve=${tileId}`);
		const tile = getTileById(graphData, tileId);
		if (tile) setCurrentTile(tile);
	};

	// Synchronisation avec l'URL
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

	// Simulation D3
	useEffect(() => {
		if (!currentTile || !containerRef.current) return;
		const container = containerRef.current;
		const centerX = container.clientWidth / 2;
		const centerY = container.clientHeight / 2;

		// Construction des nodes selon le mode
		const linkNodes: TileType[] = [];

		if (mode === 'recenter') {
			// toutes les tuiles
			graphData.forEach(tile => {
				linkNodes.push({
					...tile,
					id: tile.id || "root",
					x: Math.random() * container.clientWidth,
					y: Math.random() * container.clientHeight,
				});
			});
		} else {
			// mode navigate : currentTile + enfants seulement
			linkNodes.push({ ...currentTile, id: currentTile.id, x: centerX, y: centerY });
			currentTile.links?.forEach(linkId => {
				const tile = getTileById(graphData, linkId);
				if (tile) {
					linkNodes.push({
						...tile,
						id: linkId,
						x: Math.random() * container.clientWidth,
						y: Math.random() * container.clientHeight,
					});
				}
			});
		}

		setNodes(linkNodes);

		// Création des liens
		const links = linkNodes.flatMap(node =>
			node.links?.map(linkId => ({ source: node.id, target: linkId })) || []
		);

		const simulation = forceSimulation(linkNodes)
			.force("charge", forceManyBody().strength(-350))
			.force("link", forceLink(links).id(d => d.id).distance(250))
			.force("center", forceCenter(centerX, centerY))
			.alpha(1)
			.alphaDecay(0.05)
			.on("tick", () => setNodes([...linkNodes]));

		return () => simulation.stop();
	}, [currentTile, mode]);

	return (
		<div ref={containerRef} className="relative w-full h-full">
			{/* SVG des liens */}
			<svg className="absolute w-full h-full top-0 left-0 pointer-events-none">
				{nodes.map(node =>
						currentTile.id !== node.id && (
							<line
								key={`link-${node.id}`}
								x1={nodes.find(n => n.id === currentTile.id)?.x || 0}
								y1={nodes.find(n => n.id === currentTile.id)?.y || 0}
								x2={node.x || 0}
								y2={node.y || 0}
								stroke="rgba(0,0,0,0.3)"
								strokeWidth={2}
							/>
						)
				)}
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
					onClick={() => {
						if (mode === 'navigate' && node.links?.length === 1) {
							navigateToTile(node.links[0]); // navigue vers enfant unique
						} else {
							navigateToTile(node.id); // recentre la tuile
						}
					}}
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