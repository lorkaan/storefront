var edit_form_manager = function(){

    let id_type_name_sep = ".";  // This separates an identifier from a type
    let option_key_sep = "_";   // This separates the variable from literals in option element ids

    let edit_dom_key = "edit";
    let display_dom_key = "display";

    let option_submit_class = "option_submit";

    let display_to_edit_class = "switch_edit";
    let edit_to_display_class = "switch_display"

    let form_id_types = ["form", "submit", "container"]; // Order matters as name as 0 is important

    let form_name_types = ["name", "available", "default"];

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
                        display_parent.children[i].classList.add("disabled");
                    }else{
                        display_parent.children[i].classList.remove("disabled");
                    }
                }else if(display_parent.children[i].nodeName == "INPUT"){
                    display_parent.children[i].setAttribute("value", changed_values.get("name"));
                    display_parent.children[i].value = changed_values.get("name");
                    if(utils.toBoolean(changed_values.get("available"))){
                        display_parent.children[i].onclick = null;
                        display_parent.children[i].disabled = false;
                    }else{
                        display_parent.children[i].onclick = onclick_disabled;
                        display_parent.children[i].disabled = true;
                    }
                }
            }
        }
    }

    function get_new_name(old_id){
        if(utils.isString(old_id)){
            let old_full_id = [old_id, form_id_types[0]].join(id_type_name_sep);
            let elem = document.getElementById(old_full_id);
            if(utils.isObject(elem, HTMLFormElement)){
                let inputs = elem.elements;
                for(let i = 0; i < inputs.length; i++){
                    if(utils.isString(inputs[i].getAttribute("name"))){
                        return inputs[i].value;
                    }
                }
            }
        }
    }

    function change_ids(old_id, new_id){
        if(!utils.isString(old_id) || !utils.isString(new_id)){
            throw new TypeError("Expected Strings, got " + typeof(old_id) + ", " + typeof(new_id));
        }
        let cur_old_full_id = null;
        let cur_new_full_id = null;
        let cur_elem = null;
        for(let i = 0; i < form_id_types.length; i ++){
            cur_old_full_id = [old_id, form_id_types[i]].join(id_type_name_sep);
            cur_new_full_id = [new_id, form_id_types[i]].join(id_type_name_sep);
            if(utils.isString(cur_old_full_id) && utils.isString(cur_new_full_id)){
                cur_elem = document.getElementById(cur_old_full_id);
                if(utils.isObject(cur_elem, HTMLElement)){
                    cur_elem.setAttribute("id", cur_new_full_id);
                }else{
                    throw new TypeError("Can not find an HTMLElement with id: " + cur_old_full_id);
                }
            }else{
                throw new TypeError("Expected two strings, got: " + cur_old_full_id + ", " + cur_new_full_id);
            }
        }
    }

    function change_input_names(old_id, new_id){
        if(!utils.isString(old_id) || !utils.isString(new_id)){
            throw new TypeError("Expected Strings, got " + typeof(old_id) + ", " + typeof(new_id));
        }
        let form_id = [old_id, form_id_types[0]].join(id_type_name_sep);
        let form_elem = document.getElementById(form_id);
        if(!utils.isObject(form_elem, HTMLFormElement)){
            throw new TypeError("Could not find the Form Element");
        }
        let cur = null;
        let cur_name = null;
        for(let i = 0; i < form_elem.elements.length; i++){
            cur_name = form_elem.elements[i].getAttribute("name");
            if(utils.isString(cur_name) && cur_name.startsWith(old_id)){
                cur = cur_name.replace(old_id, new_id);
                form_elem.elements[i].setAttribute("name", cur);
            }else{
                continue;
            }
        }
    }

    /** Replaces all the IDs with new ids indicating the name of the option.
     * 
     * DOES NOT CHECK FOR DUPLICATES
     * 
     * Come back and fix later (2.0)
     * 
     * @param {String} old_full_id ID of the button clicked which holds the current option name info
     */
    function change_name(old_full_id){
        let old_id = retrieve_prefix(old_full_id, id_type_name_sep);
        let old_option_name = retrieve_prefix(old_id, option_key_sep);
        let new_name = get_new_name(old_id);
        let new_id = old_id.replace(old_option_name, new_name);
        change_input_names(old_id, new_id);
        change_ids(old_id, new_id);
        let display_elem = document.getElementById([old_option_name, display_dom_key].join(option_key_sep));
        for(let i = 0; i < display_elem.children.length; i++){
            if(utils.isObject(display_elem.children[i], HTMLElement)){
                if(display_elem.children[i].nodeName == "LABEL"){
                    display_elem.children[i].innerHTML = new_name;
                }else if(display_elem.children[i].nodeName == "INPUT"){
                    display_elem.children[i].setAttribute("value") = new_name;
                    display_elem.children[i].value = new_name;
                }
            }
        }
        if(utils.isObject(display_elem, HTMLElement)){
            display_elem.id = [new_name, display_dom_key].join(option_key_sep);
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

    function change_name_eventhandler(ev){
        if(utils.isObject(ev.target, HTMLElement)){
            let id = ev.target.getAttribute('id');
            if(utils.isString(id)){
                change_name(id);
                switch_between_edit_display(ev.target, true);
            }else{
                throw new TypeError("Can not find the id: " + typeof(id) + " >> " + id);
            }
        }else{
            throw new TypeError("Given target is not an HTMLElement");
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
                    for(let j = 0; j < parent.children[i].elements.length; j++){
                        if(utils.isObject(parent.children[i].elements[j], HTMLElement)){
                            cur = parent.children[i].elements[j].getAttribute("name");
                            if(utils.isString(parent.children[i].elements[j].nodeName, "INPUT")){
                                change_handler.addChange(retrieve_suffix(cur, id_type_name_sep), parent.children[i].elements[j].value);
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

    

    

    return {
        "change_name_eventhandler": change_name_eventhandler,
        "display_to_edit_handler": display_to_edit_handler,
        "edit_to_display_handler": edit_to_display_handler,
        "Class":{
            "OptionSubmit": option_submit_class,
            "SwitchDisplayToEdit": display_to_edit_class,
            "SwitchEditToDisplay": edit_to_display_class
        }
    }
}();