let base_url = "https://restcountries.com/v3.1/all";
allCountries = [];
let currentIndex = 0;


function init(){
    fetchCountriesData();
}

//fetch countries -----
async function fetchCountriesData(){
    try{
        let response = await fetch(`${base_url}`);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);
        let responseToJson = await response.json();
        allCountries = responseToJson;
        console.log("Fetched countries: ", allCountries);
        renderCountries()
    }
    catch (error){
        console.error("Error fetching countries: ", error);
    }
}

function renderCountries() {
    if (!allCountries || allCountries.length === 0) {
        return;
    }

    let displayCountries = document.getElementById('display_countries_carousel');
    displayCountries.innerHTML = "";

    // **Nur 3 Karten von currentIndex anzeigen**
    for (let index = currentIndex; index < currentIndex + 3; index++) {
        if (index < allCountries.length) { // Sicherstellen, dass wir nicht über das Array hinausgehen
            let country = allCountries[index];
            displayCountries.innerHTML += templateBasicInfosCountries(country, index);
        }
    }
}


function templateBasicInfosCountries(country, index){
    const osmUrl = country.maps.openStreetMaps;
    const embedUrl = generateOSMEmbedURL(osmUrl);
    return `
    <div onclick="openOverlayCountryInfo(${index})" class="card_basic_infos">
        <div class="title_section_card">
            <img class="flag_img" src="${country.flags.svg}">
            <h2>${country.name.common}</h2>
        </div>
        <div class="info_section_card">
            <p><strong>Full Name:</strong> ${country.name.nativeName ? Object.values(country.name.nativeName)[0].official : "N/A"}</p>
            <p><strong>Language:</strong> ${country.languages.eng}</p>
            <p><strong>Capital City:</strong> ${country.capital}</p>
        </div>
        <div class="map_div">
            ${embedUrl ? `<iframe class="map" src="${embedUrl}"></iframe>` : `<p>Map not available</p>`}
        </div>
    </div>
    `
}

function generateOSMEmbedURL(osmUrl) {
    const match = osmUrl.match(/relation\/(\d+)/);
    if (match) {
        return `https://www.openstreetmap.org/export/embed.html?relation=${match[1]}`;
    }
    return null;
}

//next buttons carousel -----
function nextSlide() {
    if (currentIndex + 3 < allCountries.length) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    renderCountries();
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = allCountries.length - 3;
    }
    renderCountries();
}


// open Overlay with country-infos -----
function openOverlayCountryInfo(index){
    let country = allCountries[index]; //muss ich hier nochmal definieren --spaeter nochmal nachvollziehen
    let overlayBackground = document.getElementById("overlay_card_infos");
    overlayBackground.classList.remove("d_none");
    overlayBackground.innerHTML = templateDetailedInfosCountry(country, index);
}

function closeOverlayCountryInfo(){
    let overlayBackground = document.getElementById("overlay_card_infos");
    overlayBackground.classList.add("d_none"); 
}

function bubblingPreventionCardOverlay(event){
    event.stopPropagation();
}

function templateDetailedInfosCountry(country, index){
    return `
    <div onclick="bubblingPreventionCardOverlay(event)" class="card_overlay_info">
        <div class="info_section_overlay_card">
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population}</p>
            <p><strong>Continent:</strong> ${country.continents}</p>
            <p><strong>Timezone(s):</strong> ${country.timezones.join(', ')}</p>
            <p class="right_wrong_symbol_line"><strong>Independent:</strong> ${country.independent ? '<img class="right_wrong_symbol" src="./assets/img/right_symbol.png">' : '<img class="right_wrong_symbol" src="./assets/img/wrong_symbol.png">'} </p>
            <p class="right_wrong_symbol_line"><strong>UN Member:</strong> ${country.unMember ? '<img class="right_wrong_symbol" src="./assets/img/right_symbol.png">' : '<img class="right_wrong_symbol" src="./assets/img/wrong_symbol.png">'}</p>
            <p><strong>Latitude/Langitude:</strong> ${country.latlng}</p>
        </div>
        <div class="title_section_overlay_card">
            <img class="flag_img_overlay" src="${country.flags.svg}">
            <h2>${country.name.common}</h2>
        </div>
        <div class="arrow_section_overlay_card">
            <img onclick="prefCountryArrowCardOverlay(${index})" class="arrow_overlay_card" src="./assets/img/arrow_left.png">
            <img onclick="nextCountryArrowCardOverlay(${index})" class="arrow_overlay_card" src="./assets/img/arrow_right.png">
        </div>
    </div>
    `
}

//next buttons overlay card -----
function nextCountryArrowCardOverlay(index){
    index = (index + 1) % allCountries.length; //% ist Moduloperator um beim letzten Land wieder zum ersten zu springen weil z.B. (9+1)% 10 = 0 oder (4+1)%10 = 5 weil 5/10 ist Rest 5 (weil 10 nich in 5 passt)
    openOverlayCountryInfo(index);            // % der Moduloperator schaut also welcher Rest zurueck bleibt
}

function prefCountryArrowCardOverlay(index){
    index = (index - 1 + allCountries.length) % allCountries.length; // z.B. index = (4 - 1 + 10) % 10 = 3 oder index = (0 - 1 + 10) % 10 = 9
    openOverlayCountryInfo(index);

}
