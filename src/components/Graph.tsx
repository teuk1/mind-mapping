/*V1
import React, { useState } from "react";
import { Tile } from "./Tile";
import graphData from "../data/graph.json";

interface Node {
	id: string;
	title: string;
	description: string;
	links: string[];
	article?: string;
}
export const Graph: React.FC = () => {
	const [currentId, setCurrentId] = useState("root");
	const nodes: Node[] = graphData;

	const currentNode = nodes.find((n) => n.id === currentId)!;

	return (
		<div>
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				{/!* Tuile actuelle *!/}
				<Tile
					title={currentNode.title}
					description={currentNode.description}
				/>

				{/!* Tuiles suivantes *!/}
				{currentNode.links.map((linkId) => {
					const node = nodes.find((n) => n.id === linkId)!;
					return (
						<Tile
							key={node.id}
							title={node.title}
							description={node.description}
							onClick={() => setCurrentId(node.id)}
						/>
					);
				})}
			</div>

			{/!* Article *!/}
			{currentNode.article && (
				<div style={{ marginTop: "20px", padding: "10px", border: "1px solid #aaa" }}>
					{currentNode.article}
				</div>
			)}
		</div>
	);
};*/

/*
V2 params mais crash l'ui

import React, { useState, useEffect } from "react";
//import { Tile } from "./Tile";
import {type Tile, router, navigateToTile, getTileById } from "../utils/tileRouter";
import graphData from "../data/graph.json";

export const Graph: React.FC = () => {
	const [currentTile, setCurrentTile] = useState<Tile>(
		getTileById(graphData, "root")!
	);

	useEffect(() => {
		router(graphData, setCurrentTile);
	}, []);

	return (
		<div>
			<h2>{currentTile.title}</h2>
			<p>{currentTile.description}</p>
			{currentTile.article && <article>{currentTile.article}</article>}
			<div>
				{currentTile.links.map((linkId) => {
					const tile = getTileById(graphData, linkId);
					return tile ? (
						<button key={linkId} onClick={() => navigateToTile(linkId)}>
							{tile.title}
						</button>
					) : null;
				})}
			</div>
		</div>
	);
};*/

/*
//V3
import React, { useState, useEffect } from "react";
import { Tile } from "./Tile";
import graphData from "../data/graph.json";

interface TileType {
	id: string;
	title: string;
	description: string;
	article?: string;
	links: string[];
}

const getTileById = (tiles: TileType[], id: string) => tiles.find(t => t.id === id);

export const Graph: React.FC = () => {
	const [currentTile, setCurrentTile] = useState<TileType>(
		getTileById(graphData, "root")!
	);

	// Router basé sur le paramètre URL
	useEffect(() => {
		const router = () => {
			const params = new URLSearchParams(window.location.search);
			const tileId = params.get("ou-je-me-trouve") || "root";
			const tile = getTileById(graphData, tileId);
			if (tile) setCurrentTile(tile);
		};

		router(); // initial
		window.addEventListener("popstate", router);
		return () => window.removeEventListener("popstate", router);
	}, []);

	const navigateToTile = (tileId: string) => {
		history.pushState({ tile: tileId }, "", `?ou-je-me-trouve=${tileId}`);
		const tile = getTileById(graphData, tileId);
		if (tile) setCurrentTile(tile);
	};

	return (
		<div style={{ display: "flex", flexWrap: "wrap" }}>
			{/!* Tuile courante *!/}
			<Tile
				title={currentTile.title}
				description={currentTile.description}
			/>
			{/!* Tuiles des liens *!/}
			{currentTile.links.map(linkId => {
				const tile = getTileById(graphData, linkId);
				return tile ? (
					<Tile
						key={linkId}
						title={tile.title}
						description={tile.description}
						onClick={() => navigateToTile(linkId)}
					/>
				) : null;
			})}
			{/!* Article si présent *!/}
			{currentTile.article && <article>{currentTile.article}</article>}
		</div>
	);
};*/
/*

//V4
import React, { useState, useEffect } from "react";
import { Tile } from "./Tile";
import graphData from "../data/graph.json";
import type { TileBase } from "../utils/TileTypes";

import { forceSimulation, forceManyBody, forceCenter, forceLink } from "d3-force";

type TileType = TileBase & { id: string; vx?: number; vy?: number };

const getTileById = (tiles: TileType[], id: string) => tiles.find(t => t.id === id);

export const Graph: React.FC = () => {
	const [currentTile, setCurrentTile] = useState<TileType>(
		getTileById(graphData, "root")!
	);
	const [nodes, setNodes] = useState<TileType[]>([]);

	// Router basé sur le paramètre URL
	useEffect(() => {
		const router = () => {
			const params = new URLSearchParams(window.location.search);
			const tileId = params.get("ou-je-me-trouve") || "root";
			const tile = getTileById(graphData, tileId);
			if (tile) setCurrentTile(tile);
		};

		router(); // initial
		window.addEventListener("popstate", router);
		return () => window.removeEventListener("popstate", router);
	}, []);

	// Navigation
	const navigateToTile = (tileId: string) => {
		history.pushState({ tile: tileId }, "", `?ou-je-me-trouve=${tileId}`);
		const tile = getTileById(graphData, tileId);
		if (tile) setCurrentTile(tile);
	};

	// Mettre à jour les nodes pour la simulation
	useEffect(() => {
		if (!currentTile) return;

		// Crée les nodes pour la simulation : currentTile + ses liens
		const linkNodes: TileType[] = [
			{ ...currentTile, id: currentTile.id || "root", x: window.innerWidth / 2, y: window.innerHeight / 2 },
			...currentTile.links
				.map(linkId => {
					const tile = getTileById(graphData, linkId);
					return tile
						? { ...tile, id: linkId, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
						: null;
				})
				.filter(Boolean) as TileType[],
		];

		setNodes(linkNodes);

		// Simulation D3
		const links = currentTile.links.map(linkId => ({ source: currentTile.id, target: linkId }));

		const simulation = forceSimulation(linkNodes)
			.force("charge", forceManyBody().strength(-200)) // répulsion entre nodes
			.force("center", forceCenter(window.innerWidth / 2, window.innerHeight / 2)) // tuile principale centrée
			.force("link", forceLink(links).id(d => d.id).distance(150))
			.on("tick", () => {
				setNodes([...linkNodes]); // met à jour le state pour React
			});

		return () => simulation.stop();
	}, [currentTile]);

	return (
		<div className="relative w-full h-screen">
			{nodes.map(node => (
				<Tile
					key={node.id}
					title={node.title}
					description={node.description}
					x={node.x || 0}
					y={node.y || 0}
					onClick={
						node.id !== currentTile.id
							? () => navigateToTile(node.id)
							: undefined
					}
				/>
			))}
			{/!* Article si présent *!/}
			{currentTile.article && (
				<article className="absolute bottom-4 left-4 max-w-md bg-white p-4 rounded shadow">
					{currentTile.article}
				</article>
			)}
		</div>
	);
};*/

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
		router();
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
		<div ref={containerRef} className="relative w-full h-screen">
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
					title={node.title}
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