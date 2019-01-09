const gender = require('gender-detection');

let g;

// Use it to detect the gender:
g = gender.detect('Robert');
console.log({g})