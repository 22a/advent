const day = process.argv[2];
if (!day) {
  console.error('Please provide a day number');
  process.exit(1);
}

import(`../${day}/index.ts`).catch((error) => {
  console.error('Error loading module:', error);
  process.exit(1);
});
