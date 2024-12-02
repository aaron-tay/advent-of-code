#!/bin/bash
set -e

YEAR=$1
QUESTION=$2

node --trace-warnings "./src/${YEAR}/${QUESTION}/main.js" --file "./src/${YEAR}/${QUESTION}/test"
