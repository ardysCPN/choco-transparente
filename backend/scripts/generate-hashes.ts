import bcrypt from 'bcryptjs';

const hashAdmin = bcrypt.hashSync('AdminChoco2026!', 10);
const hashTest = bcrypt.hashSync('TestChoco2026!', 10);

console.log('HASH_ADMIN:', hashAdmin);
console.log('HASH_TEST:', hashTest);
