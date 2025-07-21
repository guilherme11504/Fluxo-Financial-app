from django.urls import path
from . import views

urlpatterns = [
    path('', views.cartoes, name='cartoes'),
    path('register_card/', views.register_view, name='register_card'),
]