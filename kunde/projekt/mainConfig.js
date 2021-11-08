const context = process.env.CONTEXT.toLowerCase();
if (context === undefined) {
	console.log('Context not defined, cannot test!');
	process.exit(1);
}
var urls = process.env.URLS.toLowerCase();
if (urls === undefined) {
	console.log('URL set not defined, cannot test!');
	process.exit(1);
}

const basicConfig = require("./basicConfig.js")(context);
var urlConfig = [];
if (urls !== 'random') {
	urlConfig = require("./urls/" + urls + ".js");
} else {
	var count = process.env.COUNT === undefined ? 10 : process.env.COUNT;
	var seed = process.env.SEED === undefined ? 666 : process.env.SEED;
	urlConfig = require("./urls/" + urls + ".js")(count, seed);
	urls = urls + "-" + count + "-" + seed;
}
const scenarios = [];
const viewports = [];

urlConfig.relativeUrls.map(relativeUrl => {
  scenarios.push({
    label: relativeUrl,
    url: `${basicConfig.baseUrl}${relativeUrl}`,
    delay: 3000,
    requireSameDimensions: false,
    puppeteerOffscreenCaptureFix: false,
    misMatchThreshold: 0.5,
    cookiePath: `${basicConfig.cookiePath}`,
    removeSelectors: [],
  });
});

basicConfig.viewports.map(viewport => {
  if (viewport === "phone") {
    pushViewport(viewport, 320, 480);
  }
  if (viewport === "tablet") {
    pushViewport(viewport, 1024, 768);
  }
  if (viewport === "desktop") {
    pushViewport(viewport, 1920, 2000);
  }
});

function pushViewport(viewport, width, height) {
  viewports.push({
    name: viewport,
    width,
    height,
  });
}

module.exports = {
  id: basicConfig.projectId,
  viewports,
  scenarios,
  paths: {
    bitmaps_reference: __dirname + "/backstop_data/tests/" + urls + "/html_report/bitmaps_reference",
    bitmaps_test: __dirname + "/backstop_data/tests/" + urls + "/html_report/bitmaps_test",
    html_report: __dirname + "/backstop_data/tests/" + urls + "/html_report",
    ci_report: __dirname + "/backstop_data/tests/" + urls + "/ci_report"
  },
  report: ["browser"],
  engine: "puppeteer",
  engineOptions: {
    args: ["--no-sandbox"]
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  onBeforeScript: __dirname + "/backstop_data/engine_scripts/puppet/onBefore.js",
  onReadyScript: __dirname + "/backstop_data/engine_scripts/puppet/onReady.js",
};
