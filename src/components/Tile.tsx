// v3 - auto-déduction depuis JSON
import React from "react";
import { motion } from "framer-motion";
import type { TileBase } from "../interfaces/Tile.interface";

interface TileProps extends TileBase {
	navigate: (id: string) => void; // callback pour naviguer vers une autre tuile
	mode: 'recenter' | 'navigate';  // mode actif
}

export const Tile: React.FC<TileProps> = ({
	                                          id,
	                                          title,
	                                          description,
	                                          x,
	                                          y,
	                                          links,
	                                          navigate,
	                                          mode,
	                                          onClick,
                                          }) => {
	const isHome = id === "root";
	const hasSingleChild = links && links.length === 1;

	const handleClick = () => {
		if (links.length === 1 && mode === 'navigate') {
			navigate(links[0]); // change de vue
		} else if (mode === 'recenter') {
			// ici on recentre la tuile sans changer la vue
			// parent Graph.tsx gère l'animation / scroll
			onClick?.();
		} else {
			onClick?.();
		}
	};

	return (
		<motion.div
			onClick={handleClick}
			className="absolute w-36 p-4 rounded-lg shadow-lg bg-white flex flex-col justify-between cursor-pointer"
			style={{
				left: x - 72,
				top: y - 72,
				minHeight: 180, // pour que le footer ait toujours de la place
			}}
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			whileHover={{ scale: 1.05 }}
		>
			{/* Contenu principal */}
			<div className="flex-1">
				<strong className="block text-lg">{title}</strong>
				<p className="text-sm mt-1">{description}</p>
				{id && <p className="text-xs mt-1 text-gray-500">{id}</p>}
			</div>

			{/* Footer automatique */}
			<div className="mt-2 flex justify-between text-xs">
				{!isHome && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							navigate("root");
						}}
						className="px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 transition"
					>
						Home
					</button>
				)}
				{hasSingleChild && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							navigate(links![0]);
						}}
						className="px-2 py-1 bg-green-200 rounded hover:bg-green-300 transition"
					>
						Explorer →
					</button>
				)}
			</div>
		</motion.div>
	);
};