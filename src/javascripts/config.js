export default {
  defaults: {
    mode: 'ALL', // ALL, DISABLED, CUSTOM
    sites: `*://*
!*://*google\\.*
!*://validator.ampproject.org*
!*://*webpagetest.org*
!*://*facebook.com*`,
    panelPosition: [10, 10],
  },
};
