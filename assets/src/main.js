var hex = { encode: function (e) { e = unescape(encodeURIComponent(e)); for (var n = "", o = 0; o < e.length; o++)n += e.charCodeAt(o).toString(16); return n }, decode: function (e) { for (var n = "", o = 0; o < e.length; o += 2)n += String.fromCharCode(parseInt(e.substr(o, 2), 16)); return decodeURIComponent(escape(n)) } }

const SIGNS = [
    { value: 'aries', label: '♈️ Ariete' },
    { value: 'taurus', label: '♉️ Toro' },
    { value: 'gemini', label: '♊️ Gemelli' },
    { value: 'cancer', label: '♋️ Cancro' },
    { value: 'leo', label: '♌️ Leone' },
    { value: 'virgo', label: '♍️ Vergine' },
    { value: 'libra', label: '♎️ Bilancia' },
    { value: 'scorpio', label: '♏️ Scorpione' },
    { value: 'sagittarius', label: '♐️ Sagittario' },
    { value: 'capricorn', label: '♑️ Capricorno' },
    { value: 'aquarius', label: '♒️ Acquario' },
    { value: 'pisces', label: '♓️ Pesci' }
]

const ASTROLOGERS = [
    { value: 'paolo', label: 'Paolo Fox' },
    { value: 'branko', label: 'Branko' }
]

const KINDS = [
    { value: 'today', label: 'Oggi' },
    { value: 'tomorrow', label: 'Domani' },
    { value: 'week', label: 'Questa settimana' }
]
/* Set of useful functions */
replaceAll = (str, find, replace) => {
    // Replace all occurences of word in a text
    return str.replace(new RegExp(find, 'g'), replace);
}


show = (elem) => {
    elem.style.display = 'block'
}

hide = (elem) => {
    elem.style.display = 'none'
}

toggle = (elem) => {
    // Hide if element display is block, show otherwise
    if (window.getComputedStyle(elem).display === 'block') {
        hide(elem)
        return
    }
    show(elem)
}

domIsReady = (callback) => {
    if (document.readyState != 'loading') {
        callback();
    }
    else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback)
    }
}
/* End of useful functions */


makeAccentedLetters = (text) => {
    // api return text without accented letters
    // replace all occurences of "fake accent" 
    text = replaceAll(text, "a'", "à")
    text = replaceAll(text, "perche'", "perché")
    text = replaceAll(text, "finche'", "finché")
    text = replaceAll(text, "poiche'", "poiché")
    text = replaceAll(text, "e'", "è")
    text = replaceAll(text, "o'", "ò")
    text = replaceAll(text, "pò", "po'")
    text = replaceAll(text, "u'", "ù")
    return text
}

emojize = (text) => {
    // Emoji, makes it better!
    // append emoji on specific words
    text = makeAccentedLetters(text)
    text = replaceAll(text, "amore ", "amore ❤️ ")
    text = replaceAll(text, "AMORE:", "AMORE ❤️ :")
    text = replaceAll(text, "Amore ", "Amore ❤️ ")
    text = replaceAll(text, "Soldi ", "Soldi 💰 ")
    text = replaceAll(text, "soldi ", "soldi 💰 ")
    text = replaceAll(text, "Spese ", "Spese 🛍 ")
    text = replaceAll(text, "spese ", "spese 🛍 ")
    text = replaceAll(text, "Luna ", "Luna 🌙 ")
    text = replaceAll(text, "luna ", "luna 🌙 ")
    text = replaceAll(text, "Sole ", "Sole ☀️ ")
    text = replaceAll(text, "sole ", "sole ☀️ ")
    text = replaceAll(text, "lavoro ", "lavoro 🛠 ")
    text = replaceAll(text, "LAVORO:", "<br>LAVORO 🛠 :")
    text = replaceAll(text, "Lavoro ", "Lavoro 🛠 ")
    text = replaceAll(text, "BENESSERE:", "<br>BENESSERE 🌴 :")
    return text
}

generateOption = (select, optionSet, selected = '') => {
    // fill a SelectElement with options
    // select: id of select to fill
    // optionSet: set of all the option to be created
    // selected: value of option who want selected by default
    var select = document.getElementById(select)
    for (let i in optionSet) {
        if (selected == optionSet[i].value) {
            select.add(new Option(optionSet[i].label, optionSet[i].value, true, true))
        } else {
            select.add(new Option(optionSet[i].label, optionSet[i].value))
        }
    }
}

init_select = () => {
    generateOption('astrologer', ASTROLOGERS, "paolo")
    generateOption('sign', SIGNS, "virgo")
    generateOption('day', KINDS, "today")
}

