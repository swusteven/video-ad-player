/*
 * Returns the value of the cookie with a given name. If there is none it returns an empty string
 * See https://stackoverflow.com/a/25490531
 */
function getCookie(name) {
    const value = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
    return value ? value.pop() : '';
}

/**
 * Returns a logger object which logs if the debug cookie is set
 */
export default (function() {

    const COOKIE_NAME = 'rm-debug';

    const inDebugMode = (getCookie(COOKIE_NAME) == 'true');

    return {

        // logs a given message to the console if we are in debug mode
        info: function(message) {
            if (inDebugMode) {
                console.log(`RMJS: ${message}`);
            }
        },

        // logs a given message in yellow as a warning if we are in debug mode
        warn: function(message) {
            if (inDebugMode) {
                console.warn(`RMJS: ${message}`);
            }
        },

        // logs a given message in red as an error if we are in debug mode
        error:  function(message) {
            if (inDebugMode) {
                console.error(`RMJS: ${message}`);
            }
        }
    };
}());