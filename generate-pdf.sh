#!/bin/bash

# ES version
node ./pdf/to_pdf.js --url http://localdev.io/cv --pdf ./pdf/leon-domingo-cv__ES.pdf

# EN version
node ./pdf/to_pdf.js --url http://localdev.io/cv/en --pdf ./pdf/leon-domingo-cv__EN.pdf
