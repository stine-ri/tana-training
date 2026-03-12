module.exports = {
  default: {
    require: [
      'features/step_definitions/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress',                              // shows progress in terminal as tests run
      'html:reports/cucumber-report.html',     // generates HTML report after run
      'json:reports/cucumber-report.json',     // generates JSON (needed by some reporters)
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};