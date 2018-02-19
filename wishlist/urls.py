from django.conf.urls import url

from ezi.urls import crud_api_url_factory

from wishlist.models import Wishlist, ItemRequest, ItemRecord

from wishlist.views import WishlistIndexView
from wishlist.api.views import get_item_request_html, get_item_request_details_html, get_item_request_add_form_html

urlpatterns = [
    url(r'^index/(?P<pk>\d+)/$', WishlistIndexView.as_view(), name="index"),
]

urlpatterns += [
    url(r'^api/item_request/(?P<wish_pk>\d+)/$', get_item_request_html, name="api_get_item_html"),
    url(r'^api/item_request/details/(?P<item_pk>\d+)/$', get_item_request_details_html, name="api_get_item_details_html"),
    url(r'^api/item_request/add/form/(?P<wishlist_pk>\d+)/', get_item_request_add_form_html, name="api_get_item_add_form_html"),
]

urlpatterns += crud_api_url_factory([
    Wishlist, ItemRequest, ItemRecord
])
