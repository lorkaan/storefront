var dynamic_html = function(){ // just to stop the auto filter for now

    let nodeNames = {
        input: "INPUT",
        container: "DIV",
        break: "BR",
        label: "LABEL",
        button: "BUTTON",
        form: "FORM"
    };

    /** This is a class for handling the various validation and setting functions
     * utilized by Input Elements. It is designed to provide arbitrary ways for
     * validation and value setting with minimal edge case coding
     */
    class ValidationSetHandler{

        constructor(validation_func, set_func){
            if(utils.isFunction(validation_func)){
                this.validation_func = validation_func;
            }else{
                this.validation_func = null;
            }
            if(utils.isFunction(set_func)){
                this.set_func = set_func;
            }else{
                this.set_func = null;
            }
        }

        /** Validates the input (val) and sets it in the given HTMLElement (elem)
         * 
         * Validation and Set proceedures depend on the functions given in object
         * constructor
         * 
         * @param {*} val       The value to validate and set.
         * @param {*} elem      The HTMLElement to set the given value in.
         */
        setValue(val, elem){
            if(utils.isObject(elem, HTMLElement)){
                if(this.validation_func != null && this.set_func != null){
                    if(this.validation_func(val)){
                        this.set_func(elem, val);
                    }
                }
            }
        }
    }

    // Specifies the ValidationSetHandler functions for each type of Input Element
    let inputTypes = {
        text: new ValidationSetHandler(function(val){
            return utils.isString(val);
        },function(elem, val){
            elem.value = val;
        }),
        checkbox: new ValidationSetHandler(function(val){
            return utils.isBoolean(val);
        },function(elem, val){
            elem.checked = val;
        })

    };


    /** Represents an HTMLElement 
     * 
     * This object is used to represent HTMLElements that need to be dynamically created
     * in JavaScript. 
     * 
     * Due to the large number of possible parameters (id, class, etc.) that is used by
     * all HTMLElements, a number of convience functions are included to ensure cleaner code.
     * These functions are to be called after constructor calls and will completely override
     * their respective parameters if the given argument passes validation checks. Additionally,
     * the functions will provide a boolean result indicating if validation was passed and the
     * values in the object were updated.
     * These functions are as follows:
     *          setId(<string>)
     *          setClass(<string/array<string>>)
     *          setAttributes(<dict<string, string>>)
     *          setEvents(<dict<string, function>>)
     * 
     * For functions with collection arguments, dict or array, validation checks do not
     * check the validity for each element in that collection. That is instead checked
     * when the HTMLElement is created via the createElement() function. 
     * More precisely, validity is checked in the internal helper functions when
     * adding the arguments to the HTMLElement itself.
     * 
     * Note:
     *      This class does not hold any Node Name and can not be created.
     *      Instead, this class is used as an Abstract Class to subclass HTMLElement Nodes
     * 
     * 
     * Note, you can set events using the setEvents(<dict>) function.
     * Each key, value pair in the dictionary represents the event type 
     * and handler function respectively
    */
    class HtmlNode{

        static _defaults = {
            id: null,
            cls: null,
            attrs: {},
            events: {}
        }

        static NodeName = null;

        static isValidAttribute(value){
            return (utils.isString(value) || utils.isNumber(value) || utils.isBoolean(value));
        }

        constructor(id=null, cls=null, events={}, attrs={}){
            if(utils.isString(id)){
                this.id = id;
            }else{
                this.id = HtmlNode._defaults.id;
            }
            if(utils.isString(cls) || utils.isArray(cls)){
                this.cls = cls;
            }else{
                this.cls = HtmlNode._defaults.cls;
            }
            if(utils.isObject(attrs)){
                this.attrs = attrs;
            }else{
                this.attrs = HtmlNode._defaults.attrs;
            }
            if(utils.isObject(events)){
                this.events = events;
            }else{
                this.events = HtmlNode._defaults.events;
            }
        }

        /** Just a convient way to set id */
        setId(id){
            if(utils.isString(id)){
                this.id = id;
                return true;
            }else{
                return false;
            }
        }

        addClass(cls){
            if(utils.isString(cls) || utils.isArray(cls)){
                if(utils.isArray(this.cls)){
                    if(utils.isArray(cls)){
                        this.cls.concat(cls);
                    }else{
                        this.cls.push(cls);
                    }
                }else if(utils.isString(this.cls)){
                    let temp = [];
                    temp.push(this.cls);
                    temp.push(cls);
                    this.cls = temp;
                }else{
                    this.cls = cls;
                }
                return true;
            }else{
                return false;
            }
        }

        /** Just a convient way to set class */
        setClass(cls){
            if(utils.isString(cls) || utils.isArray(cls)){
                this.cls = cls;
                return true;
            }else{
                return false;
            }
        }

        addEvent(type, handler_func){
            if(utils.isString(type) && utils.isFunction(handler_func)){
                if(!utils.isObject(this.events)){
                    this.events = {};
                }
                this.events[type] = value;
                return true;
            }else{
                return false;
            }
        }

        /** Just a convient way to set events */
        setEvents(events){
            if(utils.isObject(events)){
                this.events = events;
                return true;
            }else{
                return false;
            }
        }

        addAttribute(key, value){
            if(utils.isString(key) && this.constructor.isValidAttribute(value)){
                if(!utils.isObject(this.attrs)){
                    this.attrs = {};
                }
                this.attrs[key] = value;
                return true;
            }else{
                return false;
            }
        }

        /** Just a convient way to set attributes */
        setAttributes(attrs){
            if(utils.isObject(attrs)){
                this.attrs = attrs;
                return true;
            }else{
                return false;
            }
        }

        /** Adds Classes to a given HTMLElement
         * 
         */
        addClassesToElem(elem){
            if(utils.isObject(elem, HTMLElement)){
                if(utils.isString(this.cls)){
                    elem.classList.add(this.cls);
                }
                if(utils.isArray(this.cls)){
                    for(let i = 0; i < this.cls.length; i++){
                        if(utils.isString(this.cls[i])){
                            elem.classList.add(this.cls[i]);
                        }else{
                            continue;
                        }
                    }
                }
            }
        }

        /** Adds Event Listeners to an HTMLElement
         * 
         * @param {*} elem          The HTMLElement to add listeners to.
         * @param {*} event_dict    The dictionary of event listeners (event_name, function(ev){})
         */
        addEventListersToElem(elem){
            if(utils.isObject(elem, HTMLElement) && utils.isObject(this.events)){
                let keys = Object.keys(this.events);
                for(let i = 0; i < keys.length; i++){
                    if(utils.isString(keys[i]) && utils.isFunction(this.events[keys[i]])){
                        elem.addEventListener(keys[i], this.events[keys[i]]);
                    }else{
                        continue;
                    }
                }
            }
        }

        /** Adds Attributes to an HTMLElement
         * 
         * @param {*} elem          The HTMLElement to add attributes to.
         * @param {*} attr_dict     The dictionary of attributes.
         */
        addAttributesToElem(elem){
            if(utils.isObject(elem, HTMLElement) && utils.isObject(this.attrs)){
                let keys = Object.keys(this.attrs);
                for(let i = 0; i < keys.length; i++){
                    if(utils.isString(keys[i]) && this.constructor.isValidAttribute(this.attrs[keys[i]])){
                        elem.setAttribute(keys[i], this.attrs[keys[i]]);
                    }else{
                        continue;
                    }
                }
            }
        }

        /** Setups an HTMLElement.
         * 
         * This is the function to override with Mixins.
         * Don't forget to call the super() function to get these 
         * setup functions called.
         * 
         * @param {*} elem 
         */
        _setupElement(elem){
            if(utils.isString(this.id)){
                elem.id = this.id;
            }
            this.addClassesToElem(elem);
            this.addAttributesToElem(elem);
            this.addEventListersToElem(elem);
        }

        /** Creates an instance of the HTMLElement that is represented by this Node 
         * It should be noted that this function just creates the HTMLElement object
         * in JavaScript, but does not attach it to the DOM to be rendered.
         * 
         * If this function fails, it will do so silently and return a null object, so
         * proper use must always check that the object returned is a HTMLElement object.
         * 
         * @return An HTMLElement object to be attached to a DOM, null if such an action
         *          could not be performed.
        */
        createElement(){
            if(utils.isString(this.constructor.NodeName)){
                let elem = document.createElement(this.constructor.NodeName.toUpperCase());
                if(utils.isObject(elem, HTMLElement)){
                    this._setupElement(elem);
                    return elem;
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }
    }

    /** This represents a simple line break HTMLElement (</br>)
     * By Default, it does not allow any parameters (id, class, etc)
     * to be added to it, and instead must be added using the appropiate functions
     * after creation:
     *          setId()
     *          setClass()
     *          setAttributes()
     *          setEvents()
     */
    class BreakNode extends HtmlNode{

        static NodeName = nodeNames.break;

        constructor(){
            super();
        }
    }

    /** Mixin for including Text between the HTML Tags
     * 
     */
    class InnerTextMixin extends HtmlNode{

        constructor(text, ...args){
            super(...args);
            this.text = text;
        }

        _setupElement(elem){
            if(utils.isString(this.text)){
                elem.innerHTML = this.text;
            }
            super._setupElement(elem);
        }
    }

    /** Represents a button.
     * Note, you can set events using the setEvents(<dict>) function.
     * Each key, value pair in the dictionary represents the event type 
     * and handler function respectively
     */
    class ButtonNode extends InnerTextMixin{

        static NodeName = nodeNames.button;
        
        constructor(text, ...args){
            super(text, ...args);
        }
    }

    /** Represents a Label HTML Element
     * 
     */
    class LabelNode extends InnerTextMixin{
        
        static NodeName = nodeNames.label;

        constructor(text, ...args){
            super(text, ...args);
        }
    }

    /** Represents the Input HTML Element
     * 
     */
    class InputNode extends HtmlNode{

        static NodeName = nodeNames.input;

        static isValidValue(value){
            return utils.isString(value);
        }

        constructor(type, name=null, init_val=null, ...args){
            super(...args);
            if(utils.isString(type)){
                this.type = type;
            }else{
                this.type = null;
            }
            if(utils.isString(name)){
                this.name = name;
            }else{
                this.name = null;
            }
            if(InputNode.isValidValue(init_val)){
                this.value = init_val;
            }else{
                this.value = null;
            }
        }

        setInitValue(init_val){
            if(utils.isString(init_val)){
                this.value = init_val;
                return true;
            }else{
                return false;
            }
        }

        setName(name){
            if(utils.isString(name)){
                this.name = name;
                return true;
            }else{
                return false;
            }
        }

        _setupElement(elem){
            if(utils.isString(this.name)){
                elem.name = this.name;
            }
            if(utils.isString(this.type)){
                elem.type = this.type;
                let validSetter = inputTypes[this.type] || null;
                if(utils.isObject(validSetter, ValidationSetHandler) && this.constructor.isValidValue(this.value)){
                    validSetter.setValue(this.value, elem);
                }
            }
            super._setupElement(elem);
        }
    }

    /** This is a container Mixin used for when an HTML Element acts as a container
     * for other HTML Elements. Such uses are divs and forms.
     * 
     */
    class ContainerMixin extends HtmlNode{

        constructor(nodes=[], ...args){
            super(...args);
            if(utils.isArray(nodes)){
                this.nodes = nodes;
            }else{
                this.nodes = [];
            }
        }

        addChild(node){
            if(utils.isArray(this.nodes)){
                if(utils.isObject(node, HtmlNode) && utils.isString(node.constructor.NodeName)){
                    this.nodes.push(node);
                }else{
                    throw new TypeError("Can not add type " + typeof(node));
                }
            }else{
                throw new TypeError("Expected nodes to be an array, got " + typeof(this.nodes));
            }
        }

        _setupElement(elem){
            let cur = null;
            for(let i = 0; i < this.nodes.length; i++){
                if(this.nodes[i] instanceof HtmlNode){
                    cur = this.nodes[i].createElement();
                    elem.appendChild(cur);
                }else{
                    continue;
                }
            }
            super._setupElement(elem);
        }
    }

    /** Represents a Form HTML Element.
     * 
     * Currently, is the same as a DivNode, except the Node Name is form
     * 
     * More work needs to be done for common attributes like:
     *      - action
     *      - method
     *      - name
     * 
     */
    class FormNode extends ContainerMixin{

        static NodeName = nodeNames.form;

        constructor(nodes, ...args){
            super(nodes, ...args);
        }
    }

    /** Represents a Div HTMLElement. Holds collections of other Elements
     * (represented by HtmlNode objects) and will create all when requested.
     * 
     */
    class DivNode extends ContainerMixin{

        static NodeName = nodeNames.container;
        
        constructor(nodes, ...args){
            super(nodes, ...args);
        }
    }

    return {
        "nodes": {
            "break": BreakNode,
            "button": ButtonNode,
            "label": LabelNode,
            "input": InputNode,
            "form": FormNode,
            "div": DivNode
        },
        "mixins": {
            "container": ContainerMixin,
            "innerText": InnerTextMixin
        },
        "abstractNode": HtmlNode
    };

}();