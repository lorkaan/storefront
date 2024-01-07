var message_handler = function(){

    /** This object helps abstract and standardize the keys in
     * message handlers. The big purpose is to be able to specify
     * though config, and using the least about to individual code,
     * the actions to take for keys. Mostly, this was intended to 
     * be able to differiate between single form data and collections
     * of form data
     * 
     */
    class MessageHandlerKey{

        static CollectionType = {
            Single: 0,
            List: 1,
            Dictionary: 2
        };

        constructor(process_func, bind_vars=[], collection_type=MessageHandlerKey.CollectionType.Single){
            if(utils.isFunction(process_func)){
                if(utils.isArray(bind_vars)){
                    this.process_func = process_func.bind(...bind_vars);
                }else{
                    this.process_func = process_func;
                }
                this.type = collection_type;
            }else{
                throw new TypeError("Can not create MessageHandlerKey without a process function: " + typeof(process_func));
            }
        }
    }

    class MessageHandler{

        static parent_elem_id = null;

        static container_config = {
            tagName: "div",
            id: "ContainerConfig"
        };

        static set_parent_elem(){
            let parentElem = document.getElementById(this.parent_elem_id) || document.body;
            let cur_elem = dom_utils.config_create_elem(this.container_config);
            parentElem.appendChild(cur_elem);
            return parentElem;
        }

        static fetchPostData(url, data, token){
            return fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": token
                },
                body: JSON.stringify(data)
            })
            .catch(function(err){
                console.error(err);
            })
            .then(function(response){
                return response.json();
            })
            .then(function(jsonData){
                let cur = null;
                let parent_elem = this.set_parent_elem();
                for(let [key, value] of Object.entries(this.keys)){
                    cur = jsonData[key] || null;
                    if(utils.isObject(value, MessageHandlerKey)){
                        switch(value.type){
                            case MessageHandlerKey.CollectionType.Single:
                                if(utils.isObject(cur)){
                                    value.process_func(cur, parent_elem);
                                }
                                break;
                            case MessageHandlerKey.CollectionType.List:
                                if(utils.isArray(cur)){
                                    for(let i = 0; i < cur.length; i++){
                                        value.process_func(cur[i], parent_elem);
                                    }
                                }
                                break;
                            case MessageHandlerKey.CollectionType.Dictionary:
                                if(utils.isObject(cur)){
                                    for(let v of Object.values(cur)){
                                        // Only recurses one level and expects collection
                                        if(utils.isArray(v, 0)){
                                            for(let i = 0; i < v.length; i++){
                                                value.process_func(v[i], parent_elem);
                                            }
                                        }else if(utils.isObject(v)){
                                            value.process_func(v, parent_elem);
                                        }else{
                                            throw new TypeError("Expected a Dictionary or Array, got: " + typeof(v));
                                        }
                                        
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }else{
                        throw new TypeError("Expected a MessageHandlerKey, got: " + typeof(value));
                    }
                }
            }.bind(this));
        }

    }

    class ItemEditFormMessageHandler extends MessageHandler{

        static keys = {
            "item": new MessageHandlerKey(form_handler.Item.create_form, [form_handler.Item]),
            "option_forms": new MessageHandlerKey(form_handler.ItemOptionValue.create_form, [form_handler.ItemOptionValue], MessageHandlerKey.CollectionType.Dictionary)
        };

        /** This is the asynchronous retrieval and set up of forms
         * 
         * @param {*} url 
         * @param {*} item_id 
         * @returns             A Promise with the Response as a JSON Object
         */
        static retrieveData(url, item_id, token){
            let data = {'item_id': item_id};
            return this.fetchPostData(url, data, token);
        }

    }

    return {
        "ItemEditFormMessageHandler": ItemEditFormMessageHandler
    };
}();