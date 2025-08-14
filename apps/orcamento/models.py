from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()


class Setor(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    responsavel = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    usuarios_permitidos = models.ManyToManyField(User, related_name='setores', blank=True)

    def __str__(self):
        return self.nome
    

class CategoriaOrcamentaria(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)

    def __str__(self):
        return self.nome


class PlanejamentoMensal(models.Model):
    setor = models.ForeignKey(Setor, on_delete=models.CASCADE, related_name='planejamentos')
    categoria = models.ForeignKey(CategoriaOrcamentaria, on_delete=models.CASCADE, related_name='planejamentos')
    mes = models.IntegerField()  # 1-12
    ano = models.IntegerField()
    valor_orcado = models.FloatField()

    class Meta:
        unique_together = ('setor', 'categoria', 'mes', 'ano')

    def __str__(self):
        return f"{self.setor.nome} - {self.categoria.nome} ({self.mes}/{self.ano})"
    

class MovimentacaoOrcamentaria(models.Model):
    planejamento = models.ForeignKey(PlanejamentoMensal, on_delete=models.CASCADE, related_name='movimentacoes')
    valor = models.FloatField()
    data = models.DateField(default=datetime.now)
    descricao = models.TextField(blank=True)
    TIPO_CHOICES = [
        ('despesa', 'Despesa'),
        ('receita', 'Receita')
    ]
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.tipo.capitalize()} de R${self.valor} em {self.data}"


class RemanejamentoOrcamentario(models.Model):
    origem = models.ForeignKey(PlanejamentoMensal, on_delete=models.CASCADE, related_name='remanejamentos_saida')
    destino = models.ForeignKey(PlanejamentoMensal, on_delete=models.CASCADE, related_name='remanejamentos_entrada')
    valor = models.FloatField()
    data = models.DateField(default=datetime.now)
    criado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"R$ {self.valor} de {self.origem} → {self.destino}"





