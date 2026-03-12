#!/usr/bin/env bash

SITEMAP="https://www.chill-dogs.com/sitemap-0.xml"
FAILURES=()

URLS=$(curl -s "$SITEMAP" | grep -o '<loc>[^<]*' | sed 's/<loc>//')

for url in $URLS; do
    echo "=============================="
    echo "$url"
    status=$(curl -o /dev/null -s -w "%{http_code}" -I "$url")
    curl -I -s "$url"
    echo
    if [ "$status" != "200" ]; then
        FAILURES+=("$status $url")
    fi
done

echo ""
echo "=============================="
echo "POST RUN REPORT"
echo "=============================="
if [ ${#FAILURES[@]} -eq 0 ]; then
    echo "ALL GOOD, EVERY LINK IS 200"
else
    for entry in "${FAILURES[@]}"; do
        echo "  $entry"
    done
    echo ""
    echo "${#FAILURES[@]} URL(s) returned non-200 status."
fi
