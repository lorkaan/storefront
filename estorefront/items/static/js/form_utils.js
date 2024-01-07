/** Abstracted library for handling forms across multiple pages.
 * 
 * Not currently in use for fear of upsetting prototype.
 * 
 * Last Edit: Tuesday December 5th, 2023
 *  
 */

var form_utils = function(){

    let ext_edge_case_form_set = null;

    /** This is just general extra information that does not
     * fall under a single category. However, generally, it is
     * used to communicate with the server.
     */
    let extra_info = {
        form_name_input_key: "form_name",
        app_id_input_key: "application",
        form_data_server_key: "form_data",
        formData: {
            name_key: "name",
            data_key: "data"
        }
    };

    let classes = {
        hide: "hide",
        show: "show",
        form_input: "form_input",
        tab_selected: "tab_selected",
        next_button: "next_form_button",
        good: "green_highlight"
    };

    // Important Node Names needed for HTML Processing
    let nodeNames = {
        input: "INPUT",
        select: "SELECT",
        option: "OPTION"
    };

    /** Defines what makes an HTMLElement Valid for different uses */
    let validElements = {
        formInput: {
            class: classes.form_input,
            nodeName: [nodeNames.input, nodeNames.select],
            attribute: "name"
        }
    };

    let attrs = {
        nav_tab_id: 'data-id',
        application_id: 'data-appId',
        input_type: "type",
        multiple: "multiple"
    };

    let regex = {
        attr_seperator: "=",
        from_name_joiner: "."
    };

    let ids = {
        body: "body",
        navbar: "event_form_nav_bar",
        form_edit_box: "event_form_box",
        end_of_form: "right_edge_tab"
    };

    let urls = {
        get_form_values: "get_application_data", // Gets values in database
        application_temp: "temporary_app_storage" // Sets values in database

    };

    // Used to as a set of validation functions for HTML Elements
    let validateOptionFunctions = {
        id: function (elem, id) {
            return elem.id == id;
        },
        class: function (elem, cls) {
            return elem.classList.contains(cls);
        },
        nodeName: function (elem, node_name) {
            return elem.nodeName.toLowerCase() == node_name.toLowerCase();
        },
        attribute: function (elem, key) {
            if (typeof (key) == 'string' && key.length > 0) {
                let attr_key = null;
                let attr_val = null;
                let attr_list = key.split(regex.attr_seperator, 2);
                // attr_list can not have length 0 because of key empty string check
                if (attr_list[0].length > 0) {
                    attr_key = attr_list[0];
                }
                if (attr_list.length > 1 && attr_list[1].length > 0) {
                    if (attr_key) {
                        attr_val = attr_list[1];
                    } else {
                        attr_key = attr_list[1];
                    }
                }
                let cur_val = elem.getAttribute(attr_key);
                if (attr_val == null && cur_val != null) {
                    return true;
                } else {
                    return cur_val == attr_val;
                }
            } else {
                throw new TypeError("Expected string as Attribute, but got " + typeof (attr_key));
            }
        }
    }

    /** Validates an HTML Element against some given options.
     * Validation functions are defined in validateOptionFunctions dictionary.
     * Keys in the validateOptionFunctions are used as control for the options
     * 
     * @param {*} elem      HTML Element to validate
     * @param {*} options   Options to validate against
     * @returns 
     */
    function validateHtmlElement(elem, options = {}) {
        if (elem instanceof HTMLElement) {
            if (typeof (options) == 'object' && options != null) {
                let validateKeys = Object.keys(validateOptionFunctions);
                let option_keys = Object.keys(options);
                if (option_keys.length > 0 && validateKeys.length > 0) {
                    for (let i = 0; i < validateKeys.length; i++) {
                        let cur = options[validateKeys[i]];
                        if (cur) {
                            let validFunc = validateOptionFunctions[validateKeys[i]];
                            if (typeof (validFunc) == 'function') {
                                if (Array.isArray(cur)) {
                                    let found = false;
                                    for (let j = 0; j < cur.length; j++) {
                                        if (validFunc(elem, cur[j])) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (found) {
                                        continue;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    if (!validFunc(elem, cur)) {
                                        return false;
                                    }
                                }
                            } else {
                                throw new TypeError("Expected a function, but got " + typeof (validFunc));
                            }
                        } else {
                            continue;
                        }
                    }
                    return true;
                } else {
                    // No additional validation provided
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    function createNavBarSelector(data_id) {
        return 'span[data-id="' + data_id + '"]';
    }

    function createNameValue(key, value){
        return key + regex.from_name_joiner + value;
    }

    function createFormInputSelector(parent_id, key, name) {
        return '#' + parent_id + ' [name="' + createNameValue(key, name) + '"]';
    }

    /** Used to handle edge cases cleanly */
    function handleSettingFormData(elem, val){
        if(elem.nodeName == nodeNames.select && !Array.isArray(val)){
            for(let i = 0; i < elem.options.length; i++){
                if(typeof(elem.options[i].value) == 'number' && elem.options[i].value == parseInt(val)){
                    // Select that child
                    elem.options[i].setAttribute("selected", "true");
                    break;
                }else if(typeof(elem.options[i].value) == 'string' && elem.options[i].value.length > 0
                && typeof(val) == 'string' && val.length == elem.options[i].value.length
                && elem.options[i].value == val){
                    elem.options[i].setAttribute("selected", "true");
                    break;
                }else{
                    continue;
                }
            }
        }else if(typeof(ext_edge_case_form_set) == 'function' && Array.isArray(val) && val.length > 0){
            ext_edge_case_form_set(elem, val);  // Really only for handling that array input
        }else{
            let input_type = elem.getAttribute("type");
            if(typeof(input_type) == 'string' && input_type.length > 0){
                if(input_type == 'checkbox'){
                    if(val){
                        elem.checked = val;
                    }
                }else{
                    // Default case
                    elem.setAttribute('value', val);
                }
            }
        }
    }

    /** Processes Form Values from the structure they have in the Django Server
     * into input in the relevant form_input objects
     * 
     * @param {*} form_id 
     * @param {*} data 
     */
    function processFormValuesFromServer(form_id, data){
        try{
            data = JSON.parse(data);
        }catch{
            throw new TypeError("Can not parse JSON");
        }
        if(typeof(data) == 'object' && data != null){
            let elem = document.getElementById(form_id);
            if(elem){
                let cur_selector = null;
                let cur_elem = null;
                for(let [key, value] of Object.entries(data)){
                    console.log(value);
                    for(let [key2, value2] of Object.entries(value)){
                        console.log(key2 + ": " + value2);
                        cur_selector = createFormInputSelector(form_id, key, key2);
                        console.log(cur_selector);
                        cur_elem = document.querySelector(cur_selector);
                        console.log(cur_elem);
                        if(cur_elem){
                            handleSettingFormData(cur_elem, value2);
                        }
                    }
                }
            }
        }
    }

    /** Sets the Form Values based on ApplicationData held by the Django Server
     * 
     * @returns 
     */
    function setFormValues(){
        let elem = document.getElementById(ids.form_edit_box);
        if(elem){
            let app_id_data = {}
            app_id_data[extra_info.app_id_input_key] = elem.getAttribute(attrs.application_id);
            return utils.post(urls.get_form_values, app_id_data)
            .catch(function (err) {
                console.error(err);   // Need better error handling
            })
            .then(function(jsonData){
                let data_list = jsonData[extra_info.form_data_server_key];
                if(Array.isArray(data_list) && data_list.length > 0){
                    data_list.forEach(function(data){
                        if(typeof(data) == 'object' && data != null 
                        && typeof(data[extra_info.formData.name_key]) == 'string' 
                        && data[extra_info.formData.data_key].length > 0){
                            processFormValuesFromServer(data[extra_info.formData.name_key], data[extra_info.formData.data_key])
                        }
                    });
                }
            });
        }else{
            throw new Error("Can not get find elem to fill with data");
        }
    }

    function handleGetEdgeCases(elem){
        if(elem instanceof HTMLElement && elem.nodeName == nodeNames.input && elem.getAttribute(attrs.input_type) == "checkbox"){
            // checkbox get
            return elem.checked;
        }else if(elem instanceof HTMLElement && elem.nodeName == nodeNames.select && elem.getAttribute(attrs.multiple)){
            let options = elem.selectedOptions;
            let ret_array = [];
            for(let i = 0; i < options.length; i++){
                ret_array.push(options[i].value);
            }
            return ret_array;
        }else{
            return elem.value;
        }
    }

    /** Creates a Dictionary of representing named elements for forms 
     * Used for collecting form data and submitting to Django without 
     * triggering a page reload or perform some actions in the background.
     * 
    */
    function createFormDict(form_id, validateOptions = {}) {
        let form_dict = {};
        let form_elem = document.getElementById(form_id);
        if (form_elem) {
            let form_elements = form_elem.elements;
            if (form_elements && form_elements.length > 0) {
                let input_names = [];
                for (let i = 0; i < form_elements.length; i++) {
                    if (validateHtmlElement(form_elements[i], validateOptions)) { // Is this necessary??
                        if (typeof (form_elements[i].name) == 'string' && form_elements[i].name.length > 0) {
                            input_names.push(form_elements[i].name);
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
                input_names.forEach(function (name) {
                    // Always in order? Seems to be.
                    let value = form_elements[name]; // actually gets an HTMLElement
                    if (value instanceof NodeList) {
                        if (value.length > 0) {
                            let multi_value = [];
                            for (let i = 0; i < value.length; i++) {
                                if (typeof (value[i].value) == 'string' && value[i].value.length > 0) {
                                    multi_value.push(value[i].value);
                                }
                            }
                            form_dict[name] = multi_value;
                        } else {
                            // It is a list but it is empty
                        }
                    } else {
                        if (form_dict[name] == null) {
                            form_dict[name] = handleGetEdgeCases(value);
                            //form_dict[name] = value.value;
                        } else if (Array.isArray(form_dict[name])) {
                            form_dict[name].push(value.value);
                        } else {
                            let multi_value = []
                            multi_value.push(form_dict[name]);
                            multi_value.push(value.value);
                            form_dict[name] = multi_value;
                        }
                    }
                });
            }
        }
        return form_dict;
    }

    /** Stores Form Data temporarily.
     * 
     * @param {HTMLElement} form_body_div The Div holding the Form
     * @returns Promise holding the JSON Data returned by Django
     */
    function storeFormData(form_body_div) {
        if (!(form_body_div instanceof HTMLElement)) {
            throw new TypeError("Expected an HTMLElement, but got: " + typeof (form_body_div));
        }
        let cur_form = null;
        for (let i = 0; i < form_body_div.children.length; i++) {
            if (validateHtmlElement(form_body_div.children[i])) {
                cur_form = form_body_div.children[i];
                break;
            } else {
                continue;
            }
        }
        if (cur_form != null) {
            // Current Form is found
            let formData = createFormDict(cur_form.id, validElements.formInput)
            formData[extra_info.form_name_input_key] = form_body_div.id;
            let formEditBox = document.getElementById(ids.form_edit_box);
            if (formEditBox instanceof HTMLElement) {
                formData[extra_info.app_id_input_key] = formEditBox.getAttribute(attrs.application_id);
            } else {
                formData[extra_info.app_id_input_key] = null;
            }
            return utils.post(urls.application_temp, formData)
            .catch(function (err) {
                console.error(err);   // Need better error handling
            })
            .then(function(jsonData){
                console.log(jsonData);
            });
        } else {
            throw Error("Can not find the form to save");
        }
    }

    function review_nav_check(){
        let elems = document.getElementsByClassName(classes.tab_selected);
        for(let i = 0; i < elems.length; i++){
            elems[i].classList.add(classes.good);
        }
    }

    function nextFormHandler(ev) {
        let div_form_body = ev.currentTarget.parentElement;
        storeFormData(div_form_body)
        .then((jsonData) => {
            let nav_elem = document.querySelector(createNavBarSelector(div_form_body.id));
            if (nav_elem) {
                let next_nav_elem = nav_elem.nextElementSibling;
                if (next_nav_elem) {
                    next_nav_elem.classList.add(classes.tab_selected);
                    if(next_nav_elem.id == ids.end_of_form){
                        review_nav_check();
                    }
                    let next_form_body = document.getElementById(next_nav_elem.getAttribute(attrs.nav_tab_id));
                    if (next_form_body) {
                        div_form_body.classList.add("hide");
                        div_form_body.classList.remove("show");
                        next_form_body.classList.remove("hide");
                        next_form_body.classList.add("show");
                    }
                }
            }
        });
    }

        /** Sets up the next button on the Forms
     * 
     * This is to group questions together in a cohesive manner
     * and prevent question overload from the user.
     * 
     * To Do:
     *      Store the current form answers NOT in the main database
     *      in order to save the user's state and allow them to continue
     * 
     *      Requires User Models to work
     */
    function setupNextButton() {
        let elems = document.getElementsByClassName(classes.next_button);
        for (let i = 0; i < elems.length; i++) {
            elems[i].addEventListener('click', function (ev) {
                // Add the code to save the current form details

                // UI Stuff Only
                //nextButtonHandler(ev);
                nextFormHandler(ev);
            });
        }
    }

    /** Sets up all the form activity for a Form Page
     * Used to generalize the forms into a single set of operations
     * for code reability/size.
     * 
     * @param {Function} extra_setup_func   This is a function used to setup page specific things
     *                                      If it is a function, it is run with 0 arguments,
     *                                      Otherwise, it is ignored.
     */
    function setupForms(extra_setup_func=null, strange_input_handler=null){
        if(typeof(strange_input_handler) == 'function'){
            ext_edge_case_form_set = strange_input_handler;
        }
        setupNextButton();
        if(typeof(extra_setup_func) == 'function'){
            Promise.resolve(extra_setup_func())
            .then(() => {
                setFormValues();
            })
            .catch((err) =>{
                console.error(err);
            });
        }else{
            // Do this Last
            setFormValues()
            .catch((err) =>{
                console.error(err);
            });
        }
    }

    return {
        'setupForms': setupForms
    }

}();