validate = (value, validatedSet) => {
    // check if value is in valueset
    // used to identify if user has modified option value to "hack" api
    let result = false
    for (let index in validatedSet) {
        if (validatedSet[index].value == value) {
            result = true
            break
        }
    }
    return result
}

const base_url = "68747470733a2f2f663463346374633038612e657865637574652d6170692e75732d776573742d312e616d617a6f6e6177732e636f6d2f646576";
const options = {
    method: "GET"
}

compileResults = (text, dateStart, dateEnd) => {
    toggle(document.getElementById('r'))
    document.getElementById('r_text').innerHTML = text
    document.getElementById('r_d_s').innerHTML = dateStart
    document.getElementById('r_d_e').innerHTML = dateEnd
}

callService = (url, options) => {
    fetch(url, options).then(function (response) {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        response.json().then(function (data) {
            toggle(document.getElementById('welcome'))
            compileResults(emojize(data['message']['text']), data['message']['date_start'], data['message']['date_end'])
        });

    })
}

validateUrlParameters = (astrologer, sign, day) => {
    return validate(astrologer, ASTROLOGERS) && validate(sign, SIGNS) && validate(day, KINDS)
}



 


initializeAll = () => {
    init_select()
    doriaInit()
    hide(document.getElementById('r'))
    const element = document.getElementById("welcome")
    const astologerSelect = element.querySelector('#astrologer')
    const daySelect = element.querySelector('#day')
    const signSelect = element.querySelector('#sign')

    compileRTitle = () => {
        var astologer = astologerSelect.options[astologerSelect.selectedIndex].text
        var day = daySelect.options[daySelect.selectedIndex].text
        var sign = signSelect.options[signSelect.selectedIndex].text
        document.getElementById('r_title').innerHTML = `${astologer} - ${sign} - ${day}`
    }

    submitRequest = () => {
        callService(compileUrl(), options)
    }

    returnToHomepage = () => {
        toggle(document.getElementById('welcome'))
        toggle(document.getElementById('r'))
    }

    compileUrl = () => {
        compileRTitle()
        var astologer = astologerSelect.options[astologerSelect.selectedIndex].value
        var day = daySelect.options[daySelect.selectedIndex].value
        var sign = signSelect.options[signSelect.selectedIndex].value
        if (validateUrlParameters(astologer, sign, day)) {
            var pathCompleted = hex.decode(base_url) + `/${astologer}/${sign}/${day}`
            return pathCompleted
        } else {
            // User has modified options values, and it cannot play with us
            console.log('You cannot play with me');
        }
    }
    element.querySelector('#search').addEventListener("click", submitRequest)
    document.getElementById('goback').addEventListener("click", returnToHomepage)
}


doriaInit = () => {
    var dd = doria.prepare({
        title: 'Informativa breve Cookie',
        subtitle:
            "Questo sito utilizza cookie tecnici di prima parte e \
                    cookie analitici di terze parti per offrire agli utenti una \
                    migliore esperienza di navigazione e per raccogliere informazioni \
                    sull’utilizzo del sito stesso. Questo sito NON utilizza cookie di \
                    profilazione. <br>",
        bannerDescription: "Horoscofox utilizza i cookie per migliorare la tua \
                esperienza nel sito. I cookie ti permettono di utilizzare alcune \
                funzioni (come salvare il segno zodiacale).\
                Inoltre, ci permettono di\
                 analizzare l'utilizzo del nostro sito. Continuando a utilizzare \
                 il nostro sito acconsenti all'utilizzo dei cookie.",
        beforeAccept: "Cliccando su Accetto acconsenti all'utilizzo di \
                cookie tecnici di prima parte",
        acceptButtonLabel: "Accetto",
        settingsButtonLabel: "Impostazioni",
        closeButtonLabel: "Chiudi"
    });
    dd.addCookieSettings(
        'marketing',
        'Marketing',
        'Accetto l\'utilizzo di cookie analitici per la valutazione dell\' esperienza utente ',
        ['_ga', '_gat', '_gid']
    );

    dd.addCookieSettings(
        'core',
        'Tecnici',
        'Accetto che venga salvato il mio segno zodiacale e la mia ultima richiesta di oroscopo',
        ['_hs', '_ha', '_hk']
    );
    dd.on('core', function () {
        console.log('Save astrologer, sign and kind');

    })    
    dd.on('marketing', function () {
        window.ga = function () { ga.q.push(arguments) }; ga.q = []; ga.l = +new Date;
        ga('create', 'UA-119353807-2', {"cookieDomain":"none"}); ga('send', 'pageview');
        doria.loadScript("https://www.google-analytics.com/analytics.js").then(function () {      
        })
    })
    dd.bake();

}

domIsReady(initializeAll)