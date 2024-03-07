// Create the map
import exifr from './node_modules/exifr/dist/lite.esm.js';
var map = L.map('mapID');
var gpx = "./trail.gpx"

L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  }).addTo(map);


var layer = omnivore.gpx(gpx).on("ready", () => {
  map.fitBounds(layer.getBounds());
}).addTo(map);


var trail = new L.GPX(gpx, {
  async: true,
  polyline_options: {
    color: 'steelblue',
    opacity: 1,
    weight: 5,
    lineCap: 'round'
  },

  marker_options: {
    iconSize: 0,
    shadowSize: 0
  //   startIconUrl: 'images/pin-icon-start.png',
  //   endIconUrl: 'images/pin-icon-end.png',
  //   shadowUrl: 'images/pin-shadow.png'
  }

}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
}).addTo(map);


var image = "./test_location.jpg";
async function load(){
  let {latitude, longitude} = await exifr.gps(image)
  console.log("here");
  // console.log(latitude, longitude);
}
console.log(exifr.gps)
load()
// fs.readFile(image).then(console.log(image))
// window.exifr.parse(image).then(
//   output => {
//     console.log(output);
//     console.log(output.Make, output.Model);
//   }
// );;
// // new ExifImage({image: image}, (data) => {
// //   console.log(data);
// // })
// // console.log(trail.get_name());
// // console.log(trail.get_elevation_max());
