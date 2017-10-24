export default {
  defaults: {
    sites: `*://*
!chrome-extension://*
!chrome-search://*
!chrome://*
!about:*
!blob:*
!file:*
!data:*
!*://*google\\.*
!*://validator.ampproject.org*
!*://*webpagetest.org*
!*://*facebook.com*
!*/wp-admin*
!*\\.xml
!*\\.pdf`,
    panelPosition: [10, 10],
  },
};
