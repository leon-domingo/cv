#!/bin/bash

# ES version
node ./pdf/to_pdf.js --url http://dev.io/cv --pdf ./pdf/leon-domingo-cv__ES.pdf

# EN version
node ./pdf/to_pdf.js --url http://dev.io/cv/en.html --pdf ./pdf/leon-domingo-cv__EN.pdf
