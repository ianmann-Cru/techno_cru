#!/bin/bash
source `which virtualenvwrapper.sh`

PROJ_NAME="techno_cru"
PROJ_DIR_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ENVS_HOME_DIR="$HOME/envs/"
ENV_NAME=$PROJ_NAME

WSGI_SRC="$PROJ_DIR_PATH/$PROJ_NAME/wsgi/production.py"
WSGI_DESTINATION_DIR="/var/www/"
WSGI_DESTINATION_NAME="technocru_pythonanywhere_com_wsgi.py"

cd "$PROJ_DIR_PATH/$PROJ_NAME"
rm settings.py
rm settings.pyc
ln -s settings_production.py settings.py

cd $PROJ_DIR_PATH
chmod +x manage.py

deactivate
rmvirtualenv $ENV_NAME
mkvirtualenv $ENV_NAME
workon $ENV_NAME
pip install -r requirements.txt

./manage.py migrate
./manage.py collectstatic

cd $WSGI_DESTINATION_DIR
ln -s $WSGI_SRC $WSGI_DESTINATION_NAME
