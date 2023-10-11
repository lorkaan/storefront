/**
 * List of dictionary with the following options:
 * 
 * option__name         {String}
 * optionvalue__value    {String}
 * available            {Boolean}
 * defaultoption        {Boolean}
 * 
 */

var form_handler = function(){

    class ValidationError extends Error{
        constructor(message){
            super(message);
        }
    }

    /** Class for indicating an error with the ItemOptionValue validation */
    class ItemOptionValueValidationError extends Error{
        constructor(message){
            super(message);
        }
    }

    class InvalidError extends Error{
        constructor(message){
            super(message);
        }
    }

    /** This is an Parent class for handling Forms that are customized with server
     * side variables (like data from queries)
     * 
     */
    class DataForm{

        static valid_keys = {};

        static validate(data_dict){
            if(!utils.isObject(data_dict)){
                throw new TypeError("Validation can not be done on: " + type(data_dict));
            }
            for(let [key, value] of Object.entries(this.valid_keys)){
                if(utils.isFunction(value)){
                    if(value(data_dict[key])){
                        continue;
                    }else{
                        return false;
                    }
                }else{
                    throw new ValidationError("Not a function: " + key + " -> " + typeof(value));
                }
            }
            return true;
        }

        // Controls the regex for injection into the configs
        static config_injection_regex = /@[\w_]+@/;

        // Configuration of DOM in regards to variable data
        static dom_config = {};

        /** Extracts a Key from a matched regular expression
         * 
         * @param {String} key 
         * @returns {String}
         */
        static extract_injection_key(key){
            if(utils.isString(key, this.config_injection_regex)){
                return key.slice(1, -1);
            }else{
                throw new TypeError("Expected a configuration regex, but got: " + typeof(key) + " -> " + key);
            }
        }

        /** This is the parse_config for doing it from the class
         * 
         * @param {*} value_dict 
         * @param {*} parsed_values 
         * @returns 
         */
        static parse_config_dict(value_dict, parsed_values={}){
            return this._parse_config_dict(this.dom_config, value_dict, parsed_values);
        }

        /** Parse a configuration dictionary with variables to given a dictionary with concrete
         * values. Helper function that takes a config dictionary as well as a value dictionary.
         * 
         * @param {*} config            Configuration Dictionary with variables
         * @param {*} value_dict        Dictionary containing concrete values for variables
         * @param {*} parsed_values     To be left blank, only used for recursion
         * @returns {Array} 2 element array, 
         *                      first element is the concrete dict, 
         *                      second is total set of parsed variables linked to their variable names
         * @throws {TypeError}  If there is a typing problem in configuration or concrete values dictionaries
         */
        static _parse_config_dict(config, value_dict, parsed_values={}){
            if(utils.isObject(config)){
                let ret_dict = {};
                let matches = [];
                let cur_inject = null; // Current Injection in line
                let cur = null; // Current full line
                let match_dict = {};
                for(let [key, value] of Object.entries(config)){
                    if(utils.isString(value)){
                        // Base Case
                        cur = ""; // Reset in case
                        match_dict = {}; // Reset in case
                        matches = value.matchAll(this.config_injection_regex);
                        for(let match of matches){
                            // Save in parsed_values for future parsing
                            if(utils.isNull(parsed_values[match])){
                                cur_inject = value_dict[this.extract_injection_key(match)];
                                if(utils.isString(cur_inject)){
                                    parsed_values[match] = cur_inject;
                                }else{
                                    // cur_inject is not found
                                    throw new TypeError("Injection variable not found " + match);
                                }
                            }else{
                                continue;
                            }
                            // Store in match_dict for efficient replacement
                            if(utils.isBoolean(match_dict[match]) && match_dict[match]){
                                continue;
                            }else{
                                cur = value.replaceAll(match, parsed_values[match]);
                                match_dict[match] = true;
                            }
                        }
                        ret_dict[key] = cur;
                    }else if(utils.isObject(value)){
                        if(value instanceof DataForm){
                            throw new TypeError("Can not work with other form objects yet");
                        }else{
                            // Recursion
                            let [cur, new_parsed] = _parse_config_dict(value, value_dict, parsed_values);
                            parsed_values = new_parsed;
                            ret_dict[key] = cur;
                        }
                    }else if(utils.isSubClass(value, DataForm)){
                        // This is what to do if given a Class and not an object
                        let [cur, new_parsed] = value.parse_config_dict(value_dict, parsed_values);
                        parsed_values = new_parsed;
                        ret_dict[key] = cur;
                    }else{
                        // Not injectable
                        ret_dict[key] = value;
                    }
                    return [ret_dict, parsed_values];
                }
            }else{
                // Not a dictionary
                throw new TypeError("Expected a dictionary for config, instead got " + typeof(config));
            }
        }

        /** Generates a DOM based on the given configuration dictionary
         * 
         * @param {*} config_dict 
         * @returns 
         */
        static generate_dom(config_dict){
            let container = dom_utils.config_create_elem(this.container_config);
            // to do
            let cur_elem = null;
            for(let [key, value] of Object.entries(config_dict)){
                cur_elem = dom_utils.config_create_elem(value);
                container.appendChild(cur_elem);
            }
            return container;
        }

        /** Given some values from a server, creates a form in the dom based
         * on the current configuration
         * 
         * @param {Dictionary} value_dict 
         */
        static create_form(value_dict, parent_elem){
            if(!this.validate_options(value_dict)){
                throw new InvalidError("Can not validate the given server values");
            }
            // Creates a concrete configuration dictionary from the given server values
            let [config, _] = this.parse_config_dict(this.dom_config, value_dict);
            let container_elem = this.generate_dom(config);
            parent_elem.appendChild(container_elem);
        }

    }

    class ItemForm extends DataForm{

        static container_config = {
            tagName: "div"
        };

        static valid_keys = {
            "name": utils.isString,
            "description": utils.isString,
            "price": utils.isPositiveInteger
        };

        static dom_config = {
            name: {
                tagName: "input",
                attributes: {
                    type: "text",
                    name: "name",
                    value: "@name@"
                }
            },
            description: {
                tagName: "input",
                attributes: {
                    type: "textarea",
                    name: "description",
                    value: "@description@"
                }
            },
            price:{
                tagName: "input",
                attributes: {
                    type: "number",
                    name: "price",
                    value: "@price@",
                    min: "0",
                    max: "1000",
                    step: "1"
                }
            }
        };

    }

    /** This class represents a ItemOptionValue passed from the server.
     * 
     * Used for validation and an interface for building the DOM
     */
    class ItemOptionValueForm extends DataForm{

        /** This is the global container to put forms in when rendering */
        static container_config = {
            tagName: "div"
        };

        /** The keys and functions to use for validating data
         * passed from the server
         */
        static valid_keys = {
            "option__name": utils.isString,
            "optionvalue__value": utils.isString,
            "available": utils.isBoolean,
            "defaultoption": utils.isBoolean
        };

        // Configuration of DOM
        static dom_config = {
            option:{
                tagName: "input",
                attributes: {
                    type: "text",
                    name: "@option__name@",
                    value: "@optionvalue__value@"
                }
            },
            defaultoption: {
                tagName: "input",
                attributes:{
                    type: "checkbox",
                    name: "@option__name@.defaultoption",
                    checked: "@defaultoption@"
                }
            },
            available: {
                tagName: "input",
                attributes:{
                    type: "checkbox",
                    name: "@option__name@.available",
                    checked: "@available@"
                }
            }
        };
        
    }

    return {
        "ItemOptionValue": ItemOptionValueForm,
        "Item": ItemForm
    };

}();