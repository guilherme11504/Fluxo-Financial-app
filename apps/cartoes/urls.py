from django.urls import path
from . import views

urlpatterns = [
    path('', views.cartoes, name='cartoes'),
    path('register/', views.register_view, name='register'),
]