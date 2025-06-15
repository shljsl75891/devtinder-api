import dotenvExtended from 'dotenv-extended';
import 'dotenv/config';

dotenvExtended.load({
  path: '.env',
  defaults: '.env.defaults',
  schema: '.env.example',
  errorOnMissing: true,
  errorOnExtra: true,
});
