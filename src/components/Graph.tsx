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
			{/* Tuile courante */}
			<Tile
				title={currentTile.title}
				description={currentTile.description}
			/>
			{/* Tuiles des liens */}
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
			{/* Article si présent */}
			{currentTile.article && <article>{currentTile.article}</article>}
		</div>
	);
};