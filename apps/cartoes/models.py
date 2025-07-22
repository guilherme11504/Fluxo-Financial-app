from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime
# Create your models here.

class Cartao(models.Model):
    nome = models.CharField(max_length=100)
    bandeira = models.CharField(max_length=100)
    limite = models.FloatField()
    banco = models.CharField(max_length=100, default='')
    dia_pagamento = models.IntegerField()
    dia_fechamento = models.IntegerField()
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='cartoes')
    ativo = models.BooleanField()
    data_criacao = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"{self.nome} ({self.bandeira})" 
    