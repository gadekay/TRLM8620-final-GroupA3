import { locale, updateLocale } from '../app.js';

var stringsJSON = {};

const i18n = {

    //load resource json based on locale
    loadStringsJSON: async (newLocale) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await fetch(`./content/${newLocale}/strings.json`, options)
            stringsJSON = await response.json();
        } catch (err) {
            console.log('Error getting strings', err);
            if (newLocale != "en-US") {
                updateLocale("en-US");
            }
        }
    },

    //load resource json based on locale
    getString: (view, key) => {
        return stringsJSON[view][key];
    },

    //determine the proper currency format based on locale and return html string
    formatCurrency: (price, color) => {
        let formatted;
        let converted = convertCurrency(price);
        formatted = new Intl.NumberFormat(locale, { 
            style: 'currency', 
            currency: currencyMap[locale]['unit'],
            maximumFractionDigits: currencyMap[locale]['digits']
        }).format(converted); //$NON-NLS-L$
        //return the formatted currency within template literal
        return `<h4>${formatted}</h4>`


    },
    //return the locale based link to html file within the 'static' folder
    getHTML: () => {
        return `${locale}/terms.html`; //$NON-NLS-L$
    },
    //format date accoring to locale
    formatDate: (date) => {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat([locale, 'en-US'], options).format(date); //$NON-NLS-L$
    }
}

//used to determine the correct currency symbol
var currencyMap = {
    'en-US': {
        'unit': 'USD',
        'digits': 2
    },
    'zh-CN': {
        'unit': 'CNY',
        'digits': 2
    },    
    'zh-TW': {
        'unit': 'NTD',
        'digits': 0
    },    
    'ja-JP': {
        'unit': 'JPY',
        'digits': 0
    }    
};

//function to perform rough conversion from galactic credits to real currencies
var convertCurrency = (price) => {
    switch (locale) {
        case 'en-US':
            return price * 1;
        case 'zh-CN':
            return price * 7;
        case 'zh-TW':
            return price * 32;
        case 'ja-JP':
            return price * 110;
        default:
            return price;
    }
}

export default i18n;