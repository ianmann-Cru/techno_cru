from .settings_general import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'omc2of%dr3shmzl1!pl#cns3+0dbd7f0(0h2o5(a)(j*v3z$#1'

DEBUG = False

ALLOWED_HOSTS = ["technocru.pythonanywhere.com"]

WSGI_APPLICATION = 'techno_cru.wsgi.production.application'