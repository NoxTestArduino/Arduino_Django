let myChart = null;


function temperature_graph(){
   fetch('/temperature_graph')
   .then(response => response.json())
   .then(data => {
       create_canvas(data, "Temperature", 'rgba(0, 0, 0, 0.5)', 'rgba(255, 100, 100, 1)');
   });
}

function humidity_graph(){
   fetch('/humidity_graph')
   .then(response => response.json())
   .then(data => {
     create_canvas(data, "Humidity", 'rgba(0, 0, 0, 0.5)', 'rgba(0, 110, 255, 1)');
   });
}

function co2_graph(){
   fetch('/co2_graph')
   .then(response => response.json())
   .then(data => {
     create_canvas(data, "CO2", 'rgba(0, 0, 0, 0.5)', 'rgba(255, 226, 30, 1)');
   });
}

function tvoc_graph(){
   fetch('/tvoc_graph')
   .then(response => response.json())
   .then(data => {
     create_canvas(data, "TVOC", 'rgba(0, 0, 0, 0.5)', 'rgba(144, 144, 144, 1)');
   });
}

function create_canvas(data, name, bdcolor, bgcolor) {
   var labels = Object.keys(data);
   var values = Object.values(data);
   var ctx = document.getElementById('myChart').getContext('2d');


   const minValue = Math.min.apply(null, values);
   const maxValue = Math.max.apply(null, values);


   const max_min = (((10 * (maxValue - minValue)) / 9) - (maxValue - minValue)) / 2;


   if (myChart != null) {
       myChart.destroy();
   }


   myChart = new Chart(ctx, {
       type: 'line',
       data: {
           labels: labels,
           datasets: [{
               label: name,
               data: values,
               backgroundColor: bgcolor,
               borderColor: bdcolor,
               borderWidth: 1
           }]
       },
       options: {
           maintainAspectRatio: false,
           aspectRatio: 2,
           scales: {
               y: {
                   suggestedMin: minValue - max_min,
                   suggestedMax: maxValue + max_min
               }
           }
       }
   });
}



// UPDATE GRAPH AND VALUES EVERY 15 SECONDS
setInterval(function() {
   // Получаем данные с сервера
   fetch('http://api.thingspeak.com/channels/2050833/feeds.json?api_key=CCH3VT3Y1E2B4MP2&results=1')
     .then(response => response.json())
     .then(data => {
       const temperatureValue = document.getElementById("temperature-value");
       temperatureValue.innerHTML = data['feeds'][0]['field1'] + "°C";


       const humidityValue = document.getElementById("humidity-value");
       humidityValue.innerHTML = data['feeds'][0]['field2'] + "%";


       const co2Value = document.getElementById("co2-value");
       co2Value.innerHTML = Math.floor(data['feeds'][0]['field3']) + " ppm";


       const tvocValue = document.getElementById("tvoc-value");
       tvocValue.innerHTML = Math.floor(data['feeds'][0]['field4']) + " ppb";

       if (window.location.hash == "#temperature") {
           temperature_graph();
       }
       else if (window.location.hash == "#humidity") {
           humidity_graph();
       }
       else if (window.location.hash == "#co2") {
           co2_graph();
       }
       else if (window.location.hash == "#tvoc") {
           tvoc_graph();
       }
     })
     .catch(error => console.error(error));
 }, 15000);



// OPEN AND CLOSE SIDEBAR
function openNav() {
   document.getElementById("mySidebar").style.width = "400px";
   document.getElementById('openCloseBtn').onclick = closeNav;
   document.getElementById('openCloseBtn').innerText = "×";
   document.getElementById('openCloseBtn').style.fontSize = "46px";
   document.getElementById('openCloseBtn').style.top = "0px";
   document.getElementById('tempForm').style.opacity = 1;
}

function closeNav() {
   document.getElementById("mySidebar").style.width = "55px";
   document.getElementById('openCloseBtn').onclick = openNav;
   document.getElementById('openCloseBtn').innerText = "☰";
   document.getElementById('openCloseBtn').style.fontSize = "27px";
   document.getElementById('openCloseBtn').style.top = "10px";
   document.getElementById('tempForm').style.opacity = 0;
}
