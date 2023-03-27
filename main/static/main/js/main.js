let myChart = null;


function create_canvas(data) {
    var labels = data["labels"];
    var temperature_values = data["Temperature"];
    var humidity_values = data["Humidity"];
    var co2_values = data["CO2"];
    var tvoc_values = data["TVOC"];
    
    var ctx = document.getElementById('myChart').getContext('2d');


    if (myChart != null) {
        myChart.destroy();
    }

    var visiblities = [true, true, true, true];

    if (window.location.hash == "#temperature") {
        visiblities[0] = false;
    }
    else if (window.location.hash == "#humidity") {
        visiblities[1] = false;
    }
    else if (window.location.hash == "#co2") {
        visiblities[2] = false;
    }
    else if (window.location.hash == "#tvoc") {
        visiblities[3] = false;
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
            {
            label: "Temperature",
            data: temperature_values,
            backgroundColor: 'rgba(255, 100, 100, 1)',
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            hidden: visiblities[0]
            },
            {
                label: "Humidity",
                data: humidity_values,
                backgroundColor: 'rgba(0, 110, 255, 1)',
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                hidden: visiblities[1]
            },
            {
                label: "CO2",
                data: co2_values,
                backgroundColor: 'rgba(255, 226, 30, 1)',
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                hidden: visiblities[2]
            },
            {
                label: "TVOC",
                data: tvoc_values,
                backgroundColor: 'rgba(144, 144, 144, 1)',
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 1,
                hidden: visiblities[3]
            }]
        },
        options: {
            maintainAspectRatio: false,
            aspectRatio: 2,
        }
    });
}

function change_canvas(data){
    var labels = data["labels"];
    var temperature_values = data["Temperature"];
    var humidity_values = data["Humidity"];
    var co2_values = data["CO2"];
    var tvoc_values = data["TVOC"];

    myChart.data.labels = labels;
    myChart.data.datasets[0].data = temperature_values;
    myChart.data.datasets[1].data = humidity_values;
    myChart.data.datasets[2].data = co2_values;
    myChart.data.datasets[3].data = tvoc_values;

    myChart.update();
}

function change_graph(s_name){
    myChart.data.datasets[0]["hidden"] = true;
    myChart.data.datasets[1]["hidden"] = true;
    myChart.data.datasets[2]["hidden"] = true;
    myChart.data.datasets[3]["hidden"] = true;
    myChart.update();

    if (s_name == "temperature") {
        myChart.data.datasets[0]["hidden"] = false;
    }
    else if (s_name == "humidity") {
        myChart.data.datasets[1]["hidden"] = false;
    }
    else if (s_name == "co2") {
        myChart.data.datasets[2]["hidden"] = false;
    }
    else if (s_name == "tvoc") {
        myChart.data.datasets[3]["hidden"] = false;
    }

    myChart.update();
}



// UPDATE GRAPH AND VALUES EVERY 15 SECONDS
setInterval(function() {
    fetch('/graph_data')
    .then(response => response.json())
    .then(data => {
        const temperatureValue = document.getElementById("temperature-value");
        temperatureValue.innerHTML = data['Temperature'][19] + "°C";


        const humidityValue = document.getElementById("humidity-value");
        humidityValue.innerHTML = data['Humidity'][19] + "%";


        const co2Value = document.getElementById("co2-value");
        co2Value.innerHTML = Math.floor(data['CO2'][19]) + " ppm";


        const tvocValue = document.getElementById("tvoc-value");
        tvocValue.innerHTML = Math.floor(data['TVOC'][19]) + " ppb";

        if (myChart != null) {
            change_canvas(data);
        }
        else {
            create_canvas(data);
        }
    })
    .catch(error => console.error(error));
 }, 15000);



// OPEN AND CLOSE SIDEBAR
function openNav() {
    fetch('http://api.thingspeak.com/channels/2050867/feeds.json?api_key=OSB5M9JHABGO5O28&results=1')
    .then(response => response.json())
    .then(data => {
        document.getElementById("min-temp").value = data["feeds"][0]["field2"];
        document.getElementById("max-temp").value = data["feeds"][0]["field1"];
    });
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


function post_max_min(){
    fetch("https://api.thingspeak.com/update", {
        method: "POST",
        body: JSON.stringify({
            api_key: "X3N13CFB1APHVK8G",
            field1: document.getElementById("max-temp").value,
            field2: document.getElementById("min-temp").value,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(data => {
        // Обрабатываем ответ от сервера
        if (data == 0) {
            window.alert("Error")
        }
      })
      .catch(error => {
        // Обрабатываем ошибку
        console.error(error);
      });
}