"""techno_cru URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView

from main import urls as main_urls
from wishlist import urls as wishlist_urls

urlpatterns = [
    url(r'^helm/', admin.site.urls),
    url(r'^$', RedirectView.as_view(url=reverse_lazy('wishlist:list'), permanent=False)),
    url(r'^', include(main_urls, namespace="main")),
    url(r'^wishlist/', include(wishlist_urls, namespace="wishlist"))
]
