import { el } from "./dom.js";

// Object mit allen Daten
export let weather = {
    apiKey : "df8fab3fc7083aa7d6044179793c0995", // API Key
    loadJSON : async function(url){ // JSON Funktion zum auslesen
        const data = await (await fetch(url)).json();
        console.log(data);
        return data;

    },
    fetchWeather: async function(city){ // Function um LINK für WetterDaten mit der URL zu verändern 
        const url  = "https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=metric&appid=" 
        + this.apiKey
    
        const data = await weather.loadJSON(url); // Wetterdaten laden
        this.displayWeather(data); // Wetter anzeigen und Daten übergeben mit Parameter
    },
    displayWeather: function(data){ // Funktion um Daten von JSON ins DOM zu übergeben
        const { name } = data; // Name der Stadt
        const { icon,description } = data.weather[0]; // Beschreibung und ICON 
        const { temp,humidity} = data.main; // Temperatur und Feuchtigkeit 
        const { speed } = data.wind; // Windgeschwindigkeit
        console.log(name,icon,description,temp,humidity,speed); 
        el(".city").innerText = `Weather in ${name}`; // Name wird an DOM Element übergeben
        el(".temp").innerText = temp + " " + "°C"; // Temperatur wird an DOM Element übergeben
        el(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"; // ICON wird in den LINK hinzugefügt um es dynamisch zum Wetter der Stadt anzupassen
        el(".description").innerText = description; // Beschreibung der Wetterlage wird an DOM Element übergeben
        el(".humidity").innerText = `Humidity: ${humidity}%`; // Feuchtigkeit wird an DOM Element übergeben
        el(".windspeed").innerText = `Windspeed: ${speed}km/h`; // Windgeschwindigkeit wird an DOM Element übergeben
        el(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/random/1600x900/?" + name + "')";
    },
    search: function(){
        this.fetchWeather(el(".search-bar").value); // this = weatherObject, Value von der SearchBar wird an die FetchWeather Funktion übergeben
    },
    findMyPos: function(){
        
        const success = (position) => {
            console.log(position);
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            this.loadJSON(url).then(location =>{ // lädt loadJSON Funktion = (Promise) danach mit .then() wartet bis die Funktion fertig ist und gibt Daten zurück 
                const city =  location.city;//City Eigenschaft vom Object
                this.fetchWeather(city);//führt fetchWeather aus mit City Variable
            });
             
            
            
            
        }   
        const error = () => {//Wenn Location nicht zugelassen  wird!
            el(".city").innerText = this.fetchWeather("Berlin");
        }
        
        
        navigator.geolocation.getCurrentPosition(success, error);


    }

}


  
  