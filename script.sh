#!/usr/bin/env bash

set -e

CK='\u2714'
ER='\u274c'

alias cls='printf "\033c"'

export DEV_UID=$(id -u)
export DEV_GID=$(id -g)


app_start()
{
    aws --endpoint-url=http://localhost:4572 s3 mb s3://infraestructura.dev
#    if [[ -z "${AWS_ACCESS_KEY_ID// }" ]]; then
#        app_save_acces_credential_aws
#        app_start
#    else
#        access_aws_credentials ecr get-login --no-include-email --region ap-northeast-1 | sh
#
#        docker-compose up -d
#
#        if [ $? -eq 0 ]; then
#            echo -e "\n\n$CK  [Docker UP] "
#            echo -e "\n----------------------------------------------------------"
#            echo -e "\n App Server RUN  ===> http://$DOMAIN   \r"
#            echo -e "\n----------------------------------------------------------\n"
#        else
#            echo -e "\n$ER [Docker UP] No se pudo levantar docker.\n"
#        fi
#    fi
}

app_down()
{
   docker-compose down

   echo -e "\n\n$CK  [Docker Down] \n"
}

app_symfony_console()
{
    docker-compose exec --user $(id -u):$(id -g) php bin/console $@
}

app_aws_copy()
{
    aws --endpoint-url=http://localhost:4572 s3 cp $@
}

app_aws_list()
{
    aws --endpoint-url=http://localhost:4572 s3 ls
}

case "$1" in
"start")
    app_start
    ;;
"list")
    app_aws_list
    ;;
"stop")
    app_down
    ;;
"console")
    app_symfony_console ${@:2}
    ;;
"copy")
    app_aws_copy ${@:2}
    ;;
"aws")
    app_save_acces_credential_aws ${@:2}
    ;;
*)
    echo -e "\n\n\n$ER [APP] No se especifico un comando valido\n"
    ;;
esac