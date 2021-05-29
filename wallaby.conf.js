module.exports = function ( w ) {
  process.env.NODE_ENV = 'test';
  return {
    compilers: {
      '**/*.ts?(x)': w.compilers.typeScript({ /* isolatedModules: true, */ module:'commonjs' })
    },
    files: [
      'src/{,**/}*.js',
      'src/{,**/}*.json',
      'src/{,**/}*.ts',
      { pattern: 'src/{,**/}*.test.ts', ignore: true },
      { pattern: 'wallaby.conf.ts', ignore: true, instrument:false },
    ],
    tests: [
      'src/{,**/}*.test.ts',
    ],
    env: {
      type: 'node'
    },
    // testFramework: 'mocha',
    runMode: 'onsave',
    hints: {
      ignoreCoverage: /istanbul ignore next/
    },
  };
};
