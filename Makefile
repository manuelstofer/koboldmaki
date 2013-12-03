install:
	@npm install

build: install
	@echo build ...
	@./node_modules/.bin/component-install -d
	@./node_modules/.bin/component-build -d

test: build
	@echo runing test ...
	@./node_modules/mocha-phantomjs/bin/mocha-phantomjs test/test-runner.html

clean:
	rm -rf build components

.PHONY: test build clean
