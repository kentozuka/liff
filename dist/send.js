window.onload = function (e) {
  document.getElementById('send').addEventListener('click', function () {
    const ms = document.getElementById('ms').innerText;
    const json = JSON.parse(ms)
    if (json[5] == "JPY") {
      json.push(json[2])
      sendLine(JSON.stringify(json))
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
          if (xmlhttp.status == 200) {
            const response = JSON.parse(xmlhttp.responseText)
            const rates = response.rates
            json.push(Math.round(json[2] / rates[json[5]] * rates["JPY"]))
            const test = JSON.stringify(json)
            sendLine(`${test[0]},${test[1]},${test[2]},${test[3]},${test[4]},${test[5]},${test[6]}`)
          }
          else if (xmlhttp.status == 400) {
            alert('There was an error 400');
          }
          else {
            alert('something else other than 200 was returned');
          }
        }
      };
      const link = 'https://openexchangerates.org/api/latest.json?app_id=4ef4298eab904caba42d8042ca5af0ef'
      xmlhttp.open("GET", link, true);
      xmlhttp.send();
    }
    function sendLine(content) {
      liff
        .sendMessages([
          {
            type: 'text',
            text: content
          }
        ])
        .then(function () {
          liff.closeWindow();
        })
        .catch(function (error) {
          window.alert('Error sending message: ' + error);
        });
    }
  });
};