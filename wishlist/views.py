# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse, reverse_lazy
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView

from ezi.views import ApiView

from main.utils import ctx_with_settings
from wishlist.forms import WishlistAddForm
from wishlist.models import Wishlist


@method_decorator(login_required, name="dispatch")
class WishlistIndexView(DetailView):

    model = Wishlist

    def get_context_data(self, *args, **kwargs):
        context = super(WishlistIndexView, self).get_context_data(*args, **kwargs)
        context["settings"] = settings
        return context


@method_decorator(login_required, name="dispatch")
class WishlistListView(ListView):

    model = Wishlist

    def get_context_data(self, *args, **kwargs):
        context = super(WishlistListView, self).get_context_data(*args, **kwargs)
        context["settings"] = settings
        context["add_form"] = WishlistAddForm(initial={"created_by": self.request.user.pk})
        return context


@method_decorator(login_required, name="dispatch")
class WishlistCreateView(CreateView):

    model = Wishlist
    fields = ["created_by", "name", "purpose"]
    success_url = reverse_lazy("wishlist:list")
