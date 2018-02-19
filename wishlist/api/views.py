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

from main.models import TeamMember
from main.utils import ctx_with_settings
from wishlist.forms import ItemRequestAddForm
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

@login_required
def get_item_request_add_form_html(request, wishlist_pk):
    """
    Returns the html for the form that will be used to create an ItemRequest.
    This view does not actually add a request, just renders the form html.
    """
    if not request.method == "GET":
        return HttpResponseBadRequest("Please don't do that.")
    elif not Wishlist.objects.filter(pk=wishlist_pk).exists():
        return HttpResponseBadRequest("That wishlist doesn't exist.")
    else:
        def initialize_item_form():
            item_form_initial = {
                "belongs_to": wishlist_pk,
                "requested_by": request.user.pk,
            }
            form = ItemRequestAddForm(initial=item_form_initial)
            return form
        context = {
            "item_form": initialize_item_form()
        }
        response = render_to_string("wishlist/modules/item_request_add.html", context, request=request)
        return HttpResponse(response)

@login_required
def add_item_request(request, wishlist_pk):
    """
    Does the actual adding of an ItemRequest.
    """
    if not request.method == "POST":
        return HttpResponseBadRequest("Please don't do that.")
    elif not Wishlist.objects.filter(pk=wishlist_pk).exists():
        return HttpResponseBadRequest("That wishlist doesn't exist.")
    else:
        def initialize_item_form():
            post = request.POST
            post_mutable = post._mutable
            post._mutable = True
            form = ItemRequestAddForm(post)
            form.data.update({
                "belongs_to": wishlist_pk,
                "requested_by": request.user.pk
            })
            post._mutable = post_mutable
            return form
        def process_form(form):
            response = {}
            if form.is_valid():
                item = form.save()
                if item:
                    response["item_request"] = item.json()
                else:
                    response["errors"] = {"__all__": "Could not create item request."}
            else:
                response["errors"] = form.errors
            return response
        item_form = initialize_item_form()
        response = process_form(item_form)
        return JsonResponse(response)
