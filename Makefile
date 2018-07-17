# Note how the port and IP address of the server are explicitly provided
server:
	python -m http.server 8000 --bind 127.0.0.1

.PHONY: server
