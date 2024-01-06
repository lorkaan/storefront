var edit_form_manager = function(){

    let id_type_name_sep = ".";  // This separates an identifier from a type

    let option_submit_class = "options_submit";
    let item_display_id = "item_display";

    let input_option_class = "option_input";

    let display_to_edit_class = "switch_edit";
    let edit_to_display_class = "switch_display";

    let options_label_class = "options_label";

    let elem_attrs = {
        edit_container: {
            selector: 'div[id$="_edit.container]"',
        },
        edit_form: {
            selector: 'form[id$="_edit.form]"',
        },
        edit_name: {
            selector: 'input[name$="_edit.name"]',
        },
        edit_available: {
            selector: 'input[name$="_edit.available"]',
        },
        edit_default: {
            selector: 'input[name$="_edit.default"]',
        }
    };

    function getElemValue(elem){
        return elem.value;
    }

    function getElemChecked(elem){
        return elem.checked;
    }

    let get_option_form_data = {
        "name": getElemValue,
        "available": getElemChecked,
        "default": getElemChecked
    }

    function retrieve_suffix(val, sep="", squash_error_flag=false){
        if(utils.isString(val)){
            let text_list = val.split(sep);
            if(utils.isArray(text_list, 1)){
                return text_list[(text_list.length-1)];
            }else{
                return val;
            }
        }else{
            if(utils.toBoolean(squash_error_flag)){
                return null;
            }else{
                throw new TypeError("Can not retrieve suffix for non-string: " + typeof(val));
            }
        }
    }

    function retrieve_prefix(name, sep=""){
        if(utils.isString(name)){
            let text_list = name.split(sep);
            if(utils.isArray(text_list)){
                return text_list[0];
            }else{
                throw new TypeError("Can not separate prefix");
            }
        }else{
            throw new TypeError("Can not retrieve prefix for non-string: " + typeof(name));
        }
    }

    class ChangeValueHandler{

        static validate(value){
            return (utils.isString(value) || utils.isPositiveInteger(value) || utils.isBoolean(value));
        }

        constructor(){
            this.values = {};
        }

        addChange(key, value){
            if(utils.isString(key)){
                if(this.constructor.validate(value)){
                    if(utils.isNull(this.values[key])){
                        this.values[key] = value;
                    }else{
                        throw new TypeError("Attempted to add a change that already exists");
                    }
                }else{
                    throw new TypeError("Can not validate the value: " + typeof(value) + ", " + value);
                }
            }else{
                throw new TypeError("Can not validate key: " + typeof(key) + ", " + key);
            }
        }

        clear(){
            this.values = {};
        }

        get_iteratable(){
            return Object.entries(this.values);
        }

        get(key){
            if(utils.isString(key)){
                return this.values[key];
            }else{
                throw new TypeError("Can not validate key: " + typeof(key) + ", " + key);
            }
        }
    }

    function change_item_values(changed_values, display_parent){
        if(!utils.isObject(display_parent, HTMLElement)){
            throw new TypeError("Expected HTMLElement, but got: " + typeof(display_parent) + ", " + display_parent);
        }
        if(!utils.isObject(changed_values, ChangeValueHandler)){
            throw new TypeError("Expected ChangedValueHandler, but got: " + typeof(changed_values) + ", " + changed_values);
        }
        let cur_key = null;
        let cur_val = null;
        for(let i = 0; i < display_parent.children.length; i++){
            if(utils.isObject(display_parent.children[i], HTMLElement)){
                cur_key = retrieve_suffix(display_parent.children[i].getAttribute("name"), id_type_name_sep, true);
                if(utils.isString(cur_key)){
                    cur_val = changed_values.get(cur_key);
                    if(!utils.isNull(cur_val)){
                        display_parent.children[i].innerHTML = cur_val;
                    }
                }
            }else{
                continue;
            }
        }
    }

    function onclick_disabled(ev){
        this.checked = false;
    }

    function handle_default(elem, default_value){
        let option_name = elem.getAttribute("name");
        let elem_list = document.querySelectorAll("."+ input_option_class +"." + option_name);
        for(let i = 0; i < elem_list.length; i++){
            if(utils.isObject(elem_list[i], HTMLElement) && elem_list[i].nodeName == "INPUT"){
                elem_list[i].setAttribute("data-default", false);
            }
        }
        if(utils.isBoolean(default_value)){
            elem.setAttribute("data-default", true);
        }
    }

    function change_option_values(changed_values, display_parent){
        if(!utils.isObject(display_parent, HTMLElement)){
            throw new TypeError("Expected HTMLElement, but got: " + typeof(display_parent) + ", " + display_parent);
        }
        if(!utils.isObject(changed_values, ChangeValueHandler)){
            throw new TypeError("Expected ChangedValueHandler, but got: " + typeof(changed_values) + ", " + changed_values);
        }
        for(let i = 0; i < display_parent.children.length; i++){
            if(utils.isObject(display_parent.children[i], HTMLElement)){
                if(display_parent.children[i].nodeName == "LABEL"){
                    display_parent.children[i].innerHTML = changed_values.get("name");
                    if(utils.toBoolean(changed_values.get("available"))){
                        display_parent.children[i].classList.remove("disabled");
                    }else{
                        display_parent.children[i].classList.add("disabled");
                    }
                }else if(display_parent.children[i].nodeName == "INPUT"){
                    display_parent.children[i].setAttribute("value", changed_values.get("name"));
                    display_parent.children[i].value = changed_values.get("name");
                    handle_default(display_parent.children[i], changed_values.get("default"));
                    if(utils.toBoolean(changed_values.get("available"))){
                        display_parent.children[i].onclick = null;
                        display_parent.children[i].disabled = false;
                        //display_parent.children[i].setAttribute("disabled", false);
                    }else{
                        display_parent.children[i].onclick = onclick_disabled;
                        display_parent.children[i].disabled = true;
                    }
                }
            }
        }
    }

    function switch_between_edit_display(elem, next=false){
        if(utils.isObject(elem, HTMLElement)){
            let parent = elem.parentElement;
            if(utils.isObject(parent, HTMLElement)){
                let cur = null;
                if(utils.toBoolean(next)){
                    cur = parent.nextElementSibling;
                }else{
                    cur = parent.previousElementSibling;
                }
                if(utils.isObject(cur, HTMLElement)){
                    cur.style = "display:block;";
                    parent.style = "display:none;";
                }else{
                    throw new TypeError("Previous is not HTMLElement: " + typeof(cur));
                }
            }else{
                throw new TypeError("Parent is not HTMLElement: " + typeof(parent));
            }
        }else{
            throw new TypeError("Target is not HTMLElement: " + typeof(elem));
        }
    }

    function display_to_edit_handler(next, ev){
        switch_between_edit_display(ev.target, next);
    }

    function edit_to_display_handler(ev){
        if(utils.isObject(ev.target, HTMLElement)){
            let parent = ev.target.parentElement;
            let change_handler = new ChangeValueHandler();
            // This is the code to fill the ChangeValueHandler
            for(let i = 0; i < parent.children.length; i++){
                if(utils.isObject(parent.children[i], HTMLFormElement)){
                    let cur = null;
                    let cur_key = null;
                    let get_func = null;
                    for(let j = 0; j < parent.children[i].elements.length; j++){
                        if(utils.isObject(parent.children[i].elements[j], HTMLElement)){
                            cur = parent.children[i].elements[j].getAttribute("name");
                            if(utils.isString(parent.children[i].elements[j].nodeName, "INPUT")){
                                cur_key = retrieve_suffix(cur, id_type_name_sep)
                                get_func = get_option_form_data[cur_key];
                                if(utils.isFunction(get_func)){
                                    change_handler.addChange(cur_key,  get_func(parent.children[i].elements[j]));
                                }
                            }else{
                                continue;
                            }
                        }else{
                            continue;
                        }
                    }
                }else{
                    continue;
                }
            }
            let display_div = parent.nextElementSibling;
            if(parent.id == "item_edit"){
                change_item_values(change_handler, display_div);
            }else{
                change_option_values(change_handler, display_div);
            }
            change_handler.clear();
            switch_between_edit_display(ev.target, true);
        }else{
            throw new TypeError("Target is not an HTMLElement: " + typeof(ev.target));
        }
    }

    function find_li_parent(elem){
        let cur = elem;
        while(utils.isObject(cur, HTMLElement) && cur.nodeName != "LI"){
            cur = cur.parentElement;
        }
        if(utils.isObject(cur, HTMLElement)){
            return cur;
        }else{
            return null;
        }
    }

    function create_value_dict_from_option(elem){
        let li_parent = find_li_parent(elem);
        if(li_parent == null){
            throw new TypeError("Could not find the parent LI element for: " + elem);
        }
        let option_name_elem = li_parent.querySelector("." + options_label_class);
        let val_dict = {};
        val_dict["name"] = option_name_elem.innerHTML;
        val_dict["available"] = !elem.disabled;
        val_dict["value"] = elem.value;
        val_dict["default"] = elem.getAttribute("data-default");
        return val_dict;
    }

    function submit_handler(ev){
        let submit_values = {};
        let elem = document.getElementById(item_display_id);
        let cur_key = null;
        for(let i = 0; i < elem.children.length; i++){
            if(utils.isObject(elem.children[i], HTMLElement) && elem.children[i].nodeName != "BUTTON" && utils.isString(elem.children[i].getAttribute("name"), /^item\./)){
                cur_key = retrieve_suffix(elem.children[i].getAttribute("name"), id_type_name_sep);
                if(utils.isString(cur_key)){
                    submit_values[cur_key] = elem.children[i].innerHTML;
                }
            }
        }
        submit_values["options"] = [];
        let elem_collection = document.getElementsByClassName(option_submit_class);
        for(let i = 0; i < elem_collection.length; i++){
            if(utils.isObject(elem_collection[i], HTMLElement)){
                for(let j = 0; j < elem_collection[i].children.length; j++){
                    if(utils.isObject(elem_collection[i].children[j], HTMLElement)
                        && elem_collection[i].children[j].nodeName == "INPUT"
                        && utils.isString(elem_collection[i].children[j].getAttribute("type"), "radio")){
                            submit_values["options"].push(create_value_dict_from_option(elem_collection[i].children[j]));
                    }
                }
            }
        }
        elem = document.getElementById("test");
        elem.innerHTML = JSON.stringify(submit_values);
    }

    function switch_to_option_display(ev){
        let target = ev.target;
        let inputElem = target.previousElementSibling;
        let parent = target.parentElement;
        let parent_parent = parent.parentElement;
        let labelElem = parent_parent.querySelector("." + options_label_class);
        labelElem.innerHTML = inputElem.value;
        parent.style = "display:none;";
        parent.nextElementSibling.style = "display:block;";
    }
    

    return {
        "display_to_edit_handler": display_to_edit_handler,
        "edit_to_display_handler": edit_to_display_handler,
        "option_save_handler": switch_to_option_display,
        "submit_handler": submit_handler,
        "Class":{
            "SwitchDisplayToEdit": display_to_edit_class,
            "SwitchEditToDisplay": edit_to_display_class
        }
    }
}();