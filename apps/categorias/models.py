from django.db import models

class Categoria(models.Model):
    TIPO_CHOICES = (
        ('receita', 'Receita'),
        ('despesa', 'Despesa'),
    )

    nome = models.CharField(max_length=100, unique=True)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    icone = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nome} ({self.tipo})"
