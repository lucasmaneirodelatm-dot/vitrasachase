#!/usr/bin/env bash
# generate_templates.sh
# Ejecutar desde la raíz del repo. Crea muchas copias de las plantillas (parada_XXXX y bus_XXXX)
set -e
mkdir -p public/paradas public/buses

for id in 100 200 300 400 500 600 6940 6620 20198; do
  out="public/paradas/parada_${id}.html"
  cp public/parada_template.html "$out"
  echo "Creada $out"
done

for id in 6000 6154 6211 7001; do
  out="public/buses/bus_${id}.html"
  # añadimos bus param en la URL usando template (dejar plantilla pero con query param)
  cp public/bus_template.html "$out"
  echo "Creada $out"
done
echo "Templates generadas."
