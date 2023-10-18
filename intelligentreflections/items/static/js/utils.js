/** Javascript code for the general utility for applications
 *
 * Created in order to have cleaner type checked code without
 * a framework or without requiring libraries with unncessary
 * functionality.
 *
 * @author: Laurkan Rodriguez
 * @date: 13/11/2018
 */

 /** License Information
  *
  * This is licensed under the Creative Commons License.
  *
  * < Actual License stuff is to be put here >
  *
  */

 /** Unobtrusive Javascript style of creating a library. */
 var utils = function(){

    /** Function for determining if a given parameter is
   * to be considered as a null value.
   *
   * Just for interal use within this library.
   *
   * Note: Does not allow for user defined definitions
   *       of null.
   *
   * The definiton of 'null' is determined by the
   * logical standards of the programming language,
   * as well as logical null values for primative types.
   *
   * Note: The primative type 'function' is not included yet.
   *
   * @param {any} obj The parameter to be checked.
   *
   * @return {Boolean} True if parameter is null, false otherwise.
   */
    function isNull(obj){
      if(typeof(obj) === 'undefined' || obj === null){  // Not defined variable.
        return true;
      }else if(typeof(obj) === 'string' && obj.length <= 0){ // empty string
        return true;
      }else if(typeof(obj) === 'number' && Number.isNaN(obj)){  // primative type is a number, but is not a correct value.
        return true;
      }else if(typeof(obj) === 'object' && obj === null){  // the null object, empty objects are not considered null.
        return true;
      }else{
        return false; // anything else.
      }
    }
  
    /** Checking number of arguments is pointless since arbitrary number
     *  of arguments can be added via the bind function.
     *
     * @param {any} obj The parameter to check.
     *
     * @return {Boolean} True if function, false otherwise.
     */
    function isFunction(obj){
      if(!isNull(obj) && typeof(obj) === 'function'){
        return true;
      }else{
        return false;
      }
    }

    /** Checks prototype chain to see if a given class is a subclass of
     * another given class.
     * 
     * @param {*} subcls  The Class that is supposed to be the subclass.
     * @param {*} cls     The Class that is supposed to be Parent class
     * @returns           True if the subcls variable is a sub class of the cls variable
     */
    function isSubClass(subcls, cls){
      if(isFunction(subcls) && isFunction(cls)){
        let cur = subcls.__proto__;
        while(!isNull(cur)){
          if(cur == cls){
            return true;
          }else{
            cur = cur.__proto__;
          }
        }
        return false;
      }else{
        return false;
      }
    }
  
    /** Checks if a given parameter is a boolean.
     *
     * Generally reccomended to use the satization function toBoolean()
     * instead of this simple validation function.
     *
     * However, there are instances when a validation might be more appropiate
     * than a santization.
     *
     * @param {any} obj The parameter to check.
     *
     * @return {Boolean} True if obj is a boolean, false otherwise.
     */
    function isBoolean(obj){
      if(!isNull(obj) && typeof(obj) === 'boolean'){
        return true;
      }else{
        return false;
      }
    }
  
    /** Converts a given parameter to a Boolean
     * using either a custom function or the
     * default Boolean() function.
     *
     * @param {any} obj The parameter to convert
     * @param {Function} [convertFunc=null] The optional custom convert function to use.
     *
     * @return {Boolean} The converted Boolean value.
     */
    function toBoolean(obj, convertFunc=null){
      if(isFunction(convertFunc)){
        obj = Boolean(convertFunc(obj));
      }
      if(isNull(obj)){
        return false;
      }else{
        return Boolean(obj);
      }
    }
  
    /** Determines if a given parameter is a Number.
     *
     * Note: The conditionFunc must return a Boolean in order to work propperly.
     *
     * @param {any} obj The parameter to check.
     * @param {Function} [conditionFunc=null] Optional additional condition that obj must satisfy.
     *
     * @return {Boolean) True if given parameter is a Number that satisfies any optional conditions, false otherwise.
     */
    function isNumber(obj, conditionFunc=null){
      if(!isNull(obj) && typeof(obj) === 'number'){
        if(isFunction(conditionFunc)){
          return toBoolean(obj, conditionFunc);
        }else if(isNull(conditionFunc)){
          return true;
        }else{
          return false; // bad input from the conditionFunc parameter.
        }
      }else{
        return false;
      }
    }
  
    /** Determines if a given parameter is an Integer.
     *
     * Separate from the isNumber() function for ease of use and clarity of code.
     *
     * Note: The conditionFunc must return a Boolean in order to work propperly.
     *
     * @param {any} obj The parameter to check.
     * @param {Function} [conditionFunc=null] Optional additional condition that obj must satisfy.
     *
     * @return {Boolean} True if the given parameter is an Integer which satisfies any optional conditions, false otherwise.
     */
    function isInteger(obj, conditionFunc=null){
      if(isNumber(obj) && Number.isInteger(obj)){
        if(isFunction(conditionFunc)){
          return toBoolean(obj, conditionFunc);
        }else if(isNull(conditionFunc)){
          return true;
        }else{
          return false; // bad input from the conditionFunc parameter.
        }
      }else{
        return false;
      }
    }

    function isPositiveInteger(obj, zeroFlag=true){
      return (isInteger(obj, function(val){
        if(toBoolean(zeroFlag)){
          return (val >= 0);
        }else{
          return (val > 0);
        }
      }));
    }
  
    /** Determines if a given parameter is an Object
     * Optionally can also check if the object satisfies the
     * the following conditions:-
     *  1) keys = Array of property names
     *  2) keys = A Class
     *
     * @param {any} obj The given paramater to check.
     * @param {Array<String>/Class} [keys=null] The optional check to perform.
     *
     * @return {Boolean} True if the given parameter is an object that satisfies the given conditons, false otherwise.
     */
    function isObject(obj, keys=null){
      if(!isNull(obj) && typeof(obj) === 'object'){
        if(isNull(keys)){
          return true;  // basic object.
        }else if(isArray(keys)){  // List of necessary properties
          for(let i = 0; i < keys.length; i++){
            if(obj.hasOwnProperty(keys[i]) || !isNull(obj[keys[i]])){
              continue;
            }else{
              return false;
            }
          }
          return true;
        }else if(isFunction(keys) && obj instanceof keys){  // Class definition of object.
          return true;
        }else{  // bad input for the keys parameter.
          return false;
        }
      }else{
        return false;
      }
    }
  
    /** Checks if a given parameter is an Array that is at least as big as
     * a given size.
     *
     * Note: This was programmed in such a way that it can be used to check
     * any object that has a 'length' parameter, such as array-like objects as HTMLCollection
     * objects returned by DOM methods.
     *
     * @param {any} obj The parameter to check.
     * @param {Integer} [size=1] The minimum allowed length of the array. Default size is 1.
     *
     * @return {Boolean} True if the array is at least the given size, false otherwise.
     */
    function isArray(obj, size=1){
      if(isObject(obj) && obj.hasOwnProperty("length") && isInteger(obj.length) && isInteger(size) && size >= 0 && obj.length >= 0 && obj.length >= size){
        return true;
      }else{
        return false;
      }
    }
  
    /** Determines if a given parameter is a string,
     * Optionally determines if that parameter is a string
     * that is either equal to another given string or satisfies
     * a given RegExp.
     *
     * Note: Does not work with empty strings since they are considered
     * to be 'null' strings.
     *
     * If employing the optional check, the whole check will fail
     * if the regex parameter is not one of the following types:-
     *  1) String
     *  2) RegExp
     *  3) Null
     *
     * @param {any} obj The parameter to check.
     * @param {String/Regex} [regex=null] The optional check.
     *
     * @return {Boolean} True if the given parameter is a non-empty
     *                   string, that satisifies the optional check,
     *                   false otherwise.
     */
    function isString(obj, regex=null){
      if(!isNull(obj) && typeof(obj) === 'string'){
        if(isNull(regex)){
          return true;
        }else if(isObject(regex, RegExp)){ // regex parameter is a Regex Object.
          return toBoolean(regex.test(obj));
        }else if(isString(regex)){  // regex parameter is a string
          return toBoolean(obj == regex);
        }else{
          return false; // regex parameter is an unexpected value.
        }
      }else{
        return false;
      }
    }
  
    /** Specifically tests if a given parameter is an empty string.
     * Not to be used in conjunction with isString, but only when
     * a specifcally empty string is required.
     *
     * @param {any} obj The parameter to check.
     *
     * @return {Boolean} True if the given parameter is an empty string, false otherwise.
     */
    function isEmptyString(obj){
      return typeof(obj) === 'string' && !isString(obj);
    }
  
    /* Functions exposed to the public (or to the utils scope) by this library. */
    return {
      'isString': isString,
      'isObject': isObject,
      'isNumber': isNumber,
      'isInteger': isInteger,
      'isArray': isArray,
      'isFunction': isFunction,
      'isBoolean': isBoolean,
      'toBoolean': toBoolean,
      'isEmptyString': isEmptyString,
      'isPositiveInteger': isPositiveInteger,
      'isSubClass': isSubClass,
      'isNull': isNull
    }
  
  }();