
var adv_form_utils = function(){

    /** These are hacked together and I need to generalize this using classes
    */

    let ids = {
        text_countries_input: "",
        add_ship_item_button: ""
    };

    let classes = {
        country_cbox: "",
        input: "form_input"
    };

    let attrs = {
        country_value: ""
    };

    function createCheckboxQuerySelector(val){
        return '.' + classes.country_cbox + '[' + attrs.country_value + '="' + val +'"]';
    }

    /** Used to handle filling a multi-select with checkbox and a text display */
    function handle_country_array_input(elem, val){
        let cur_elem = null;
        let text_box_val = "";
        let cur_cbox = null;
        let cur_selector = "";
        for(let i = 0; i < val.length; i++){
            cur_elem = document.getElementById(val[i]);
            if(cur_elem){
                cur_elem.selected = true;
                if(text_box_val.length == 0){
                    text_box_val = val[i];
                }else{
                    text_box_val = text_box_val + ", " + val[i];
                }
                cur_selector = createCheckboxQuerySelector(val[i]);
                cur_cbox = document.querySelector(cur_selector);
                if(cur_cbox){
                    cur_cbox.checked = true;
                }
            }else{
                continue;
            }
        }
        let textbox_elem = document.getElementById(ids.text_countries_input);
        textbox_elem.value = text_box_val;
    }

    /** Handles Edge cases and generic case for resetting input.
     * 
     * @param {Element} input_elem 
     */
    function resetInput(input_elem){
        if(input_elem instanceof HTMLElement){
            input_elem.value = "";
        }
    }

    /** Adds another row to the table of ship items
     * 
     */
    function one_more_row(){
        try{
            let elem = document.getElementById(ids.add_ship_item_button);
            let cur_elem = elem.parentElement.parentElement;
            let prev_elem = cur_elem.previousElementSibling;
            let parent_elem = cur_elem.parentElement;

            let new_elem = prev_elem.cloneNode(true);
            let new_inputs = new_elem.querySelectorAll("." + classes.input);
            for(let i = 0; i < new_inputs.length; i++){
                resetInput(new_inputs[i]);
            }
            parent_elem.insertBefore(new_elem, cur_elem);
        }catch(err){
            console.error(err);
        }
    }

    function createArrayInputSelector(elem){
        return '.' + classes.input + '[name="' + elem.getAttribute("name") + '"]';
    }

    // For filling a multi row with arbitrary rows of information
    function handle_ship_item_array_input(elem, val){
        // Assume val is array and elem is an HTMLElement

        // Initial Row Number
        let cur_rows = document.getElementsByClassName(classes.ship_item_row);
        if(cur_rows.length < val.length){ // If not enough space, make space
            for(let i = 0; i < (val.length - cur_rows.length); i++){
                one_more_row();
            }
        }
        let selector = createArrayInputSelector(elem);
        let input_elems = document.querySelectorAll(selector);
        for(let i = 0; i < val.length; i++){
            try{
                input_elems[i].value = val[i];
            }catch(err){
                console.error(err);
            }finally{
                continue;
            }
        }
    }

    return {
        "handle_array": handle_country_array_input,

    };
}();