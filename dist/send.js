const kento_line_id = 'Uaa32147adb55676f74c086ef1bebae87';
const yuyu_line_id = 'U113cc56d8318519d565c6a9f04bb1a41';

window.onload = function (e) {
  liff.init(data => {
    const userId = data.context.userId;
    const target = document.getElementById('username')
    if (userId == kento_line_id) {
      target.innerText = 'Kento'
    } else if (userId == yuyu_line_id) {
      target.innerText = 'Yuyu'
    } else {
      target.innerText = 'User'
    }
    });
  document.getElementById('send').addEventListener('click', function () {
    const sendTo = document.getElementById('username').innerText || 'user';
    const ms = document.getElementById('ms').innerText;
    const json = JSON.parse(ms)
    if (json[5] == "JPY") {
      json.push(json[2])
      sendLine(`${sendTo}\n${json[0]}\n${json[1]}\n${json[2]}\n${json[3]}\n${json[4]}\n${json[5]}\n${json[6]}`)
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
          if (xmlhttp.status == 200) {
            const response = JSON.parse(xmlhttp.responseText)
            const rates = response.rates
            json.push(Math.round(json[2] / rates[json[5]] * rates["JPY"]))
            sendLine(`${sendTo}\n${json[0]}\n${json[1]}\n${json[2]}\n${json[3]}\n${json[4]}\n${json[5]}\n${json[6]}`)
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