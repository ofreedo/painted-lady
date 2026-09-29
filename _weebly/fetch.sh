#!/bin/zsh
# Snapshot the live Weebly store pages + their stylesheets (read-only backup before the restyle).
# Run from the repo root:  zsh _weebly/fetch.sh
set -e
S=https://shop.thepaintedladynapavalley.com
D=_weebly/snapshot
mkdir -p $D
typeset -A pages
pages=(
  home        /
  category    /store/c1/Featured_Products.html
  summerween  /summerween.html
  cart        /store/cart
)
for k v in ${(kv)pages}; do
  curl -sL "$S$v" -o "$D/$k.html"
  echo "$k: $(wc -c < $D/$k.html) bytes"
done
# one product page, taken from the store sitemap
prod=$(curl -sL "$S/sitemap.xml" | grep -o '<loc>[^<]*/store/p[^<]*</loc>' | head -1 | sed 's/<[^>]*>//g')
curl -sL "$prod" -o "$D/product.html"; echo "product: $prod"
# every stylesheet the pages reference
grep -ho '<link[^>]*stylesheet[^>]*>' $D/*.html | grep -o 'href="[^"]*"' | sed 's/href="//;s/"$//' | sort -u > $D/css-urls.txt
n=0
while read u; do
  case $u in //*) u="https:$u";; /*) u="$S$u";; esac
  n=$((n+1)); curl -sL "$u" -o "$D/css-$n.css"; echo "css-$n: $u ($(wc -c < $D/css-$n.css) bytes)"
done < $D/css-urls.txt
# site navigation as published
echo "--- nav links"
grep -o '<a[^>]*class="wsite-menu-item"[^>]*>[^<]*' $D/home.html | sed 's/.*href="\([^"]*\)".*>\(.*\)/\2 -> \1/' | sort -u
