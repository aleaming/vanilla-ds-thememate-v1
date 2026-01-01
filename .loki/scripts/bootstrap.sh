#!/bin/bash
# .loki/scripts/bootstrap.sh

set -euo pipefail

LOKI_ROOT=".loki"

echo "Bootstrapping Loki Mode directory structure..."

# Create directory structure
mkdir -p "$LOKI_ROOT"/{state/{agents,checkpoints,locks},queue,messages/{inbox,outbox,broadcast},logs/{agents,decisions,archive},config,prompts,artifacts/{releases,reports,metrics,backups},scripts}

# Initialize queue files
for f in pending in-progress completed failed dead-letter; do
  echo '[]' > "$LOKI_ROOT/queue/$f.json"
done

# Initialize orchestrator state
cat > "$LOKI_ROOT/state/orchestrator.json" << 'EOF'
{
  "version": "2.9.1",
  "startupId": "",
  "phase": "bootstrap",
  "prdPath": "./docs/requirements.md",
  "prdHash": "",
  "agents": {"active":[],"idle":[],"failed":[],"totalSpawned":0},
  "metrics": {"tasksCompleted":0,"tasksFailed":0,"deployments":0},
  "circuitBreakers": {},
  "lastCheckpoint": "",
  "lastBackup": "",
  "currentRelease": "0.0.0"
}
EOF

# Set startup ID (macOS compatible)
if command -v uuidgen &> /dev/null; then
  STARTUP_ID=$(uuidgen)
else
  STARTUP_ID=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "$(date +%s)-$$")
fi

# Update startup ID (macOS sed syntax)
sed -i '' "s/\"startupId\": \"\"/\"startupId\": \"$STARTUP_ID\"/" "$LOKI_ROOT/state/orchestrator.json"

# Calculate PRD hash
PRD_HASH=$(md5 -q "./docs/requirements.md" 2>/dev/null || md5sum "./docs/requirements.md" | awk '{print $1}')
sed -i '' "s/\"prdHash\": \"\"/\"prdHash\": \"$PRD_HASH\"/" "$LOKI_ROOT/state/orchestrator.json"

echo "Bootstrap complete: $LOKI_ROOT initialized"
echo "Startup ID: $STARTUP_ID"
echo "PRD Hash: $PRD_HASH"
