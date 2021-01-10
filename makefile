.PHONY: coverage
.PHONY: coverage-report

coverage_% :
	COVERAGE_PROCESS_START=./.coveragerc coverage run \
		--concurrency=multiprocessing \
		--rcfile=./.coveragerc manage.py test \
		--settings=homiehomie.settings_d.$* --parallel
	coverage combine

coverage-report :
	coverage report

coverage-report_% :
	coverage $* -o coverage.$*