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
            displayCountries.innerHTML += templateBasicInfosCountries(country);
        }
    }
}


function templateBasicInfosCountries(country){
    return `
    <div class="card_basic_infos">
        <h2>${country.name.common}</h2>
    </div>
    `
}

//next buttons -----
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



