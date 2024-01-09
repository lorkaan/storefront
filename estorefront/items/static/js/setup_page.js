var setup_page = function(){

    let item_edit_button_id = "item_edit.button"
    let item_save_button_id = "item_info_save";

    let item_add_option_id = "add_option_button";

    let request_options_url = "options";

    let parents_options_container_id = "option_list_div";

    let submit_button_id = "submit_item";
    let item_display_id = "item_display";
    let option_submit_class = html_nodes.EditOptionValueForm.classes.parent;

    function add_new_option_handler(ev){
        let target = ev.target;
        let parent = target.parentElement;
        let new_node = new html_nodes.FullOptionContainer();
        parent.insertBefore(new_node.createElement(), target);
    }

    function create_options_list(opt_list){
        let add_option_button = document.getElementById(item_add_option_id);
        if(!utils.isObject(add_option_button, HTMLElement)){
            throw new Error("Can not find the Add Option button");
        }
        add_option_button.addEventListener("click", add_new_option_handler);
        let elem = document.getElementById(submit_button_id);
        elem.addEventListener("click", form_functions.submit_handler.bind(null, item_display_id, option_submit_class));


        elem = document.getElementById(parents_options_container_id);
        if(utils.isObject(elem, HTMLElement) && utils.isObject(opt_list)){
            let nodes = [];
            let opt_keys = Object.keys(opt_list);
            for(let i = 0; i < opt_keys.length; i++){
                nodes.push(new html_nodes.FullOptionContainer(opt_keys[i], opt_list[opt_keys[i]]))
            }
            nodes.forEach(function(node){
                if(utils.isObject(node, dynamic_html.abstractNode)){
                    elem.insertBefore(node.createElement(), add_option_button);
                    //elem.appendChild(node.createElement());
                }    
            });
        }
    }

    function get_item_id_from_url(){
        let url_list =  document.URL.split("/");
        return url_list[url_list.length - 1];
    }

    function get_options(){
        let req_data = {};
        req_data['item_id'] = get_item_id_from_url();
        return restutils.post(request_options_url, req_data)
        .catch((err)=>{
            console.error(err);
        })
        .then((jsonObj)=>{
            create_options_list(jsonObj);
        });
    }

    function addItemInfoEventListeners(){
        let elem = document.getElementById(item_edit_button_id);
        elem.addEventListener('click', form_functions.display_to_edit_handler.bind(null, false));

        elem = document.getElementById(item_save_button_id);
        elem.addEventListener('click', form_functions.edit_to_display_handler);
    }

    return {
        "Options": get_options,
        "genericSetup": addItemInfoEventListeners
    };

}();

document.addEventListener("DOMContentLoaded", function(event){
    setup_page.Options();
    setup_page.genericSetup();
});