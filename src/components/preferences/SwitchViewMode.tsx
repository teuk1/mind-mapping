interface SwitchViewModeProps {
	mode: 'recenter' | 'navigate';
	setMode: (mode: 'recenter' | 'navigate') => void;
}

export const SwitchViewMode: React.FC<SwitchViewModeProps> = ({ mode, setMode }) => (
	<div className="bg-sunset-500 text-white px-4 py-2 mr-2 rounded flex justify-center gap-4">
		<button
			onClick={() => setMode('recenter')}
			className={mode === 'recenter' ? 'font-bold' : ''}
		>
			Recentrer
		</button>
		<button
			onClick={() => setMode('navigate')}
			className={mode === 'navigate' ? 'font-bold' : ''}
		>
			Naviguer
		</button>
	</div>
);

