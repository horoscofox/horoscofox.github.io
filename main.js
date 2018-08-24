var hex = { encode: function (e) { e = unescape(encodeURIComponent(e)); for (var n = "", o = 0; o < e.length; o++)n += e.charCodeAt(o).toString(16); return n }, decode: function (e) { for (var n = "", o = 0; o < e.length; o += 2)n += String.fromCharCode(parseInt(e.substr(o, 2), 16)); return decodeURIComponent(escape(n)) } }

const SIGNS = [
    { value: 'capricorn', label: '♑️ Capricorno' },
    { value: 'aquarius', label: '♒️ Acquario' },
    { value: 'pisces', label: '♓️ Pesci' },
    { value: 'aries', label: '♈️ Ariete' },
    { value: 'taurus', label: '♉️ Toro' },
    { value: 'gemini', label: '♊️ Gemelli' },
    { value: 'cancer', label: '♋️ Cancro' },
    { value: 'leo', label: '♌️ Leone' },
    { value: 'virgo', label: '♍️ Vergine' },
    { value: 'libra', label: '♎️ Bilancia' },
    { value: 'scorpio', label: '♏️ Scorpione' },
    { value: 'sagittarius', label: '♐️ Sagittario' }
]

const ASTROLOGERS = [
    { value: 'paolo', label: 'Paolo Fox' },
    { value: 'branko', label: 'Branko' }
]

const KINDS = [
    {value:'today', label: 'Oggi'},
    {value:'tomorrow', label:'Domani'},
    {value:'week', label:'Questa settimana'}
]

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

emojize = (text) => {
    text = text.replace("amore ", "amore ❤️ ")
    text = text.replace("AMORE:", "AMORE ❤️ :")
    text = text.replace("Amore ", "Amore ❤️ ")
    text = text.replace("Soldi ", "Soldi 💰 ")
    text = text.replace("soldi ", "soldi 💰 ")
    text = text.replace("Spese ", "Spese 🛍 ")
    text = text.replace("spese ", "spese 🛍 ")
    text = text.replace("Luna ", "Luna 🌙 ")
    text = text.replace("luna ", "luna 🌙 ")
    text = text.replace("Sole ", "Sole ☀️ ")
    text = text.replace("sole ", "sole ☀️ ")
    text = text.replace("lavoro ", "lavoro 🛠 ")
    text = text.replace("LAVORO:", "<br>LAVORO 🛠 :")
    text = text.replace("Lavoro ", "Lavoro 🛠 ")
    text = text.replace("BENESSERE:", "<br>BENESSERE 🌴 :")
    return text
}

generateOption = (select, optionSet, selected='') => {
    var select = document.getElementById(select)
    for (let i in optionSet) {
        if (selected == optionSet[i].value){
            select.add(new Option(optionSet[i].label, optionSet[i].value, true, true))
        }else{
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
    for (let index in validatedSet){
        if (validatedSet[index].value == value){
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

validateUrlParameters = (astrologer,sign,day) =>{
    return validate(astrologer,ASTROLOGERS) && validate(sign,SIGNS) && validate(day,KINDS)
}

initializeAll = () => {
    init_select()
    hide(document.getElementById('r'))
    const element = document.getElementById("welcome")
    const astologerSelect = element.querySelector('#astrologer')
    const daySelect = element.querySelector('#day')
    const signSelect = element.querySelector('#sign')

    submitRequest = () => {
        callService(compileUrl(), options)
    }

    returnToHomepage = () => {
        toggle(document.getElementById('welcome'))
        toggle(document.getElementById('r'))
    }

    compileUrl = () => {
        var astologer = astologerSelect.options[astologerSelect.selectedIndex].value
        var day = daySelect.options[daySelect.selectedIndex].value
        var sign = signSelect.options[signSelect.selectedIndex].value
        if (validateUrlParameters(astologer,sign,day)){
            var pathCompleted = hex.decode(base_url) + `/${astologer}/${sign}/${day}`
            return pathCompleted
        }else{
            console.log('You cannot play with me');
        }
    }
    element.querySelector('#search').addEventListener("click", submitRequest)
    document.getElementById('r').addEventListener("click", returnToHomepage)
}

domIsReady(initializeAll)