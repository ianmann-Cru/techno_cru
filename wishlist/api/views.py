# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views.generic.detail import DetailView

from ezi.views import ApiView

from main.utils import ctx_with_settings
from wishlist.models import Wishlist, ItemRequest

@login_required
def get_item_request_html(request, wish_pk):
    """
    Returns html for a list display of all ItemRequests in
    a Wishlist.
    """
    if not request.method == "GET":
        return HttpResponseBadRequest("Please don't do that.")
    else:
        items = ItemRequest.objects.filter(belongs_to__id=wish_pk)
        response = ""
        for item in items:
            response += render_to_string("wishlist/modules/item_request.html", {"item": item})
        return HttpResponse(response)

@login_required
def get_item_request_details_html(request, item_pk):
    if not request.method == "GET":
        return HttpResponseBadRequest("Please don't do that.")
    else:
        try:
            item = ItemRequest.objects.get(pk=item_pk)
        except ItemRequest.DoesNotExist:
            item = None
        response = render_to_string("wishlist/modules/item_request_details.html", {"item": item})
        return HttpResponse(response)
