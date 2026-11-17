import { buildSync } from 'esbuild';

buildSync({
  entryPoints: ['src/access/app.ts'],
  bundle: true,
  minify: true,
  target: 'es2022',
  outfile: 'public/access/app.js',
});
