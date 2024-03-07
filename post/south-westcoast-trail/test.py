import gpxpy
import os


def main(gpxFilename, htmlFilename) -> None:
    track: list = load_track(gpxFilename)
    if track != None and len(track) > 0:
        generate_html(track, htmlFilename)
        print("Done generating html page: ", htmlFilename)


def load_track(filename: str) -> list:
    trackPoints: list = []
    if os.path.exists(filename) == False:
        print(f"File not found: {filename}")
        return
    gpx_file = open(filename)
    try:
        gpx = gpxpy.parse(gpx_file)
        for track in gpx.tracks:
            for segment in track.segments:
                for point in segment.points:
                    trackPoints.append([float(point.latitude), float(point.longitude)])
    except Exception as error:
        print(f"\nParsing file '{filename}' failed. Error: {error}")
    gpx_file.close()
    return trackPoints


def generate_html(track: list, file_out: str) -> None:
    """Generates a new html file with points"""
    template = """
    <html><head>
    <link rel="stylesheet" href="./leaflet.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
<script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js'></script>

  <style type="text/css">
  #mapId {
    position: absolute;
    top: 0px;
    width: 100%;
    left: 0px;
    height: 400px;
  }
</style>
</head>
<body>
  <div id="mapId"></div>
  <script>
    var myMap = L.map('mapId');
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 256,
        zoomOffset: -1
      }).addTo(myMap);
    var gpx = "./trail.gpx";
    var layer = omnivore.gpx(gpx).on("ready", () => {
    myMap.fitBounds(layer.getBounds());
    }).addTo(myMap);

  </script>
</body></html>
    """
    # track_points = ",".join(
    #     [f"[{g_track_point[0]}, {g_track_point[1]}, 0.1]" for g_track_point in track]
    # )
    # track_points = f"var track=[{track_points}];"
    # template = template.replace("var track = [];", track_points)
    # f = open(file_out, "w")
    # f.write(template)
    # f.close()


if __name__ == "__main__":
    main("trail.gpx", "myTrack.html")
