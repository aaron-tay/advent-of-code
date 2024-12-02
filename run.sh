#!/bin/bash
set -e

YEAR=$1
QUESTION=$2

node --stack-size=100000 --trace-warnings "./src/${YEAR}/${QUESTION}/main.js" --file "./src/${YEAR}/${QUESTION}/input"
