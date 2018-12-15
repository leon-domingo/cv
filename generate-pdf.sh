#!/bin/bash

# ES version
node ./pdf/to_pdf.js --url http://dev.io/cv --pdf ./pdf/cv-es.pdf

# EN version
node ./pdf/to_pdf.js --url http://dev.io/cv/en.html --pdf ./pdf/cv-en.pdf
