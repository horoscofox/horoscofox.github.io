var hex = { encode: function (e) { e = unescape(encodeURIComponent(e)); for (var n = "", o = 0; o < e.length; o++)n += e.charCodeAt(o).toString(16); return n }, decode: function (e) { for (var n = "", o = 0; o < e.length; o += 2)n += String.fromCharCode(parseInt(e.substr(o, 2), 16)); return decodeURIComponent(escape(n)) } }

const SIGNS = [
    { value: 'aries', emoji: '♈︎', label: 'Ariete' },
    { value: 'taurus', emoji: '♉︎', label: 'Toro' },
    { value: 'gemini', emoji: '♊︎', label: 'Gemelli' },
    { value: 'cancer', emoji: '♋︎', label: 'Cancro' },
    { value: 'leo', emoji: '♌︎', label: 'Leone' },
    { value: 'virgo', emoji: '♍︎', label: 'Vergine' },
    { value: 'libra', emoji: '♎︎', label: 'Bilancia' },
    { value: 'scorpio', emoji: '♏︎', label: 'Scorpione' },
    { value: 'sagittarius', emoji: '♐︎', label: 'Sagittario' },
    { value: 'capricorn', emoji: '♑︎', label: 'Capricorno' },
    { value: 'aquarius', emoji: '♒︎', label: 'Acquario' },
    { value: 'pisces', emoji: '♓︎', label: 'Pesci' }
]

const ASTROLOGERS = [
    { value: 'paolo', emoji: '', label: 'Paolo Fox' },
    { value: 'branko', emoji: '', label: 'Branko' }
]

const KINDS = [
    { value: 'today', emoji: '', label: 'Oggi' },
    { value: 'tomorrow', emoji: '', label: 'Domani' },
    { value: 'week', emoji: '', label: 'Questa settimana' },
    { value: 'month', emoji: '', label: 'Questo mese' },
    { value: 'info', emoji: '', label: 'Informazioni sul segno' }
]

/* Set of useful functions */
replaceAll = (str, find, replace) => {
    // Replace all occurences of word in a text
    return str.replace(new RegExp(find, 'g'), replace);
}

show = (elem) => {
    elem.style.display = 'block'
}

showInline = (elem) => {
    elem.style.display = 'inline'
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

conditionalToggle = (elem, condition, inline = false) => {
    inline ? condition ? hide(elem) : showInline(elem) : condition ? hide(elem) : show(elem)
}

domIsReady = (callback) => {
    if (document.readyState == 'complete') {
        callback();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback)
    }
}
/* End of useful functions */

returnToHomepage = () => {
    toggle(document.getElementById('welcome'))
    toggle(document.getElementById('r'))
}

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
            select.add(new Option(optionSet[i].emoji + ' ' + optionSet[i].label, optionSet[i].value, true, true))
        } else {
            select.add(new Option(optionSet[i].emoji + ' ' + optionSet[i].label, optionSet[i].value))
        }
    }
}

validateDataOfStorage = (key, value) => {
    if (key == 'astrologer' || key == 'sign' || key == 'day') {
        if (validate(value, ASTROLOGERS) || validate(value, SIGNS) || validate(value, KINDS)) {
            return true
        } else {
            return false
        }
    }
    return false
}

setDataStorage = (key, value) => {
    try {
        if (validateDataOfStorage(key, value)) {
            localStorage.setItem(key, value)
            return value
        }
    } catch (e) {
        return false
    }
}

getOrCreateFromStorage = (key, create = '') => {
    try {
        let value = localStorage.getItem(key);
        if (value && (validate(value, ASTROLOGERS) || validate(value, SIGNS) || validate(value, KINDS))) {
            return value
        } else {
            return setDataStorage(key, create)
        }
    } catch (e) {
        return create
    }
}

updateStorage = (key, value = '') => {
    let oldValue = getOrCreateFromStorage(key, '')
    if (oldValue != value) {
        setDataStorage(key, value)
    }
}

init_select = () => {
    let def_astrologer = getOrCreateFromStorage('astrologer', 'paolo')
    let def_sign = getOrCreateFromStorage('sign', 'virgo')
    let def_day = getOrCreateFromStorage('day', 'today')
    generateOption('astrologer', optionSet = ASTROLOGERS, def_astrologer)
    generateOption('sign', optionSet = SIGNS, def_sign)
    generateOption('day', optionSet = KINDS, def_day)
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

const base_url = "68747470733a2f2f676274323869363435672e657865637574652d6170692e65752d776573742d312e616d617a6f6e6177732e636f6d2f646576";
const options = {
    method: "GET"
}

compileResults = (text, dateStart, dateEnd) => {
    toggle(document.getElementById('r'))
    document.getElementById('r_text').innerHTML = text
    document.getElementById('r_d_s').innerHTML = dateStart
    document.getElementById('r_d_e').innerHTML = dateEnd
    document.getElementById('goback').addEventListener("click", returnToHomepage)
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

hideKindSelect = () => {
    let element = document.getElementById("welcome")
    let daySelect = element.querySelector('#day')
    conditionalToggle(daySelect.parentElement, astrologer.value == "branko")
    conditionalToggle(daySelect.parentElement.previousElementSibling, astrologer.value == "branko", inline = true)
    if (astrologer.value == "branko") daySelect.selectedIndex = 0
}

initializeAll = () => {
    init_select()
    hide(document.getElementById('r'))
    const element = document.getElementById("welcome")
    const astrologerSelect = element.querySelector('#astrologer')
    if (astrologerSelect.options[astrologerSelect.selectedIndex].value=='branko') hideKindSelect()
    const daySelect = element.querySelector('#day')
    const signSelect = element.querySelector('#sign')

    compileRTitle = () => {
        var astologer = astrologerSelect.options[astrologerSelect.selectedIndex].text
        var sign = signSelect.options[signSelect.selectedIndex].text
        document.getElementById('r_title').innerHTML = `${sign}`
        document.getElementById('r_astrologer').innerHTML = `${astologer} `
    }

    submitRequest = () => {
        callService(compileUrl(), options)
    }

    enableCoolMode = () => {
        toggle(document.getElementById('cool-mode-elem'))
        msg = document.getElementById('lbl_cool_mode').innerHTML
        msg_enabled = "Guarda quante stelle!"
        msg_enable = "Dov'è il cielo stellato?"
        document.getElementById('lbl_cool_mode').innerHTML = msg == msg_enabled ? msg_enable : msg_enabled;
    }

    compileUrl = () => {
        compileRTitle()
        var astrologer = astrologerSelect.options[astrologerSelect.selectedIndex].value
        if (astrologer=='branko') daySelect.selectedIndex=0
        var day = daySelect.options[daySelect.selectedIndex].value
        var sign = signSelect.options[signSelect.selectedIndex].value
        updateStorage('astrologer', astrologer)
        updateStorage('sign', sign)
        updateStorage('day', day)
        if (validateUrlParameters(astrologer, sign, day)) {
            var pathCompleted = hex.decode(base_url) + `/${astrologer}/${sign}/${day}`
            return pathCompleted
        } else {
            // User has modified options values, and it cannot play with us
            console.log('You cannot play with me');
        }
    }
    astrologer.addEventListener("change", function () {
       hideKindSelect()
    });
    element.querySelector('#search').addEventListener("click", submitRequest)
    document.getElementById('cool_mode').addEventListener("click", enableCoolMode)
}

domIsReady(initializeAll)