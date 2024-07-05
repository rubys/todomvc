let ws = null;
let interval = null;

function openws() {
  if (ws) return;

  const url = window.location.protocol.replace('http', 'ws') +
    '//' + window.location.host + '/websocket';

  ws = new WebSocket(url);

  ws.onopen = () => {
    if (interval) {
      clearInterval(interval)
      interval = null
      console.log('reconnected')
    }
  }

  ws.onerror = error => {
    console.error(error);
    if (!interval) interval = setInterval(openws, 500);
  }

  ws.onclose = () => {
    if (!interval) interval = setInterval(openws, 5000);
  }

  ws.onmessage = event => {
    // pause updates if user is entering text
    let editing = [...document.querySelectorAll('input')]
      .some(input => input.type == 'text' && input.clientWidth && input.value);

    if (!editing && event.data != document.body.dataset.timestamp) {
      window.location.reload()
    }
  }
};

document.addEventListener('DOMContentLoaded', openws);
