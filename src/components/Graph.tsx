import React, { useState } from "react";
import { Tile } from "./Tile";
import graphDataJson from "../data/graph.json";

interface Node {
	id: string;
	title: string;
	description: string;
	links: string[];
	article?: string;
}

export const Graph: React.FC = () => {
	const [currentId, setCurrentId] = useState("root");
	const nodes: Node[] = graphDataJson;

	const currentNode = nodes.find((n) => n.id === currentId)!;

	return (
		<div>
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				{/* Tuile actuelle */}
				<Tile
					title={currentNode.title}
					description={currentNode.description}
				/>

				{/* Tuiles suivantes */}
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

			{/* Article */}
			{currentNode.article && (
				<div style={{ marginTop: "20px", padding: "10px", border: "1px solid #aaa" }}>
					{currentNode.article}
				</div>
			)}
		</div>
	);
};