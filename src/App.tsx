import './App.css'

import React, { useState } from 'react';
import { Graph } from "./components/Graph";

import { SwitchViewMode } from './components/preferences/SwitchViewMode';
import { SwitchLanguage } from './components/preferences/SwitchLanguage';

import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
	const { t } = useTranslation();
	const [mode, setMode] = useState<'recenter' | 'navigate'>('recenter');

	return (
		//V2
		<div className="h-screen flex flex-col overflow-hidden">

			{/* Toolbar Top */}
			<div className="flex-none px-6 py-4 border-b">
				<h1 className="text-xl font-semibold">
					<a href="/" className="hover:underline">
						{t('welcome')}
					</a>
				</h1>
			</div>

			{/* Graph zone */}
			<div className="flex-1 relative overflow-hidden">
				<Graph mode={mode} />
			</div>

			{/* Toolbar Bottom */}
			<div className="flex-none px-6 py-4 border-t flex justify-end">
				{/*Switch ViewMode*/}
				<SwitchViewMode mode={mode} setMode={setMode} />

				{/*Switch Language*/}
				<SwitchLanguage />
			</div>

		</div>
	);
};

