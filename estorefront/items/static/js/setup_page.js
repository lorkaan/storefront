var setup_page = function(){

    let item_edit_button_id = "item_edit.button"
    let item_save_button_id = "item_info_save";

    let request_options_url = "options";

    let parents_options_container_id = "option_list_div";

    function create_options_list(opt_list){
        console.log(opt_list);
        console.log(utils.isArray(opt_list));
        let elem = document.getElementById(parents_options_container_id);
        if(utils.isObject(elem, HTMLElement) && utils.isObject(opt_list)){
            let nodes = [];
            let opt_keys = Object.keys(opt_list);
            for(let i = 0; i < opt_keys.length; i++){
                nodes.push(new html_nodes.FullOptionContainer(opt_keys[i], opt_list[opt_keys[i]]))
            }
            nodes.forEach(function(node){
                if(utils.isObject(node, dynamic_html.abstractNode)){
                    elem.appendChild(node.createElement());
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