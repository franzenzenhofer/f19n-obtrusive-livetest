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
!*://*webcache.googleusercontent\\.*
!*://validator.ampproject.org*
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
    },
    {
      name: 'google_mobile_friendly_test_key',
      label: 'Google Mobile Friendly Test Key',
    },
    {
      name: 'rate_limited_domains',
      label: 'Rate Limited Domains',
    },
  ],
};
