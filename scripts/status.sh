#!/usr/bin/env bash
echo "=== JoeOS Status ==="
echo
echo "Folders:"
ls -la
echo
echo "API health:"
curl -s http://localhost:8787/api/health || true
echo
echo
echo "Dashboard:"
curl -I http://localhost:5173 2>/dev/null || true
echo
echo "Processes:"
ps aux | grep -E "vite|tsx|node" | grep -v grep || true
