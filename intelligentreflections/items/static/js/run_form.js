

document.addEventListener("DOMContentLoaded", function(event){
    let item_id_container = "hidden_item_id";
    let form_container_id = "formContainer";
    let token_container_id = "csrf_token";
    let post_url = "";

    let elem = document.getElementById(item_id_container);
    let token_elem = document.getElementById(token_container_id);
    if(!utils.isNull(elem)){
        let item_id = elem.innerText;
        if(!utils.isNull(token_elem)){
            let token = token_elem.innerText;
            form_handler.ItemOptionValue.retrieveData(post_url, item_id, token)
            .catch(function(err){
                console.error(err);
            })
            .then(function(form_elem){
                let parent_elem = document.getElementById(form_container_id);
                if(!utils.isNull){
                    parent_elem.appendChild(form_elem);
                }
            });
        }else{
            throw new TypeError("Token Can not be found");
        }
    }else{
        throw new TypeError("Can not get the item id");
    }
});