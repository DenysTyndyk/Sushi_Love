'use strict';

function log(component, level, fields) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    component,
    level,
    ...fields
  });
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

module.exports = { log };
