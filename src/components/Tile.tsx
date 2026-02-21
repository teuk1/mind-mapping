/*
//V1
import React from "react";

import type {TileBase} from "../utils/TileTypes";

export const Tile: React.FC<TileBase> = ({ title, description, onClick, x, y, id }) => {
	return (
		<div
			onClick={onClick}
			className="absolute w-20 rounded cursor-pointer shadow-lg bg-white"
			style={{
				border: "2px solid #333",
				borderRadius: "10px",
				padding: "15px",
				width: "150px",
				cursor: onClick ? "pointer" : "default",
				margin: "10px",
				transition: "transform 0.2s",
				left: x - 40,
				top: y - 40
			}}
			onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
			onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
		>
			{/!*bg-blue-500 text-white flex items-center justify-center*!/}
			<strong>{title}</strong>
			<p>{description}</p>
			<p>{id}</p>
		</div>
	);
};*/

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
			{/* Contenu principal */}
			<div className="flex-1">
				<strong className="block text-lg">{title}</strong>
				<p className="text-sm mt-1">{description}</p>
				{id && <p className="text-xs mt-1 text-gray-500">{id}</p>}
			</div>

			{/* Footer navigation */}
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
};