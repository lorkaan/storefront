

var dom_utils = function(){

    class DOMError extends Error{
        constructor(message){
            super(message);
        }
    }

    /** A Dictionary for handling dom creation via configurations */
    let dom_create_config = {
        tagName: {
            valid: utils.isString,
            default: ""
        },
        id: {
            valid: utils.isString,
            default: ""
        },
        classList: {
            valid: utils.isArray,
            default: []
        },
        attributes: {
            valid: utils.isObject,
            default: {}
        },
        events: {
            valid: utils.isObject,
            default: {}
        }
    };

    /** Creates a DOM element from a configuration dictionary.
     * 
     * @param {*} dict 
     * @returns 
     */
    function create_elem_from_config(dict){
        let full_config = {};
        for(let [key, value] of Object.entries(this.dom_create_config)){
            if(utils.isNull(dict[key])){
                full_config[key] = value.default;
            }else{
                if(value.valid(dict[key])){
                    full_config[key] = dict[key];
                }else{
                    full_config[key] = value.default;
                }
            }
        }
        return this.create_element(full_config.tagName, full_config.id, full_config.classList, full_config.attributes, full_config.events);
    }

    /** Creates a DOM Element
     * 
     * @param {String} tagName      The Tag Name of the element to create
     * @param {String} id           The id to give the element
     * @param {Array} classList     A List of classes to give the element
     * @param {Dict} attributes     A dictionary of attributes to give the element
     * @param {Dict} events         A dictionary of events {trigger: function} to give to the element
     * 
     * @returns {DOMElement}        Returns a DOMElement creates from the passed parameters
     * @throws  {DOMError}          A DOMError that is thrown if there is an issue creating the dom element with tagname
     */
    function create_element(tagName, id, classList=[], attributes={}, events={}){
        if(utils.isString(tagName)){
            let elem = document.createElement(tagName);
            if(utils.isString(id)){
                elem.id = id;
            }
            for(let i = 0; i < classList.length; i++){
                if(utils.isString(elem)){
                    elem.classList.add(classList[i]);
                }else{
                    continue
                }
            }
            for(let [key, value] of Object.entries(attributes)){
                elem.setAttribute(key, value);
            }
            for(let [key, value] of Object.entries(events)){
                if(utils.isFunction(value)){
                    elem.addEventListener(key, value);
                }else{
                    continue;
                }
            }
            return elem;
        }else{
            throw new DOMError("Can not create element with tag: " + elem);
        }
    }


    return {
        "DOMError": DOMError,
        "create_element": create_element,
        "config_create_elem": create_elem_from_config
    }
}();