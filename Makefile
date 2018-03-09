.PHONY: update-function

LAMBDA_FUNCTION_S3_BUCKET = infraestructura.dev
AWS_REGION_DEPLOY = eu-west-1
ENV = dev
FUNCTION = comunication
PORTAL_NAME = bookingmotor
HOST_USER = $(USER)

modules: ## Construye los modulos para la funcion lamda
	@docker-compose run --rm modules
	@sudo chown -R $(HOST_USER):$(HOST_USER) node_modules

clean: ## Remove the zip from the function lambda generated.
	@echo "clean up package files"
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	@if [ -f $(LAMBDA_FUNCTION_NAME).zip ]; then rm $(LAMBDA_FUNCTION_NAME).zip; fi

lambda: ## Generate zip file all from app folder
	@make clean
	@echo "Create package archive..."
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	@cd app && zip -rq $(LAMBDA_FUNCTION_NAME).zip .
	@mv app/$(LAMBDA_FUNCTION_NAME).zip ./

start: ## s
	./script.sh start

list: ## List all bucket s3
	./script.sh list

upload-function: ## Upload the lambda function to s3 to deploy later
	@make clean
	@make lambda
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	$(eval LAMBDA_FUNCTION_S3_KEY := build/lambda/$(PORTAL_NAME)/$(ENV)/$(FUNCTION)/$(LAMBDA_FUNCTION_NAME).zip )
	@echo "Upload file to s3"
	./script.sh copy ./$(LAMBDA_FUNCTION_NAME).zip s3://$(LAMBDA_FUNCTION_S3_BUCKET)/$(LAMBDA_FUNCTION_S3_KEY)
	@make clean
	@echo "Success"

update-stack: ## Display the stack of the lambda function in cloudformation, pay attention the environment and the deployment region. Consider the variable ENV as the deployment environment and LAMBDA_FUNCTION_S3_BUCKET the bucket where the source of lambda function is located
	@make upload-function
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	$(eval LAMBDA_FUNCTION_S3_KEY := build/lambda/$(PORTAL_NAME)/$(ENV)/$(FUNCTION)/$(LAMBDA_FUNCTION_NAME).zip )
	./script.sh aws cloudformation deploy \
	--template-file ./sam_template.yaml \
	--stack-name $(LAMBDA_FUNCTION_NAME) \
	--parameter-overrides \
		EnvPrefix=$(ENV) \
		SourceFunctionBucket=$(LAMBDA_FUNCTION_S3_BUCKET) \
		SourceFunctionKey=$(LAMBDA_FUNCTION_S3_KEY) \
	--capabilities CAPABILITY_NAMED_IAM \
	--region $(AWS_REGION_DEPLOY)

update-function: ## Actualiza el codigo de la funcion lambda. Considere la variable ENV como entorno de despliegue y LAMBDA_FUNCTION_S3_BUCKET el bucket donde se encuentra la fuente de la funcion lambda
	@make upload-function
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	$(eval LAMBDA_FUNCTION_S3_KEY := build/lambda/$(PORTAL_NAME)/$(ENV)/$(FUNCTION)/$(LAMBDA_FUNCTION_NAME).zip )
	./script.sh aws lambda update-function-code \
	--function-name $(LAMBDA_FUNCTION_NAME) \
	--s3-bucket $(LAMBDA_FUNCTION_S3_BUCKET) \
	--s3-key $(LAMBDA_FUNCTION_S3_KEY) \
	--region $(AWS_REGION_DEPLOY)

test-function: ## Actualiza el codigo de la funcion lambda. Considere la variable ENV como entorno de ejecucion
	$(eval LAMBDA_FUNCTION_NAME := $(PORTAL_NAME)-$(ENV)-$(FUNCTION))
	./script.sh aws lambda invoke \
	--invocation-type RequestResponse \
	--function-name ${LAMBDA_FUNCTION_NAME} \
	--region $(AWS_REGION_DEPLOY) \
	--log-type Tail \
	--payload file://test.json \
	outputfile.txt | jq '.LogResult' -r | base64 --decode

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-16s\033[0m %s\n", $$1, $$2}'