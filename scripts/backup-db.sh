#!/usr/bin/env bash

mysqldump --opt -q --add-drop-database -u root -h 127.0.0.1 -proot \
--databases graphql-presentation > db.sql
