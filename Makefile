install:
	@npm install

build: install
	@echo build ...
	@./node_modules/.bin/component-install -d
	@./node_modules/.bin/component-build -d

.PHONY: build
