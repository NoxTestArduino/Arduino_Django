from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('graph_data', views.graph_data)
]
