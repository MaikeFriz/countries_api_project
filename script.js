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
    return `
    <div onclick="openOverlayCountryInfo(${index})" class="card_basic_infos">
        <h2>${country.name.common}</h2>
    </div>
    `
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
    overlayBackground.innerHTML = templateDetailedInfosCountry(country);
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
        <div class="title_section_overlay_card">
            <h2>${country.name.common}</h2>
        </div>
        <div class="info_section_overlay_card">
        </div>
        <div class="arrow_section_overlay_card">
            <img class="arrow_overlay_card" src="./assets/img/arrow_left.png">
            <img class="arrow_overlay_card" src="./assets/img/arrow_right.png">
        </div>
    </div>
    `
}