

document.addEventListener("DOMContentLoaded", function(event){
    let item_id_container = "hidden_item_id";
    let token_container_id = "csrf_token";
    let post_url = "";

    let submit_button_id = "submit_item";

    let elem_collection = document.getElementsByClassName(edit_form_manager.Class.SwitchDisplayToEdit);
    for(let i = 0; i < elem_collection.length; i++){
        elem_collection[i].addEventListener("click", edit_form_manager.display_to_edit_handler.bind(null, false));
    }

    elem_collection = document.getElementsByClassName(edit_form_manager.Class.SwitchEditToDisplay);
    for(let i = 0; i < elem_collection.length; i++){
        elem_collection[i].addEventListener("click", edit_form_manager.edit_to_display_handler);
    }

    let elem = document.getElementById(submit_button_id);
    elem.addEventListener("click", edit_form_manager.submit_handler);

});