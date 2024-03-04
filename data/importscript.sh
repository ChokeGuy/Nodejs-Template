#!/bin/bash

mongoimport --db='mydatabase' --collection='products' --file='/tmp/products.json' --jsonArray