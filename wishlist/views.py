# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

def site_statement(request):
    template = "wishlist/site_statement.html"
    context = {}
    return render(request, template, context)
