/* eslint-disable import/prefer-default-export */
/* eslint-disable arrow-parens */
/* eslint-disable eol-last */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable no-undef */

export const displayMap = (item) => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoib2x1d2FwZWx1bWkxNTQiLCJhIjoiY2tkb3pmem0yMHB6ODJxbXFud3RoMjI1MiJ9.hqFa_OI9BZS1gp-1-HjBfQ';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/oluwapelumi154/cke7158z6153y19qmwc8t89ou',
        scrollZoom: false,
        // center: [-118.243683, 34.052235],
        // zoom: 10,
        // interactive: false,
    });
    console.log(map);
    const bounds = new mapboxgl.LngLatBounds();
    item.forEach(loc => {

        //Create marker
        const el = document.createElement('div');
        el.className = 'marker';
        //Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        }).setLngLat(loc.coordinates).addTo(map);
        //Add popup
        new mapboxgl.Popup().setLngLat(loc.coordinates).setHTML(`<p> Day ${loc.day}:${loc.description}</p>`).addTo(map);
        //Extends the mapbox to include the locations
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 200,
            right: 200,
        },
    });

}