from django import forms
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.forms import AuthenticationForm
from django.forms.widgets import PasswordInput, TextInput

from wishlist.models import ItemRequest

class ItemRequestAddForm(forms.ModelForm):

    class Meta:
        model = ItemRequest
        exclude = ["date_requested"]
