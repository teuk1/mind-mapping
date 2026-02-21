import './App.css'

import { Graph } from "./components/Graph";

import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
	const { t, i18n } = useTranslation();

	const toggleLanguage = () => {
		i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
	};
	return (
		/* V1<div>
			{/!*<h1>Graphe Interactif</h1>*!/}
			<h1>{t('welcome')}</h1>
			<Graph />
			<button
				onClick={toggleLanguage}
				className="bg-sunset-500 text-white px-4 py-2 rounded"
			>
				{t('switch_language')}
			</button>
		</div>*/
		<div className="h-screen flex flex-col overflow-hidden">

			{/* Toolbar Top */}
			<div className="flex-none px-6 py-4 border-b">
				<h1 className="text-xl font-semibold">
					{t('welcome')}
				</h1>
			</div>

			{/* Graph zone */}
			<div className="flex-1 relative overflow-hidden">
				<Graph />
			</div>

			{/* Toolbar Bottom */}
			<div className="flex-none px-6 py-4 border-t flex justify-end">
				<button
					onClick={toggleLanguage}
					className="bg-sunset-500 text-white px-4 py-2 rounded"
				>
					{t('switch_language')}
				</button>
			</div>

		</div>
	);
};

