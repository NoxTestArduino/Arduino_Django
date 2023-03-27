from django.shortcuts import render
import requests
from django.http import HttpResponse, JsonResponse


def index(request):
    return render(request, 'main/index.html')


def get_data(n):
    url = "http://api.thingspeak.com/channels/2050833/feeds.json?api_key=CCH3VT3Y1E2B4MP2&results=20"
    response = requests.get(url)
    data = response.json()
    feeds = data["feeds"]

    res = [feeds[i][f'field{n}'] for i in range(20)]
    ret_res = {}
    for i, elem in enumerate(res):
        ret_res[i] = elem

    return ret_res


def temperature_graph(request):
    return JsonResponse(get_data(1))


def humidity_graph(request):
    return JsonResponse(get_data(2))


def co2_graph(request):
    return JsonResponse(get_data(3))


def tvoc_graph(request):
    return JsonResponse(get_data(4))
