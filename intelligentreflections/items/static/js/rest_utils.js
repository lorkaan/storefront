var restutils = function(){

    let cookie_key = {
        csrf_token: "csrftoken"
    };

    let regex = {
        attr_seperator: "=",
        cookie_seperator: ";"
    };

    /** Helper function to retrieve cookies. 
     * (Mostly used for getting the csrftoken cookie in order to
     * submit POST fetches to Django without page reload)
     * 
     * @param {str/Array} name The optional name of the cookie to get
     * @returns {null/str/Array}    if name is string, returns string,
     *                              if name is array, returns array of strings
     *                              if can not find the cookie, returns null
     */
    function getCookies(name = null) {
        let cookieArray = document.cookie.split(regex.cookie_seperator);
        let cur_cookie = null;
        if (typeof (name) == 'string' && name.length > 0) {
            for (let i = 0; i < cookieArray.length; i++) {
                cur_cookie = cookieArray[i].split(regex.attr_seperator);
                if (cur_cookie[0] == name) {
                    return cur_cookie[1];
                }
            }
            return null;
        } else if (Array.isArray(name) && name.length > 0) {
            let ret_dict = {};
            let check_cookie_names = [];
            for (let i = 0; i < cookieArray.length; i++) {
                cur_cookie = cookieArray[i].split(regex.attr_seperator);
                if (name.includes(cur_cookie[0])) {
                    ret_dict[cur_cookie[0]] = cur_cookie[1];
                    check_cookie_names.push(cur_cookie[0]);
                    if (check_cookie_names.length == name.length) {
                        break;
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
            return ret_array;
        } else {
            let ret_dict = {};
            for (let i = 0; i < cookieArray.length; i++) {
                cur_cookie = cookieArray[i].split(regex.attr_seperator);
                ret_dict[cur_cookie[0]] = cur_cookie[1];
            }
            return ret_array;
        }
    }

    /** Asynchronous form submission to a URL existing independently
     * of default form submission behaviour. Used to send data to
     * Django without doing page reloads or in the background. 
     * 
     * Depends on the function createFormDict(...) to collect form data
     * before passing the resulting dictionary to the data parameter.
     * 
     * Utilizes the getCookie() function to get CRSF Token to protect
     * against Cross Site Request Forgery
     * 
     * Assumes there is a crsftoken cookie, data parameter is JSON compliant
     * and that POST is the desired HTTP Request method
     * 
     * @param {str} url     The place to submit the form
     * @param {dict} data   The dictionary representing the form to submit
     * @returns Promize with the data returned from the server.
     */
    function send_form(url, data = {}) {
        let crsf_token = getCookies(cookie_key.csrf_token);
        if (typeof (crsf_token) == 'string' && crsf_token.length > 0) {
            return fetch(url, {
                method: "POST",
                mode: 'cors',
                cache: "no-cache",
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': crsf_token
                },
                body: JSON.stringify(data)
            })
                .then(function (response) {
                    if (response) {
                        if (!response.ok || response.status != 200) {
                            throw new Error("Issue with sending from " + response.url + "   Status:" + response.status);
                        }
                        return response.json(); // Assumes JSON Response
                    } else {
                        throw new Error("Did not get a response from " + url);
                    }
                });
        } else {
            throw new TypeError("crsf token could not be retrieved");
        }

    }

    return {
        'post': send_form
    }
}();