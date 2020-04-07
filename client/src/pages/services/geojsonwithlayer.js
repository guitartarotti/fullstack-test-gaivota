import { GeoJSON } from 'react-leaflet';

const geojsonwithlayer = props => {
  const handleOnEachFeature = (feature, layer) => {
    let popupContent = "";
    if (props.popupContent.length) popupContent = props.popupContent;
    else if (feature.properties && feature.properties.g_name) {
      popupContent = feature.properties.g_name;
    }

    layer.bindPopup(popupContent);
    layer.on({
      mouseover: e => {
        layer.openPopup();
      },
      mouseout: e => {
        layer.closePopup();
      }
    });
  };
  console.log(props);
  return <GeoJSON {...props} onEachFeature={handleOnEachFeature} popupContent={props.data[0].properties.g_name} />;
}

export default geojsonwithlayer;