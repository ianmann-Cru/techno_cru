# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.shortcuts import render
from django.views.generic.detail import DetailView

from main.utils import ctx_with_settings
from wishlist.models import Wishlist

class WishlistIndexView(DetailView):

    model = Wishlist

    def get_context_data(self, *args, **kwargs):
        context = super(WishlistIndexView, self).get_context_data(*args, **kwargs)
        context["settings"] = settings
        return context
