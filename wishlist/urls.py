from django.conf.urls import url

from ezi.urls import crud_api_url_factory

from wishlist.models import Wishlist, ItemRequest, ItemRecord

from wishlist.views import WishlistIndexView

urlpatterns = [
    url(r'^index/(?P<pk>\d+)/$', WishlistIndexView.as_view(), name="index"),
]

urlpatterns += crud_api_url_factory([
    Wishlist, ItemRequest, ItemRecord
])
