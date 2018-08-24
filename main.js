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

replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(find, 'g'), replace);
}


show = (elem) => {
    elem.style.display = 'block'
}

hide = (elem) => {
    elem.style.display = 'none'
}

toggle = (elem) => {
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


makeAccentedLetters = (text) => {
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
    let result = false
    for (let index in validatedSet) {
        if (validatedSet[index].value == value) {
            result = true
            break
        }
    }
    return result
}

const base_url = "68747470733a2f2f347331673135356e70322e657865637574652d6170692e75732d776573742d312e616d617a6f6e6177732e636f6d2f646576";
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
            console.log('You cannot play with me');
        }
    }
    element.querySelector('#search').addEventListener("click", submitRequest)
    document.getElementById('goback').addEventListener("click", returnToHomepage)
}

domIsReady(initializeAll)