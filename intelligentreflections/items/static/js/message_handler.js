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

        constructor(process_func, bind_vars=[], collection_type=CollectionType.Single){
            if(utils.isFunction(process_func)){
                if(utils.isArray(bind_vars)){
                    this.process_func = process_func.bind(...blind_vars);
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

    }

    class ItemEditFormMessageHandler extends MessageHandler{

        static keys = {
            "item": new MessageHandlerKey(form_handler.Item.create_form, [form_handler.Item]),
            "option_forms": new MessageHandlerKey(form_handler.ItemOptionValue.create_form, [form_handler.ItemOptionValue], MessageHandlerKey.CollectionType.Dictionary);
        }

        /** This is the asynchronous retrieval and set up of forms
         * 
         * @param {*} url 
         * @param {*} item_id 
         * @returns             A Promise with the Response as a JSON Object
         */
        static retrieveData(url, item_id, token){
            let data = {'item_id': item_id};
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
            });
        }

    }

    return {};
}();