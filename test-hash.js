const bcrypt = require('bcryptjs');

const password = 'Benjyl0ven0v@';
const hash = bcrypt.hashSync(password, 10);

console.log('Generated hash:', hash);
console.log('Compare result:', bcrypt.compareSync(password, hash));
