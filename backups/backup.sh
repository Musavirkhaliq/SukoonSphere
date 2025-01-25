#!/bin/bash

BACKUP_DIR="/root/SukoonSphere.org/backups/$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$BACKUP_DIR"

mongodump --out "$BACKUP_DIR" --host localhost --port 27017
