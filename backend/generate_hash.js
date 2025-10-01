import bcrypt from 'bcryptjs';

const password = 'password';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Password hash for "password":');
    console.log(hash);
  }
});