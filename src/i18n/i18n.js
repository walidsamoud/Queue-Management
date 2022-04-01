import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default new VueI18n({
	locale: localStorage.getItem('Language') ? localStorage.getItem('Language') : 'fr', // set default locale
	fallbackLocale: 'fr',
	silentTranslationWarn: true,
	messages: {
		en: require('../locales/en.json'),
		fr: require('../locales/fr.json'),
		es: require('../locales/es.json'),
		pt: require('../locales/pt.json'),
		de: require('../locales/de.json'),
		ru: require('../locales/ru.json'),
		ar: require('../locales/ar.json'),
		//he: require('../locales/he.json'),
	},

})