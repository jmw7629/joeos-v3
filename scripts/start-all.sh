#!/usr/bin/env bash
cd ~/joeos-v3
./scripts/stop.sh
cd ~/joeos-v3/api
nohup npm run dev > ~/joeos-v3/logs/api.log 2>&1 &
sleep 2
cd ~/joeos-v3/dashboard
npm run dev
