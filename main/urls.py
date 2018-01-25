from django.conf.urls import url

from main.views import site_statement

urlpatterns = [
    url(r'^site_statement/$', site_statement, name="site_statement")
]
