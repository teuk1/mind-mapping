import { useTranslation } from 'react-i18next';

export const SwitchLanguage: React.FC = () => {
	const { t, i18n } = useTranslation();

	const toggleLanguage = () => {
		i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
	};
	return (
		<button
			onClick={toggleLanguage}
			className="bg-sunset-500 text-white px-4 py-2 rounded"
		>
			{t('switch_language')}
		</button>
	);
};
