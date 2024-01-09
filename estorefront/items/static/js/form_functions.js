var form_functions = function(){

    let classes = {
        show: "show",
        hide: "hide"
    }

    function getElemValue(elem){
        return elem.value;
    }

    function getElemChecked(elem){
        return elem.checked;
    }

    let get_option_form_data = {
        "name": getElemValue,
        "available": getElemChecked,
        "default": getElemChecked,
        "item.name": getElemValue,
        "item.description": getElemValue,
        "item.price": getElemValue
    }

    // Don't think this is needed anymore
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
                //cur_key = retrieve_suffix(display_parent.children[i].getAttribute("name"), id_type_name_sep, true);
                cur_key = display_parent.children[i].getAttribute("name");
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
                    //handle_default(display_parent.children[i], changed_values.get("default"));
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

    function edit_to_display_handler(ev){
        if(utils.isObject(ev.target, HTMLElement)){
            let parent = ev.target.parentElement;
            let change_handler = new ChangeValueHandler();
            // This is the code to fill the ChangeValueHandler
            for(let i = 0; i < parent.children.length; i++){
                if(utils.isObject(parent.children[i], HTMLFormElement)){
                    let cur = null;
                    let get_func = null;
                    for(let j = 0; j < parent.children[i].elements.length; j++){
                        if(utils.isObject(parent.children[i].elements[j], HTMLElement)){
                            cur = parent.children[i].elements[j].getAttribute("name");
                            if(utils.isString(parent.children[i].elements[j].nodeName, "INPUT")){
                                //cur_key = retrieve_suffix(cur, id_type_name_sep)
                                get_func = get_option_form_data[cur];
                                if(utils.isFunction(get_func)){
                                    change_handler.addChange(cur,  get_func(parent.children[i].elements[j]));
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

    function onclick_disabled(ev){
        this.checked = false;
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
                    cur.classList.add(classes.show);
                    cur.classList.remove(classes.hide);
                    parent.classList.remove(classes.show);
                    parent.classList.add(classes.hide);
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

    /** Specifically handles the single textbox input saving for Option 
     * This needs to be better than it currently is.
    */
    function switch_to_option_display(ev){
        let target = ev.target;
        let inputElem = target.previousElementSibling;
        let parent = target.parentElement;
        let display_parent = parent.nextElementSibling;
        let labelElem = display_parent.querySelector("label");
        labelElem.innerHTML = inputElem.value;
        parent.classList.add(classes.hide)
        parent.classList.remove(classes.show);
        parent.nextElementSibling.classList.add(classes.show);
        parent.nextElementSibling.classList.remove(classes.hide);

        let parent_parent = parent.parentElement;
        let pp_parent = parent_parent.parentElement;
        let radio_inputs = pp_parent.querySelectorAll('input[type="radio"]');
        for(let i = 0; i < radio_inputs.length; i++){
            //radio_inputs[i].setAttribute("name", inputElem.value);
            radio_inputs[i].name = inputElem.value;
        }
    }

    return {
        "display_to_edit_handler": display_to_edit_handler,
        "edit_to_display_handler": edit_to_display_handler,
        "edit_to_display_option_handler": switch_to_option_display,
        "Class":{
            "Show": classes.show,
            "Hide": classes.hide
        }
    };

}();