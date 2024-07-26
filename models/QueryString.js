/**
 * A representation of a query string
 */
export default class QueryString {

    /**
     * Creates a query string representation
     * @param  {string} queryString
     */
    constructor(queryString = '') {

        this.qs = {};
        const pairs = queryString.split('&').filter((val) => val);
        for (const pair of pairs) {
            const keyValue = pair.split('=');
            this.qs[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }
    }

    /**
     * Adds/Overwrites a key-value pair to the query string
     * @param {string} key
     * @param {string} value
     */
    add(key, value) {
        this.qs[key] = value;
    }

    /**
     * Gets the value for a query string key
     * @param  {string} key
     * @return {string}
     */
    get(key) {
        return this.qs[key];
    }

    /**
     * Removes the key value pair from the query string parameter if it exists
     * @param  {string} key
     */
    remove(key) {
        delete this.qs[key];
    }

    /**
     * Formats the query string to be included in a url
     * @return {string}
     */
    formatString() {
        let queryString = '';
        for (const key of Object.keys(this.qs)) {
            if (queryString.length) {
                queryString += '&';
            }
            queryString += `${encodeURIComponent(key)}=${encodeURIComponent(this.qs[key])}`;
        }
        return queryString;
    }
}