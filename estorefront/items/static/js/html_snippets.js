var html_nodes = function(){

    /** Should be somewhere else but I need it here for now */
    function capitalize(text){
        let temp = text.charAt(0).toUpperCase();
        return temp + text.slice(1);
    }

    class OptionDisplayNode extends dynamic_html.nodes.div{

        static classes = {
            label: "options_label",
            button: "switch_edit",
            parent: "option_display"
        };

        static events = {
            button: {
                "click": function(ev){}
            }
        };

        /** 
         * @param {*}    extra_cls   any extra classes to put on this node (only parent container)
         */
        constructor(text, extra_cls=[]){
            super([
                new dynamic_html.nodes.label(text, null, OptionDisplayNode.classes.label),
                new dynamic_html.nodes.button("Edit", null, OptionDisplayNode.classes.button,
                    OptionDisplayNode.events.button
                )
            ], null, [OptionDisplayNode.classes.parent].concat(extra_cls));
        }
    }

    class OptionEditNode extends dynamic_html.nodes.div{

        static classes = {
            input: "options_label",
            button: "switch_display_option",
            parent: "edit_option_container"
        };

        static input = {
            type: "text",
            name: ""
        };

        static events = {
            button: {
                "click": function(ev){}
            }
        };

        /** 
         * @param {*}    extra_cls   any extra classes to put on this node (only parent container)
         */
        constructor(text, extra_cls=[]){
            super([
                new dynamic_html.nodes.input(OptionEditNode.input.type, OptionEditNode.input.name, text),
                new dynamic_html.nodes.button("Save", null, OptionEditNode.classes.button,
                    OptionEditNode.events.button
                )
            ], null, [OptionEditNode.classes.parent].concat(extra_cls));
        }
    }

    /** This is the HTML Snippet for display an Option that can have values assoicated */
    class OptionContainer extends dynamic_html.nodes.div{

        static classes = {
            show: "show",
            hide: "hide",
            parent: "option_container"
        };

        constructor(text=null, edit_flag=false){
            if(utils.toBoolean(edit_flag) || !utils.isString(text)){
                option_edit_class = OptionContainer.classes.show;
                option_display_class = OptionContainer.classes.hide;
            }else{
                option_display_class = OptionContainer.classes.show;
                option_edit_class = OptionContainer.classes.hide;
            }
            super([
                new OptionEditNode(text, option_edit_class),
                new OptionDisplayNode(text, option_display_class)
            ], null, OptionContainer.classes.parent);
        }
    }

    /** Option Value Snippets */

    /** Edit Form for Option Values */
    class EditOptionValueForm extends dynamic_html.nodes.form{

        static inputs = {
            name: {
                name: "name",
                type: "text"
            },
            available: {
                name: "available",
                type: "checkbox"
            },
            default: {
                name: "default",
                type: "checkbox"
            }
        };

        static classes = {
            parent: "edit_option_form"
        };

        constructor(name_val, available_val, default_val){

            super([
                new dynamic_html.nodes.input(EditOptionValueForm.inputs.name.type, EditOptionValueForm.inputs.name.name, name_val),
                new dynamic_html.nodes.break,
                new dynamic_html.nodes.input(EditOptionValueForm.inputs.available.type, EditOptionValueForm.inputs.available.name, available_val),
                new dynamic_html.nodes.label(capitalize(EditOptionValueForm.inputs.available.name)),
                new dynamic_html.nodes.break,
                new dynamic_html.nodes.input(EditOptionValueForm.inputs.default.type, EditOptionValueForm.inputs.default.name, default_val),
                new dynamic_html.nodes.label(capitalize(EditOptionValueForm.inputs.default.name))
            ], null, EditOptionValueForm.classes.parent);
        }

    }

    class EditOptionValueFormContainer extends dynamic_html.nodes.div{

        static classes = {
            button: "switch_display",
            parent: "edit_option_container"
        };

        static events = {
            button: {
                "click": function(ev){}
            }
        };

        constructor(name_val, available_val, default_val, extra_cls=[]){
            super([
                new EditOptionValueForm(name_val, available_val, default_val),
                new dynamic_html.nodes.break,
                new dynamic_html.nodes.button("Save", null, EditOptionValueFormContainer.classes.button,
                    EditOptionValueFormContainer.events.button
                )
            ], null, [EditOptionValueFormContainer.classes.parent].concat(extra_cls));
        }
    }

    class OptionValueDisplayNode extends dynamic_html.nodes.div{

        static input = {
            type: "radio",
            name: ""
        };

        constructor(name_val, available_val, default_val, extra_cls=[]){
            available_val = utils.toBoolean(available_val);
            default_val = utils.toBoolean(default_val);
            let inputAttrs = {};
            let labelAttrs = {};
            if(!available_val){
                inputAttrs['disabled'] = true;
                labelAttrs['disabled'] = true;
            }
            if(default_val){
                inputAttrs['checked'] = true;
            }
            super([
                new dynamic_html.nodes.input(OptionValueDisplayNode.input.type, OptionValueDisplayNode.input.name, name_val, null, null, null, inputAttrs),
                new dynamic_html.nodes.label(name_val, null, null, null, labelAttrs)
            ], null, [OptionValueDisplayNode.classes.parent].concat(extra_cls));
        }
    }

    class OptionValueContainer extends dynamic_html.nodes.div{

        static classes = {
            show: "show",
            hide: "hide",
            parent: "option_container"
        };

        constructor(name_val, available_val, default_val, edit_flag=false){
            if(utils.toBoolean(edit_flag) || !utils.isString(text)){
                option_edit_class = OptionValueContainer.classes.show;
                option_display_class = OptionValueContainer.classes.hide;
            }else{
                option_display_class = OptionValueContainer.classes.show;
                option_edit_class = OptionValueContainer.classes.hide;
            }
            super([
                new EditOptionValueFormContainer(name_val, available_val, default_val, option_edit_class),
                new OptionValueDisplayNode(name_val, available_val, default_val, option_display_class)
            ], null, OptionValueContainer.classes.parent);
        }
    }

    class FullOptionContainer extends dynamic_html.nodes.div{

        static keys = ['name', 'available', 'default'];

        static create_option_value_container(obj){
            if(utils.isObject(obj, this.keys)){
                new OptionValueContainer(obj[this.keys[0]], obj[this.keys[1]], obj[this.keys[2]])
            }else{
                return null;
            }
        }

        constructor(text=null, opt_val_list=[]){
            if(!utils.isArray(opt_val_list)){
                opt_val_list = [];
            }
            let nodes = [];
            if(opt_val_list.length <= 0){
                nodes.push(new OptionContainer(text, true));
            }else{
                nodes.push(new OptionContainer(text));
            }
            let cur = null;
            for(let i = 0; i < opt_val_list.length; i++){
                cur = FullOptionContainer.create_option_value_container(opt_val_list[i]);
                if(utils.isObject(cur, OptionValueContainer)){
                    nodes.push(cur);
                }else{
                    continue;
                }
            }
            super(nodes);
        }
    }


    return {
        "OptionValueContainer": OptionValueContainer,
        "FullOptionContainer": FullOptionContainer
    };

}();