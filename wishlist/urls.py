from django.conf.urls import url

from wishlist.views import site_statement

urlpatterns = [
    url(r'^site_statement/', site_statement),
]
