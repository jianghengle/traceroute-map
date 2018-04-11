#!/bin/sh
cd ../client
TARGET=electron npm run build
cd ../electron
npm start
