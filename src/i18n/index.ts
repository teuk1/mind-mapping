import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
	.use(LanguageDetector) // détecte automatiquement la langue
	.use(initReactI18next) // hook react
	.init({
		fallbackLng: 'fr',
		debug: true,
		resources: {
			fr: {
				translation: {
					welcome: "Bienvenue",
					switch_language: "Changer de langue"
					// ajoute tous tes textes ici
				}
			},
			en: {
				translation: {
					welcome: "Welcome",
					switch_language: "Switch language"
				}
			}
		},
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;