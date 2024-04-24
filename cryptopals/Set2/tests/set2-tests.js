const { Buffer } = require('node:buffer');
const {
  AES_CBC_decipher,
  padding_PKCS7
} = require('../set2');
const { printDivider, createCheckTestCase } = require('./../../check-test-case');
const { fsReadFactory } = require('../../fs-read-factory');
const { encryptionOracle, detectionOracle_ECB_CBC } = require('../ecb-cbc-detection');

const func = {
  'Padding PKCS7': padding_PKCS7,
};

const checkSimpleTestCase = createCheckTestCase(func);

function checkSimpleTestCases(data) {
  const testCases = JSON.parse(data);
  testCases.forEach(checkSimpleTestCase);
}

function checkAES_CBC_Mode(data) {
  const key = 'YELLOW SUBMARINE';
  const cipherText = (
    data
      .toString()
      .split('\n')
      .map(str => Buffer.from(str, 'base64')
        .toString('hex'))
      .join('')
  );

  const result = AES_CBC_decipher(key, cipherText, { iv: Buffer.alloc(16) });
  console.log('Deciphering file, encrypted by AES CBC with known key\n');
  console.log(`Key: ${key}\n`);
  console.log('Message:');
  console.log(result);
  printDivider();
}

// function checkDetectionOracle_ECB_CBC(data) {
//   const modeCodes = {
//     'ECB': 0,
//     'CBC': 1
//   };
//   const iterations = 100;
//   let successfulDetections = 0;
//   const message = data.toString('utf-8');

//   for(let i = 0; i < iterations; i++) {
//     const mode = Math.floor(Math.random() * 2);
//     const cipherText = encryptionOracle(message, mode);
//     const detectionResult = detectionOracle_ECB_CBC(cipherText);

//     if (mode === modeCodes[detectionResult]) {
//       successfulDetections++;
//     }
//   }

//   console.log('Detecting if text was encrypted by ECB or CBC\n');
//   console.log(`Detection rate: ${successfulDetections / iterations}\n`);
//   printDivider();
// }

const testsData = [
  {
    func: checkSimpleTestCases,
    path: './set2-test-cases.json'
  },
  {
    func: checkAES_CBC_Mode,
    path: './../data/ecb-ciphers.txt'
  },
  // {
  //   func: checkDetectionOracle_ECB_CBC,
  //   path: './../data/test-text.txt'
  // }
];

const testRunner = testsData.reduceRight((next, test) => {
  return fsReadFactory(test.path, test.func, next);
}, undefined);

printDivider();
testRunner();
