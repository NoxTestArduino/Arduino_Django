from django.shortcuts import render
import requests
from django.http import HttpResponse, JsonResponse
import pytz
from datetime import datetime


def index(request):
    return render(request, 'main/index.html')


def get_data():
    tz = pytz.timezone('Asia/Yerevan')
    url = "http://api.thingspeak.com/channels/2050833/feeds.json?api_key=CCH3VT3Y1E2B4MP2&results=20"
    response = requests.get(url)
    data = response.json()
    feeds = data["feeds"]

    temperature_res = [feeds[i][f'field1'] for i in range(20)]
    humidity_res = [feeds[i][f'field2'] for i in range(20)]
    co2_res = [feeds[i][f'field3'] for i in range(20)]
    tvoc_res = [feeds[i][f'field4'] for i in range(20)]

    times = []

    for i in range(20):
        time = feeds[i]['created_at']
        dt = datetime.strptime(time, '%Y-%m-%dT%H:%M:%SZ')
        dt_utc4 = dt.astimezone(tz)
        times.append(str(dt_utc4.strftime("%H:%M:%S")))

    res_data = {
        "labels": times,
        "Temperature": temperature_res,
        "Humidity": humidity_res,
        "CO2": co2_res,
        "TVOC": tvoc_res
    }
    
    return res_data


def graph_data(request):
    return JsonResponse(get_data())
