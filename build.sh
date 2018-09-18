#!/bin/sh

git pull && preact build --no-prerender && echo '{ "rewrites": [ {"source":"/**","destination":"/index.html"} ] }' > build/superstatic.json