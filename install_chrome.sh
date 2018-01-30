#!/bin/bash
DIRECTORY=${HOME}/$1
FILE=google-chrome.deb
FILE_PATH=$DIRECTORY/$FILE

mkdir -p $DIRECTORY

if [ ! -e $FILE_PATH ]; then
  curl -L -o $FILE https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb;
  mv $FILE $DIRECTORY
fi

sudo dpkg -i $FILE_PATH
echo "Using chrome `google-chrome --version`"