#!/usr/bin/env bash
cd ~/joeos-v3
echo "Checking files..."
test -f api/src/index.ts && echo "API file OK"
test -f dashboard/src/App.tsx && echo "React file OK"
test -f dashboard/src/App.css && echo "CSS file OK"
test -f dashboard/vite.config.ts && echo "Vite config OK"
echo
echo "Checking API..."
curl -s http://localhost:8787/api/health || true
echo
