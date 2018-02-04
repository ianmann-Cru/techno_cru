from django.conf.urls import url

from ezi.urls import crud_api_url_factory

from wishlist.models import Wishlist, ItemRequest, ItemRecord

urlpatterns = [
]

urlpatterns += crud_api_url_factory([
    Wishlist, ItemRequest, ItemRecord
])
