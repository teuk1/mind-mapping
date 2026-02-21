/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
*/
import './App.css'

import { Graph } from "./components/Graph";

/*function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	    <div className="min-h-screen bg-red-500 flex items-center justify-center">
		    <h1 className="text-white text-4xl font-bold">
			    Tailwind OK ?
		    </h1>
	    </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/

import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
	const { t, i18n } = useTranslation();

	const toggleLanguage = () => {
		i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
	};
	return (
		<div style={{ padding: "20px" }}>
			{/*<h1>Graphe Interactif</h1>*/}
			<h1>{t('welcome')}</h1>
			<Graph />
			<button
				onClick={toggleLanguage}
				className="bg-sunset-500 text-white px-4 py-2 rounded"
			>
				{t('switch_language')}
			</button>
		</div>
	);
};

