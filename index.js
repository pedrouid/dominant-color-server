const http = require("http");
const Vibrant = require("node-vibrant");

function getParams(req) {
  let q = req.url.split("?"),
    result = {};
  if (q.length >= 2) {
    q[1].split("&").forEach(item => {
      try {
        result[item.split("=")[0]] = item.split("=")[1];
      } catch (e) {
        result[item.split("=")[0]] = "";
      }
    });
  }
  return result;
}

function getDominantColor(imgSrc) {
  let v = new Vibrant(imgSrc);
  return new Promise((resolve, reject) => {
    v.getPalette()
      .then(pallete => {
        let current = 0;
        let dominantColor = null;
        // console.log("pallete", pallete);
        const keys = Object.keys(pallete);
        // console.log("keys", keys);
        keys.forEach(key => {
          const color = pallete[key];
          // console.log("color", color);
          if (color.population > current) {
            current = color.population;
            dominantColor = color.rgb;
          }
        });
        const result = {
          dominantColor: dominantColor
            ? "rgb(" +
              dominantColor[0] +
              "," +
              dominantColor[1] +
              "," +
              dominantColor[2] +
              ")"
            : null
        };
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

const server = http.createServer(function(req, res) {
  const params = getParams(req);

  if (params.imgSrc) {
    getDominantColor(params.imgSrc)
      .then(result => {
        if (result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error: failed to find dominant color");
        }
      })
      .catch(error => {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error: something went wrong");
      });
  } else {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end('Error: missing required query parameter "imgSrc"');
  }
});

const port = Number(process.env.PORT) || 5000;
server.listen(port, error => {
  if (error) {
    return console.log("Something went wrong", error);
  }

  console.log("Server listening on port", port);
});
