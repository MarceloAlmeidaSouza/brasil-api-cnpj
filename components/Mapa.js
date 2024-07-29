import Dom from "../utilities/Dom.js";

export default class Mapa {
    static #map;
    static #marker;

    static main() {
        if(document.getElementById("mapModal")){
            throw new Error("Already added to the DOM");
        }

        const main = Dom.castToElement(`
            <!-- Modal para o mapa -->
                <div class="modal fade" id="mapModal" tabindex="-1" role="dialog" aria-labelledby="mapModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="mapModalLabel">Localização da Empresa</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <!-- Container para o mapa -->
                                <div id="map" style="height: 400px;"></div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                            </div>
                        </div>
                    </div>
                    <style>

                        .icon-buttons {
                            display: flex;
                            justify-content: flex-start;
                            gap: 10px;
                            margin-bottom: 10px;
                        }

                        .btn-icon {
                            background-color: #f8f9fa;
                            border: none;
                            border-radius: 50%;
                            padding: 10px;
                            font-size: 18px;
                            color: #007bff;
                            cursor: pointer;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        }

                        .btn-icon:hover {
                            background-color: #e2e6ea;
                        }

                        #map {
                            height: 400px;
                        }
                    </style>
                </div>
        `);

        return main;
    }

    static async #photonKomoot(address){
        try {
            const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`);
            const data = await response.json();
            if (data.features.length > 0) {
                return [data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]];
            } else {
                throw new Error('Endereço não encontrado.');
            }
        } catch (error) {
            console.error('Erro na geocodificação:', error);
            return [0, 0]; // Retorna coordenadas padrão em caso de erro
        }
    }

    static async #nominatim(address){
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
            const data = await response.json();
            if (data.length > 0) {
                return [data[0].lat, data[0].lon];
            } else {
                throw new Error('Endereço não encontrado.');
            }
        } catch (error) {
            console.error('Erro na geocodificação:', error);
            return [0, 0]; // Return default coordinates in case of error
        }
    }

    static async locate(data) {
        const mapElement = document.getElementById('map');

        let [latitude, longitude] = [0, 0];
        let address = `br,${data.municipio},${data.uf},${data.numero} ${data.logradouro}`;

        try{
            [latitude, longitude] = await Mapa.#nominatim(address);
        }catch(ex){}
    
        try{
            if(latitude === 0){
                [latitude, longitude] = await Mapa.#photonKomoot(address);
            }
        }catch(ex){}
        

        // Define the tile layers
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors'
        });

        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        if (!Mapa.#map) {
            // Initialize the map
            Mapa.#map = L.map(mapElement).setView([latitude, longitude], 13);

            // Add the default tile layer (satellite)
            osmLayer.addTo(Mapa.#map);

            // Define base layers for layer control
            const baseLayers = {
                "Standard Map": osmLayer,
                "Satellite View": satelliteLayer
            };

            // Add layer control to the map
            L.control.layers(baseLayers).addTo(Mapa.#map);

            // Add the marker
            Mapa.#marker = L.marker([latitude, longitude]).addTo(Mapa.#map)
                .bindPopup(`<b>${data.razao_social}</b><br>${data.logradouro}, ${data.numero} - ${data.cep}`)
                .openPopup();
        } else {
            // Update the map view
            Mapa.#map.setView([latitude, longitude], 13);

            // Update the marker position
            if (Mapa.#marker) {
                Mapa.#marker.setLatLng([latitude, longitude])
                    .bindPopup(`<b>${data.razao_social}</b><br>${data.logradouro}, ${data.numero} - ${data.cep} `)
                    .openPopup();
            } else {
                Mapa.#marker = L.marker([latitude, longitude]).addTo(Mapa.#map)
                    .bindPopup(`<b>${data.razao_social}</b><br>${data.logradouro}, ${data.numero} - ${data.cep}`)
                    .openPopup();
            }
        }
    }
}