#!/bin/bash
set -euo pipefail

CSS_DIR="${NEXT_DIST_DIR:-.next}/static/css"
if [ -d "$CSS_DIR" ]; then
  for f in "$CSS_DIR"/*.css; do
    [ -e "$f" ] || continue
    echo "Sanitizing @property in $f"
    # Ensure initial-value: 0 becomes 0% only for properties with <percentage> syntax.
    # We use a non-zero value 0.001% to prevent minifiers from stripping the unit again.
    # This regex ensures we match syntax:"<percentage>" or syntax:"<length-percentage>"
    # followed by any content until initial-value: 0
    perl -pi -e 's/(syntax:"<(?:length-)?percentage>";[^}]*initial-value:)\s*0%?\s*([;}])/$1 0.001%$2/g' "$f"
  done
fi
