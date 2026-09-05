const { execSync } = require('child_process');
try {
  console.log(execSync('npm run build').toString());
} catch (e) {
  console.log(e.stdout.toString());
  console.log(e.stderr.toString());
}
