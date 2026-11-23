const fs = require('node:fs');
const path = require('node:path');

module.exports = function ({ vars }) {
  const policy = fs.readFileSync(path.join(__dirname, 'hardened-v2.txt'), 'utf8');
  // Serializar evita que comillas o etiquetas de la entrada creen otros roles.
  return JSON.stringify([
    { role: 'system', content: policy },
    { role: 'user', content: String(vars.input) },
  ]);
};
