from .settings_general import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'omc2of%dr3shmzl1!pl#cns3+0dbd7f0(0h2o5(a)(j*v3z$#1'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

WSGI_APPLICATION = 'techno_cru.wsgi.development.application'
