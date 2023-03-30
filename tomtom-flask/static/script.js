var map = null
var instructions = null
var results = null
var api_key = "FINkRW9vyyAfiAXdcsM62UKl64oS17Qj"

function convertTime(sec) {
    var hours = Math.floor(sec/3600);
    (hours >= 1) ? sec = sec - (hours*3600) : hours = '00';
    var min = Math.floor(sec/60);
    (min >= 1) ? sec = sec - (min*60) : min = '00';
    (sec < 1) ? sec='00' : void 0;
 
    (min.toString().length == 1) ? min = '0'+min : void 0;    
    (sec.toString().length == 1) ? sec = '0'+sec : void 0;    
 
    return {
        hrs: hours,
        mins: min,
        secs: sec
    }    
}

document.getElementById("submit-btn").addEventListener("click", calculateRoute)


function calculateRoute() {
    const lat0 = document.getElementById("lat-origin").value
    const long0 = document.getElementById("long-origin").value
 
    const lat1 = document.getElementById("lat-dest").value
    const long1 = document.getElementById("long-dest").value
 
    // fetch request goes here
}

fetch(`https://api.tomtom.com/routing/1/calculateRoute/${lat0},${long0}:${lat1},${long1}/json?routeRepresentation=summaryOnly&instructionsType=text&key=${api-key}`)
    .then(response => response.json())
    .then((data) => {
        loadMapWithStopTimes(data, long0, long1, lat0, lat1)
    })



    function loapMapWithStopTimes(data, long0, long1, lat0, lat1) {
        // the rest of the code will go here
        const {hrs, mins, secs} = convertTime(data.routes[0].summary.travelTimeInSeconds)
        const timeBtn = document.getElementById('time')
        timeBtn.innerHTML = `Your Journey will take ${hrs} hours, ${mins} minutes and 
        ${secs} seconds`
        instructions = data.routes[0].guidance.instructions
        let label = document.createElement('label')        
        label.innerHTML = "Choose a time to stop for a meal"        
        
        let select = document.createElement('select')
        select.id = "stop-time"
        select.name = "time"
        select.onchange = getRestaurants


                // Keep track of the minutes already included
                let minTracker = null
        
                instructions.forEach((instruction, index) => {
         
                    // We don't want to get the first and last time
                    if(index !== 0 && index !== 1 && index !== instruction.length - 1) {                    
                            let {hrs, mins} = convertTime(instruction.travelTimeInSeconds)                            
         
                            // Check if minute is already included
                            if (mins !== minTracker) {
                                
                                // Create select option
                                minTracker = mins
                                let option = document.createElement('option')                    
         
                                // add travelTime to value attribute
                                option.setAttribute('value', instruction.travelTimeInSeconds)
                                option.innerHTML = `${hrs} ${hrs === 1 ? 'hour': 'hours'} and ${mins} minutes in`                    
         
                                // Append option to select
                                select.appendChild(option)
                            }                    
                        }
                                        
                    })
      }


      document.getElementById('form-section').remove()    
 
      // Now, insert into the page
      let targetEl = document.getElementById("select-input-div")
      targetEl.appendChild(label)
      targetEl.appendChild(select)


      let locations = [
        { lat: lat0,  lng: long0},
        { lat: lat1,  lng: long1}
    ]
    
    map = tt.map({
        key: api-key,
        container: 'map',
        center: locations[0],
        bearing: 0,
        maxZoom: 21,
        minZoom: 1,
        pitch: 60,
        zoom: 14,
    });        
    
    map.addControl(new tt.FullscreenControl()); 
    map.addControl(new tt.NavigationControl());         
    
    locations.forEach((location, index) => {                    
        new tt.Marker().setLngLat(location).addTo(map)                                                                                                                                      
    })


    function getRestaurants() {    
        const option = document.getElementById("stop-time").value    
            
            const selectedLoc = instructions.find((instruction) => {
                return instruction.travelTimeInSeconds == option
            })    
         
            const lat = selectedLoc.point.latitude
            const long = selectedLoc.point.longitude
         
            // fetch request goes here
            fetch(`https://api.tomtom.com/search/2/categorySearch/pizza.json?lat=${lat}&lon=${long}&radius=1700&categorySet=7315&view=Unified&relatedPois=off&key=${api_key}`)
            .then(response => response.json())
            .then((data) => {
                // The remaining code will go here
                results = data.results
                results.forEach((result) => {                        
                    let dl = document.createElement('dl')
                    dl.className = "restaurants_list"
         
                    const dt_1 = document.createElement('dt')            
                    dt_1.innerHTML = `Restaurant Name:`
         
                    const dd_1 = document.createElement('dd')
                    dd_1.innerHTML = result.poi.name
         
                    const dt_2 = document.createElement('dt')
                    dt_2.innerHTML = `Address:`        
         
                    const dd_2 = document.createElement('dd')
                    dd_2.innerHTML = result.address.freeformAddress
         
                    const dt_3 = document.createElement('dt')
                    dt_3.innerHTML = `Phone No:`
         
                    const dd_3 = document.createElement('dd')
                    dd_3.innerHTML = result.poi.phone            
         
                    const btn = document.createElement('button')
                    btn.id = result.id
                    btn.className = "restaurants"
                    btn.innerHTML = "Add to map"
         
                    dl.appendChild(dt_1)
                    dl.appendChild(dd_1)            
         
                    dl.appendChild(dt_2)
                    dl.appendChild(dd_2)
         
                    dl.appendChild(dt_3)
                    dl.appendChild(dd_3)
                    
                    dl.appendChild(btn)
                    
                    document.getElementById('time').appendChild(dl)
                })
            })
        }

        let resButtons = document.getElementsByClassName("restaurants")
        for(let i=0; i<resButtons.length; i++) {
            resButtons[i].addEventListener("click", () => {                               
                let selectedRes = results.find((result) => {            
                    return result.id == resButtons[i].id
                })                                
 
                const lat = selectedRes.position.lat
                const lon = selectedRes.position.lon
 
                const popup = new tt.Popup({ offset: 50 }).setText(selectedRes.poi.name)
 
                new tt.Marker().setLngLat({lat: lat, lng: lon}).setPopup(popup).addTo(map)
            })
        }