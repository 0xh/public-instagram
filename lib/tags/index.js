'use strict';

var
    Axios = require('axios'),
    puppeteer = require('puppeteer');

var
    defaults = require('../defaults');

exports = module.exports = {

    /**
     * Returns information about hashtag
     * @module Tags
     * @param {String} _hashtag
     * @return {Object} info - Information containing name of hashtag and its media count.
     */
    info: async (_hashtag) => {
        try {
            var response = await Axios.get(defaults.URL_INSTAGRAM_EXPLORE_TAGS + _hashtag, {
                params: {
                    __a: 1
                }
            });

            return {
                name: response.data.tag.name,
                count: response.data.tag.media.count
            };
        } catch (error) {
            return error;
        }
    },

    /**
     * Returns array of posts from recent feed of an hashtag
     * @module Tags
     * @param {String} _hashtag
     * @param {Number} _limit
     * @return {Array} Array of the most recent posts that contain the hashtag
     */
    recent: async (_hashtag, _limit) => {

        // Get Query ID
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setRequestInterceptionEnabled(true);
        page.on('request', (request) => {
            if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url)) {
                request.abort();
            } else if (request.url.startsWith('https://www.instagram.com/graphql/query/')) {
                return request.url.split('=')[1].split('&')[0];
            } else {
                request.continue();
            }
        });
        await page.goto('https://www.instagram.com/explore/tags/instagram/');

        // Click on 'more images'
        await page.click('._1cr2e._epyes');

        browser.close();
    }

}