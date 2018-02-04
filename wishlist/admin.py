# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from wishlist.models import Wishlist, ItemRecord, ItemRequest

admin.site.register([
    Wishlist, ItemRecord, ItemRequest
])
