#!/usr/bin/env bash
cd ~/joeos-v3
echo "=== BRANCH ==="
git branch --show-current
echo
echo "=== STATUS ==="
git status
echo
echo "=== REMOTES ==="
git remote -v
echo
echo "=== COMMITS ==="
git log --oneline --max-count=5
echo
echo "=== FOLDERS ==="
find v4 -maxdepth 2 -type d 2>/dev/null || true
