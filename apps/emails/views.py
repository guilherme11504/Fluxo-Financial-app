
from django.core.mail import send_mail
from django.shortcuts import render 

def send_confirmation_email(request):
    if request.method == 'POST':
        recipient_email = request.POST.get('email')

        send_mail(
            subject='Confirmação de Cadastro',
            message='Seu cadastro foi realizado com sucesso!',
            from_email=None,  # usa o DEFAULT_FROM_EMAIL
            recipient_list=[recipient_email],
            fail_silently=False,
        )

        return render(request, 'email_sent.html')

    return render(request, 'send_email_form.html')