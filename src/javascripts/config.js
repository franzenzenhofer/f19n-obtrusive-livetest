export default {
  defaults: {
    sites: `*://*
!chrome-extension://*
!chrome-search://*
!chrome://*
!chrome-devtools://*
!devtools://*
!about:*
!blob:*
!file:*
!data:*
!*://*google\\.*
!https://*.web.dev*
!*://*webcache.googleusercontent\\.*
!*://validator.ampproject.org*
!*://validator.schema.org*
!*://*webpagetest.org*
!*://*facebook.com*
!*://*stackoverflow.com*
!*/wp-admin*
!*\\.xml
!*\\.pdf
!undefined
`,
    panelPosition: [10, 10],
    globalRuleVariables: {},
  },

  availableGlobalRuleVariables: [
    {
      name: 'google_page_speed_insights_key',
      label: 'Google Page Speed Insights Key',
      url: 'https://developers.google.com/speed/docs/insights/v5/get-started#key',
      msg: '',
    },
    {
      name: 'google_mobile_friendly_test_key',
      label: 'Google Mobile Friendly Test Key',
      url: 'https://developers.google.com/webmaster-tools/search-console-api/v1/configure',
      msg: '',
    },
    {
      name: 'rate_limited_domains',
      label: 'Rate Limited Domains',
      url: '',
      msg: "On domains with these strings tests that fire a lot of GET requests won't be executed. Format: example,test.org,whatever.tld",
    },
  ],
};
