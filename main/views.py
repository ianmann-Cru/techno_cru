# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from main.utils import ctx_with_settings

def site_statement(request):
    template = "site_statement.html"
    context = ctx_with_settings({})
    return render(request, template, context)
