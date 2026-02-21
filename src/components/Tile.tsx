import React from "react";

interface TileProps {
	title: string;
	description: string;
	onClick?: () => void;
}

export const Tile: React.FC<TileProps> = ({ title, description, onClick }) => {
	return (
		<div
			onClick={onClick}
			style={{
				border: "2px solid #333",
				borderRadius: "10px",
				padding: "15px",
				width: "150px",
				cursor: onClick ? "pointer" : "default",
				margin: "10px",
				transition: "transform 0.2s",
			}}
			onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
			onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
		>
			<strong>{title}</strong>
			<p>{description}</p>
		</div>
	);
};