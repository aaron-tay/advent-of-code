#!/bin/bash
set -e

YEAR=$1
QUESTION=$2

cp -r "./src/.template" "./src/${YEAR}/${QUESTION}"
