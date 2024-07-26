import QueryString from '../models/QueryString.js';
import Logger from '../modules/Logger.js';

/**
 * Represents an immutable type that can contain the location
 * of a resource on a remote server or even on disk
 */
export default class URL {

    constructor(path) {
        this.endpoint = path;

        const match = this.endpoint.match(/\?([~(),-\w=&%.!']*)/);
        let queryString = '';
        if (match && match.length > 1) {
            queryString = match[1];
        }
        this.qs = new QueryString(queryString);
    }

    /**
     * Creates a URL from a host and query string
     * @param  {string} host
     * @param  {string|object} queryString
     * @return {URL}
     */
    static createEndpoint(host, queryString = '') {
        let qs = queryString;
        if (typeof queryString === 'object') {
            qs = '';
            for (const param of Object.keys(queryString)) {
                if (qs.length) {
                    qs += '&';
                }
                qs += `${encodeURIComponent(param)}=${encodeURIComponent(queryString[param])}`;
            }
        }
        const path = `${host}?${qs}`;
        return new URL(path);
    }

    get host() {
        const match = this.endpoint.match(/(https?:\/\/)?([-\w.]+)([\/\w]*)?/);
        if (match && match.length > 2) {
            return match[2];
        }
        return '';
    }

    get scheme() {
        const match = this.endpoint.match(/^(https?):\/\//);
        if (match && match.length > 1) {
            return match[1];
        }
        return 'http';
    }

    get path() {
        const match = this.endpoint.match(/(https?:\/\/)?[\w.]+(\/[\/\w-]+)/);
        if (match && match.length > 2) {
            return match[2];
        }
        return '';
    }

    get queryString() {
        return this.qs.formatString();
    }

    get fragment() {
        const match = this.endpoint.match(/#(\w+)/);
        if (match && match.length > 1) {
            return match[1];
        }
        return '';
    }

    get absolutePath() {
        return `${this.scheme}:${this.relativePath}`;
    }

    get relativePath() {
        let urlPath = `//${this.host}${this.path}`;
        if (this.qs.formatString()) {
            urlPath += `?${this.qs.formatString()}`;
        }
        if (this.fragment) {
            urlPath += `#${this.fragment}`;
        }
        return urlPath;
    }

    /**
     * Adds a query string key-value pair to a url
     * @param {string} key
     * @param {string} value
     * @returns {URL}
     */
    addQueryStringParameter(key, value) {
        this.qs.add(key,value);
        const absolutePath = `${this.scheme}://${this.host}${this.path}?${this.qs.formatString()}#${this.fragment}`;
        return new URL(absolutePath);
    }

    /**
     * Removes a query string key-value pair to a url
     * @param  {string} key
     * @return {URL}
     */
    removeQueryStringParameter(key) {
        this.qs.remove(key);
        const absolutePath = `${this.scheme}://${this.host}${this.path}?${this.qs.formatString()}#${this.fragment}`;
        return new URL(absolutePath);
    }

    /**
     * Gets the value of a query string parameter
     * @param  {string} key
     * @return {string}
     */
    getQueryStringParameter(key) {
        return this.qs.get(key);
    }

    /**
     * Adds a random generated value for cache busting/jsonp purposes
     * @param {string} param
     * @returns {url}
     */
    addRandomParameter(param, prefix = '') {
        const random = (Math.random() * 1000).toFixed(0);
        return this.addQueryStringParameter(param, `${prefix}${random}`);
    }

    /**
     * Drops a beacon
     */
    drop() {
        Logger.info(`Dropped Beacon: ${this.relativePath}`);
        navigator.sendBeacon(this.endpoint);
    }
}