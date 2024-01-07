var setup_page = function(){

    let request_options_url = "";

    let parents_options_container_id = "option_list_div";

    let option_keys = ['name', 'option_values'];

    function create_options_list(opt_list){
        let elem = document.getElementById(parents_options_container_id);
        if(utils.isObject(elem, HTMLElement) && utils.isArray(opt_list)){
            let nodes = [];
            let cur_obj = null;
            for(let i = 0; i < opt_list.length; i++){
                if(utils.isObject(opt_list[i], option_keys)){
                    cur_obj = opt_list[i];
                    if(utils.isString(cur_obj[option_keys[0]])){
                        nodes.push(new html_nodes.FullOptionContainer(cur_obj[option_keys[0]], cur_obj[option_keys[1]]))
                    }else{
                        continue;
                    }          
                }else{
                    continue;
                }
            }
            nodes.forEach(function(node){
                if(utils.isObject(node, dynamic_html.abstractNode)){
                    elem.appendChild(node.createElement());
                }    
            });
        }
    }

    function get_options(){
        let req_data = {};
        return restutils.post(request_options_url, req_data);
    }

    return {

    };

}();