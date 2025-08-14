# apps/orcamento/urls.py
from django.urls import path
from . import views

app_name = 'orcamento'

urlpatterns = [
    path('', views.orcamento, name='orcamento'),
]
