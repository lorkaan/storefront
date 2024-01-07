/** Handles Edge cases and generic case for resetting input.
 * 
 * @param {Element} input_elem 
 */
function resetInput(input_elem){
    if(input_elem instanceof HTMLElement){
        let type = input_elem.getAttribute("type");
        if(type == "checkbox" || type == "radio"){
            input_elem.checked = false;
            input_elem.removeAttribute('checked');
        }else{
            input_elem.value = "";
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event){

    let add_option_button_id = "add_option_button";
    let input_selector = "input";

    let add_option_value_button_id = "add_option_value_button";

    let submit_button_id = "submit_item";

    let switch_display_option_class = "switch_display_option";

    let elem_collection = document.getElementsByClassName(edit_form_manager.Class.SwitchDisplayToEdit);
    for(let i = 0; i < elem_collection.length; i++){
        elem_collection[i].addEventListener("click", edit_form_manager.display_to_edit_handler.bind(null, false));
    }

    elem_collection = document.getElementsByClassName(edit_form_manager.Class.SwitchEditToDisplay);
    for(let i = 0; i < elem_collection.length; i++){
        elem_collection[i].addEventListener("click", edit_form_manager.edit_to_display_handler);
    }

    elem_collection = document.getElementsByClassName(switch_display_option_class);
    for(let i = 0; i < elem_collection.length; i++){
        elem_collection[i].addEventListener("click", edit_form_manager.option_save_handler);
    }

    let elem = document.getElementById(submit_button_id);
    elem.addEventListener("click", edit_form_manager.submit_handler);

    // Add Option Value
    elem = document.getElementById(add_option_value_button_id);
    if(elem){
        elem.addEventListener("click", function(ev){
            let target = ev.currentTarget;
            let global_parent = target.parentElement;
            if(global_parent){
                let cur_last_elem = target.previousElementSibling;
                if(cur_last_elem){
                    let new_elem = cur_last_elem.cloneNode(true);
                    let new_inputs = new_elem.querySelectorAll(input_selector);
                    for(let i = 0; i < new_inputs.length; i++){
                        resetInput(new_inputs[i]);
                    }
                    let button = new_elem.querySelector("." + edit_form_manager.Class.SwitchDisplayToEdit);
                    button.addEventListener("click", edit_form_manager.display_to_edit_handler.bind(null, false));
                    button = new_elem.querySelector("." + edit_form_manager.Class.SwitchEditToDisplay);
                    button.addEventListener("click", edit_form_manager.edit_to_display_handler);
                    global_parent.insertBefore(new_elem, target);
                }
            }
        });
    }

    // Add Option
    elem = document.getElementById(add_option_button_id);
    if(elem){
        elem.addEventListener("click", function(ev){
            let target = ev.currentTarget;
            let parent = target.parentElement;
            if(parent){
                let global_parent = parent.parentElement;
                if(global_parent){
                    let cur_last_elem = parent.previousElementSibling;
                    if(cur_last_elem){
                        let new_elem = cur_last_elem.cloneNode(true);
                        let new_inputs = new_elem.querySelectorAll(input_selector);
                        for(let i = 0; i < new_inputs.length; i++){
                            resetInput(new_inputs[i]);
                        }
                        global_parent.insertBefore(new_elem, cur_last_elem);
                    }
                }
            }
        });
    }

});