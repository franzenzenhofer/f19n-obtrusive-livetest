export default {
  defaults: {
    sites: `*://*
!chrome-extension://*
!chrome-search://*
!*://*google\\.*
!*://validator.ampproject.org*
!*://*webpagetest.org*
!*://*facebook.com*
!*/wp-admin*
!*\\.xml`,
    panelPosition: [10, 10],
  },
};
