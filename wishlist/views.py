# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.generic.detail import DetailView

from ezi.views import ApiView

from main.utils import ctx_with_settings
from wishlist.models import Wishlist


class WishlistIndexView(DetailView):

    model = Wishlist

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(WishlistIndexView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super(WishlistIndexView, self).get_context_data(*args, **kwargs)
        context["settings"] = settings
        return context
