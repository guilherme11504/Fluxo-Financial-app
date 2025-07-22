from django.urls import path
from . import views

app_name = 'cartoes'

urlpatterns = [
    path('', views.cartoes, name='cartoes'),
    path('register_card/', views.register_view, name='register_card'),
    path('delete_card/<int:cartao_id>/', views.delete_cartao, name='delete_card'),
    path('edit_card/<int:cartao_id>/', views.update_cartao, name='edit_card'),
]