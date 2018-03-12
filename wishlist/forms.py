from django import forms
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.forms import AuthenticationForm
from django.forms.widgets import PasswordInput, TextInput

from wishlist.models import ItemRequest, ItemRecord

class ItemRequestAddForm(forms.ModelForm):

    class Meta:
        model = ItemRequest
        exclude = ["date_requested"]
        widgets = {"online_order_links": forms.TextInput}

class ItemRecordAddForm(forms.ModelForm):

    class Meta:
        model = ItemRecord
        exclude = ["date_reported"]

    def __init__(self, reported_by, is_for, *args, **kwargs):
        """Override of init to set the reported_by and is_for field."""
        super(ItemRecordAddForm, self).__init__(*args, **kwargs)
        self.data._mutable = True
        self.data["reported_by"] = reported_by.pk
        self.data["is_for"] = is_for.pk
