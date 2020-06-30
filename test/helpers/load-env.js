const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'travis') {
  dotenv.config({ path: `${__dirname}/../../.env-test` });
}
