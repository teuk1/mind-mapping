/*
//v2
import React from "react";
import { motion } from "framer-motion";
import type { TileBase } from "../utils/TileTypes";

interface TileProps extends TileBase {
	parent?: () => void;   // callback pour revenir à la tuile parent
	goHome?: () => void;   // callback pour revenir à la tuile principale
	explore?: () => void;  // callback si une seule tuile enfant
	childrenCount?: number; // nombre d'enfants pour savoir si on affiche "explorer"
}

export const Tile: React.FC<TileProps> = ({
	                                          title,
	                                          description,
	                                          id,
	                                          x,
	                                          y,
	                                          onClick,
	                                          parent,
	                                          goHome,
	                                          explore,
	                                          childrenCount,
                                          }) => {
	return (
		<motion.div
			onClick={onClick}
			className="absolute w-36 p-4 rounded-lg shadow-lg bg-white flex flex-col justify-between cursor-pointer"
			style={{
				left: x - 72, // centrage approximatif
				top: y - 72,
			}}
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			whileHover={{ scale: 1.05 }}
		>
			{/!* Contenu principal *!/}
			<div className="flex-1">
				<strong className="block text-lg">{title}</strong>
				<p className="text-sm mt-1">{description}</p>
				{id && <p className="text-xs mt-1 text-gray-500">{id}</p>}
			</div>

			{/!* Footer navigation *!/}
			<div className="mt-2 flex justify-between text-xs">
				{parent && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							parent();
						}}
						className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
					>
						← Retour
					</button>
				)}
				{goHome && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							goHome();
						}}
						className="px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 transition"
					>
						Home
					</button>
				)}
				{childrenCount === 1 && explore && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							explore();
						}}
						className="px-2 py-1 bg-green-200 rounded hover:bg-green-300 transition"
					>
						Explorer →
					</button>
				)}
			</div>
		</motion.div>
	);
};*/


// v3 - auto-déduction depuis JSON
import React from "react";
import { motion } from "framer-motion";
import type { TileBase } from "../utils/TileTypes";

interface TileProps extends TileBase {
	links?: string[];              // liens vers les enfants
	navigate: (id: string) => void; // callback pour naviguer vers une autre tuile
}

export const Tile: React.FC<TileProps> = ({
	                                          id,
	                                          title,
	                                          description,
	                                          x,
	                                          y,
	                                          links,
	                                          onClick,
	                                          navigate,
                                          }) => {
	const isHome = id === "root";
	const hasSingleChild = links && links.length === 1;

	return (
		<motion.div
			onClick={onClick}
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