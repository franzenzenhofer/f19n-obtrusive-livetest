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
  },
};
