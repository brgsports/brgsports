function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _decorate(decorators, factory, superClass, mixins) {
  var api = _getDecoratorsApi();
  if (mixins) {
    for (var i = 0; i < mixins.length; i++) {
      api = mixins[i](api);
    }
  }
  var r = factory(function initialize(O) {
    api.initializeInstanceElements(O, decorated.elements);
  }, superClass);
  var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
  api.initializeClassElements(r.F, decorated.elements);
  return api.runClassFinishers(r.F, decorated.finishers);
}
function _getDecoratorsApi() {
  _getDecoratorsApi = function () {
    return api;
  };
  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
      var proto = F.prototype;
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          var placement = element.placement;
          if (element.kind === kind && (placement === "static" || placement === "prototype")) {
            var receiver = placement === "static" ? F : proto;
            this.defineClassElement(receiver, element);
          }
        }, this);
      }, this);
    },
    defineClassElement: function (receiver, element) {
      var descriptor = element.descriptor;
      if (element.kind === "field") {
        var initializer = element.initializer;
        descriptor = {
          enumerable: descriptor.enumerable,
          writable: descriptor.writable,
          configurable: descriptor.configurable,
          value: initializer === void 0 ? void 0 : initializer.call(receiver)
        };
      }
      Object.defineProperty(receiver, element.key, descriptor);
    },
    decorateClass: function (elements, decorators) {
      var newElements = [];
      var finishers = [];
      var placements = {
        static: [],
        prototype: [],
        own: []
      };
      elements.forEach(function (element) {
        this.addElementPlacement(element, placements);
      }, this);
      elements.forEach(function (element) {
        if (!_hasDecorators(element)) return newElements.push(element);
        var elementFinishersExtras = this.decorateElement(element, placements);
        newElements.push(elementFinishersExtras.element);
        newElements.push.apply(newElements, elementFinishersExtras.extras);
        finishers.push.apply(finishers, elementFinishersExtras.finishers);
      }, this);
      if (!decorators) {
        return {
          elements: newElements,
          finishers: finishers
        };
      }
      var result = this.decorateConstructor(newElements, decorators);
      finishers.push.apply(finishers, result.finishers);
      result.finishers = finishers;
      return result;
    },
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];
      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }
      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
      var extras = [];
      var finishers = [];
      for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
        var keys = placements[element.placement];
        keys.splice(keys.indexOf(element.key), 1);
        var elementObject = this.fromElementDescriptor(element);
        var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
        element = elementFinisherExtras.element;
        this.addElementPlacement(element, placements);
        if (elementFinisherExtras.finisher) {
          finishers.push(elementFinisherExtras.finisher);
        }
        var newExtras = elementFinisherExtras.extras;
        if (newExtras) {
          for (var j = 0; j < newExtras.length; j++) {
            this.addElementPlacement(newExtras[j], placements);
          }
          extras.push.apply(extras, newExtras);
        }
      }
      return {
        element: element,
        finishers: finishers,
        extras: extras
      };
    },
    decorateConstructor: function (elements, decorators) {
      var finishers = [];
      for (var i = decorators.length - 1; i >= 0; i--) {
        var obj = this.fromClassDescriptor(elements);
        var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);
        if (elementsAndFinisher.finisher !== undefined) {
          finishers.push(elementsAndFinisher.finisher);
        }
        if (elementsAndFinisher.elements !== undefined) {
          elements = elementsAndFinisher.elements;
          for (var j = 0; j < elements.length - 1; j++) {
            for (var k = j + 1; k < elements.length; k++) {
              if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                throw new TypeError("Duplicated element (" + elements[j].key + ")");
              }
            }
          }
        }
      }
      return {
        elements: elements,
        finishers: finishers
      };
    },
    fromElementDescriptor: function (element) {
      var obj = {
        kind: element.kind,
        key: element.key,
        placement: element.placement,
        descriptor: element.descriptor
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      if (element.kind === "field") obj.initializer = element.initializer;
      return obj;
    },
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
      var kind = String(elementObject.kind);
      if (kind !== "method" && kind !== "field") {
        throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
      }
      var key = _toPropertyKey(elementObject.key);
      var placement = String(elementObject.placement);
      if (placement !== "static" && placement !== "prototype" && placement !== "own") {
        throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
      }
      var descriptor = elementObject.descriptor;
      this.disallowProperty(elementObject, "elements", "An element descriptor");
      var element = {
        kind: kind,
        key: key,
        placement: placement,
        descriptor: Object.assign({}, descriptor)
      };
      if (kind !== "field") {
        this.disallowProperty(elementObject, "initializer", "A method descriptor");
      } else {
        this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
        this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
        element.initializer = elementObject.initializer;
      }
      return element;
    },
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);
      var finisher = _optionalCallableProperty(elementObject, "finisher");
      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
      var obj = {
        kind: "class",
        elements: elements.map(this.fromElementDescriptor, this)
      };
      var desc = {
        value: "Descriptor",
        configurable: true
      };
      Object.defineProperty(obj, Symbol.toStringTag, desc);
      return obj;
    },
    toClassDescriptor: function (obj) {
      var kind = String(obj.kind);
      if (kind !== "class") {
        throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
      }
      this.disallowProperty(obj, "key", "A class descriptor");
      this.disallowProperty(obj, "placement", "A class descriptor");
      this.disallowProperty(obj, "descriptor", "A class descriptor");
      this.disallowProperty(obj, "initializer", "A class descriptor");
      this.disallowProperty(obj, "extras", "A class descriptor");
      var finisher = _optionalCallableProperty(obj, "finisher");
      var elements = this.toElementDescriptors(obj.elements);
      return {
        elements: elements,
        finisher: finisher
      };
    },
    runClassFinishers: function (constructor, finishers) {
      for (var i = 0; i < finishers.length; i++) {
        var newConstructor = (0, finishers[i])(constructor);
        if (newConstructor !== undefined) {
          if (typeof newConstructor !== "function") {
            throw new TypeError("Finishers must return a constructor.");
          }
          constructor = newConstructor;
        }
      }
      return constructor;
    },
    disallowProperty: function (obj, name, objectType) {
      if (obj[name] !== undefined) {
        throw new TypeError(objectType + " can't have a ." + name + " property.");
      }
    }
  };
  return api;
}
function _createElementDescriptor(def) {
  var key = _toPropertyKey(def.key);
  var descriptor;
  if (def.kind === "method") {
    descriptor = {
      value: def.value,
      writable: true,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "get") {
    descriptor = {
      get: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "set") {
    descriptor = {
      set: def.value,
      configurable: true,
      enumerable: false
    };
  } else if (def.kind === "field") {
    descriptor = {
      configurable: true,
      writable: true,
      enumerable: true
    };
  }
  var element = {
    kind: def.kind === "field" ? "field" : "method",
    key: key,
    placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
    descriptor: descriptor
  };
  if (def.decorators) element.decorators = def.decorators;
  if (def.kind === "field") element.initializer = def.value;
  return element;
}
function _coalesceGetterSetter(element, other) {
  if (element.descriptor.get !== undefined) {
    other.descriptor.get = element.descriptor.get;
  } else {
    other.descriptor.set = element.descriptor.set;
  }
}
function _coalesceClassElements(elements) {
  var newElements = [];
  var isSameElement = function (other) {
    return other.kind === "method" && other.key === element.key && other.placement === element.placement;
  };
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var other;
    if (element.kind === "method" && (other = newElements.find(isSameElement))) {
      if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
        if (_hasDecorators(element) || _hasDecorators(other)) {
          throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
        }
        other.descriptor = element.descriptor;
      } else {
        if (_hasDecorators(element)) {
          if (_hasDecorators(other)) {
            throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
          }
          other.decorators = element.decorators;
        }
        _coalesceGetterSetter(element, other);
      }
    } else {
      newElements.push(element);
    }
  }
  return newElements;
}
function _hasDecorators(element) {
  return element.decorators && element.decorators.length;
}
function _isDataDescriptor(desc) {
  return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
}
function _optionalCallableProperty(obj, name) {
  var value = obj[name];
  if (value !== undefined && typeof value !== "function") {
    throw new TypeError("Expected '" + name + "' to be a function");
  }
  return value;
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window,e$4=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$5=new WeakMap;let o$3 = class o{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$5.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$2=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$4?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$1.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$3=window,r$1=e$3.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$3.reactiveElementPolyfillSupport,n$4={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$4,reflect:!1,hasChanged:a$1},d$1="finalized";let u$1 = class u extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return !1;this[d$1]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$4).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$4;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}};u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$3.reactiveElementVersions)&&void 0!==s$2?s$2:e$3.reactiveElementVersions=[]).push("1.6.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i$1=window,s$1=i$1.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$3=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$3,h=`<${l$1}>`,r=document,u=()=>r.createComment(""),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$2?e$2.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,e=[];let l,r=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let d,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(l=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=l?l:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,d=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,l=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";r+=u===f?s+h:v>=0?(e.push(d),s.slice(0,v)+o$1+s.slice(v)+n$3+w):s+n$3+(-2===v?(e.push(void 0),i):w);}return [P(t,r+(t[s]||"<?>")+(2===i?"</svg>":"")),e]};class N{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,d=0;const c=t.length-1,v=this.parts,[a,f]=V(t,i);if(this.el=N.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$3)){const s=f[d++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$1).split(n$3),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?H:"?"===i[1]?L:"@"===i[1]?z:k});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$3),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],u()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],u());}}}else if(8===h.nodeType)if(h.data===l$1)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$3,t+1));)v.push({type:7,index:r}),t+=n$3.length-1;}r++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=S(t,r._$AS(t,i.values),r,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,u=e[0];for(;void 0!==u;){if(l===u.index){let i;2===u.type?i=new R(n,n.nextSibling,this,t):1===u.type?i=new u.ctor(n,u.name,u.strings,this,t):6===u.type&&(i=new Z(n,this,t)),this._$AV.push(i),u=e[++h];}l!==(null==u?void 0:u.index)&&(n=C.nextNode(),l++);}return C.currentNode=r,o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=N.createElement(P(e.h,e.h[0]),this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new M(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new N(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new R(this.k(u()),this.k(u()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class k{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=S(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=S(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name);}}class z extends k{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const B=i$1.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i$1.litHtmlVersions)&&void 0!==t?t:i$1.litHtmlVersions=[]).push("2.8.0");const D=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new R(i.insertBefore(u(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$2=globalThis.litElementPolyfillSupport;null==n$2||n$2({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}},e=(i,e,n)=>{e.constructor.createProperty(n,i);};function n$1(n){return (t,o)=>void 0!==o?e(n,t,o):i(n,t)}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

let AndysTable = _decorate([e$1('andys-table')], function (_initialize, _LitElement) {
  class AndysTable extends _LitElement {
    constructor(...args) {
      super(...args);
      _initialize(this);
    }
  }
  return {
    F: AndysTable,
    d: [{
      kind: "field",
      static: true,
      key: "baseStyle",
      value() {
        return i$2`
  :host {
    height: 100%;
    width: 100%;
    display: block;
  }
`;
      }
    }, {
      kind: "field",
      static: true,
      key: "NacTableStyles",
      value() {
        return i$2`
.table-wrapper {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ccc;
}
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-family: inherit;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  background-color: #fff;
}

th,
td {
  padding: 0 0.5rem;
  border-top: 1px solid #ccc;
  text-align: left;
  vertical-align: middle;
  position: relative;
}

th {
  font-weight: bold;
  height: 3.5rem;
  text-transform: capitalize;
  border-top: none;
}
thead tr {
  background-color: #fff !important;
}

tr {
  background-color: #fff;
  height: 3.25rem;
}

tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

th {
  font-weight: bold;
  cursor: pointer;
}

.table-row.selected {
  background-color: rgba(25, 118, 210, 0.08);
}

.table-row.selected:hover {
  background-color: rgba(25, 118, 210, 0.12);
}

.table-cell-value {
  visibility: visible;
}

.table-row.edit .table-cell-value {
  visibility: hidden;
}

.table-cell-input {
  position: absolute;
  left: 4px;
  right: 4px;
  top: 4px;
  bottom: 4px;
  padding: 0 0.5rem;
  font-size: inherit;
  color: inherit;
}

.dsc {
  transform: rotate(180deg);
}

.flex-item {
  display: flex;
}

.top-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.margin-left-4 {
  margin-left: 0.25rem;
}

.opacity {
  opacity: 1;
}

/*  search start*/
.search-wrapper {
  height: 3.5rem;
  width: 100%;
  max-width: 26.25rem;
  position: relative;
}
.search-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1rem;
  color: rgba(0, 0, 0, 0.54);
}
.search-input {
  height: 3.5rem;
  width: 100%;
  padding: 1.03125rem 0.875rem;
  padding-left: 3rem;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
}

.input-styled {
  border-radius: 0.25rem;
  box-sizing: border-box;
  border: 1px solid;
  border-color: rgba(0, 0, 0, 0.23);
  outline: none;
}

.input-styled:hover {
  border-color: rgba(0, 0, 0, 0.87);
}

.input-styled:focus {
  box-shadow: 0 0 0 1px rgb(25, 118, 210);
  border-color: rgb(25, 118, 210);
}
/* search end */

/* Pagination-start */
.pagination {
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.875rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 0;
  font-family: inherit;
}
.pagination-total {
  display: inline-flex;
  align-items: center;
  margin-right: 2rem;
}
.pagination-button {
  border: 0;
  outline: 0;
  padding: 0.5rem;
  background-color: transparent;
  border-radius: 50%;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.54);
}

.pagination-button:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.pagination-button:disabled {
  cursor: default;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.3);
}


@media (max-width: 872px) {
  .top-panel {
    flex-direction: column;
  }
  .search-wrapper {
    margin-bottom: 1rem;
  }
}


@media (max-width: 767px) {
  th:not(:nth-of-type(1)):not(:nth-of-type(2)):not(:nth-of-type(3)),
  td:not(:nth-of-type(1)):not(:nth-of-type(2)):not(:nth-of-type(3)) {
    display: none;
  }
}
`;
      }
    }, {
      kind: "field",
      static: true,
      key: "styles",
      value() {
        return [AndysTable.baseStyle, AndysTable.NacTableStyles];
      }
    }, {
      kind: "field",
      decorators: [n$1({
        type: String
      })],
      key: "collection",
      value() {
        return '';
      }
    }, {
      kind: "field",
      decorators: [n$1({
        type: String
      })],
      key: "readonly",
      value() {
        return false;
      }
    }, {
      kind: "method",
      static: true,
      key: "getMetaConfig",
      value: function getMetaConfig() {
        // plugin contract information
        return {
          controlName: 'Editable Table',
          description: 'Editable Table for NAC',
          groupName: 'Nintex Government',
          fallbackDisableSubmit: false,
          standardProperties: {
            readOnly: false,
            required: false,
            description: true
          },
          version: '1.0',
          properties: {
            collection: {
              type: 'string',
              title: 'JSONData to be surfaced or displayed'
            },
            value: {
              type: 'string',
              title: 'updatedJson',
              isValueField: true
            }
          }
        };
      }
    }, {
      kind: "field",
      key: "data",
      value() {
        return [];
      }
    }, {
      kind: "field",
      key: "editCell",
      value() {
        return null;
      }
    }, {
      kind: "field",
      key: "pageData",
      value() {
        return [];
      }
    }, {
      kind: "field",
      key: "totalPages",
      value() {
        return 1;
      }
    }, {
      kind: "field",
      key: "currentPage",
      value() {
        return 1;
      }
    }, {
      kind: "field",
      key: "pageSize",
      value() {
        return 10;
      }
    }, {
      kind: "field",
      key: "searchText",
      value() {
        return "";
      }
    }, {
      kind: "field",
      key: "tableSort",
      value() {
        return {
          field: "",
          direction: "asc"
        };
      }
    }, {
      kind: "field",
      key: "selectedRow",
      value() {
        return null;
      }
    }, {
      kind: "field",
      key: "editMode",
      value() {
        return false;
      }
    }, {
      kind: "field",
      key: "tempEditRowData",
      value() {
        return null;
      }
    }, {
      kind: "get",
      key: "filteredData",
      value:
      // @property({ type: Boolean })
      // readOnly = false;

      function filteredData() {
        return this.data.filter(item => {
          return Object.values(item).map(val => String(val)).some(val => val.toLowerCase().includes(this.searchText.toLowerCase()));
        });
      }
    }, {
      kind: "get",
      key: "sortedData",
      value: function sortedData() {
        const {
          field,
          direction
        } = this.tableSort;
        return this.filteredData.sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          if (aVal < bVal) return direction === "asc" ? -1 : 1;
          if (aVal > bVal) return direction === "asc" ? 1 : -1;
          return 0;
        });
      }
    }, {
      kind: "get",
      key: "columns",
      value: function columns() {
        const sampleRow = this.data[0] || {};
        return Object.keys(sampleRow).map(field => {
          return {
            label: field,
            field: field
          };
        });
      }
    }, {
      kind: "method",
      key: "updated",
      value: function updated(changedProps) {
        if (changedProps.has("collection")) {
          try {
            this.data = JSON.parse(this.collection);
            this.updatePageData();
          } catch (e) {
            console.error("Error parsing table data: ", e);
          }
        }
      }
    }, {
      kind: "method",
      key: "unselect",
      value: function unselect() {
        this.selectedRow = null;
        this.editMode = false;
        this.tempEditRowData = null;
        this.editCell = null;
      }
    }, {
      kind: "method",
      key: "onSortClick",
      value: function onSortClick(field) {
        const {
          direction
        } = this.tableSort;
        this.unselect();
        if (this.tableSort.field === field) {
          this.tableSort.direction = direction === "asc" ? "desc" : "asc";
        } else {
          this.tableSort = {
            field: field,
            direction: "asc"
          };
        }
        this.currentPage = 1;
        this.updatePageData();
      }
    }, {
      kind: "method",
      key: "onPageChange",
      value: function onPageChange(page) {
        this.unselect();
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.updatePageData();
        }
      }

      // Handle edit event for a cell
    }, {
      kind: "method",
      key: "onCellEdit",
      value: function onCellEdit({
        field,
        value
      }) {
        if (this.editCell) {
          const found = this.pageData.find(item => item === this.editCell?.row);
          if (!found) return;
          const editedRow = {
            ...found
          };
          editedRow[field] = value;
          this.tempEditRowData = editedRow;
        }
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        return x`
      <div class="top-panel">
        ${this.renderSearch()} ${this.readonly ? null : this.renderToolbar()}
      </div>
      <br />
      ${this.renderTable()}
    `;
      }
    }, {
      kind: "method",
      key: "renderSearch",
      value: function renderSearch() {
        return x`<div class="search-wrapper">
      <svg
        class="search-icon"
        height="24px"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M9.5,4C13.09,4 16,6.91 16,10.5C16,12.12 15.41,13.6 14.43,14.73L20.08,20.38L19.37,21.09L13.72,15.44C12.59,16.41 11.11,17 9.5,17C5.91,17 3,14.09 3,10.5C3,6.91 5.91,4 9.5,4M9.5,5C6.46,5 4,7.46 4,10.5C4,13.54 6.46,16 9.5,16C12.54,16 15,13.54 15,10.5C15,7.46 12.54,5 9.5,5Z"
        />
      </svg>
      <input
        class="search-input input-styled"
        id="search-input"
        placeholder="Search..."

        @input=${event => {
          this.searchText = event.target.value;
          this.updatePageData();
        }}
      />
    </div> `;
      }
    }, {
      kind: "method",
      key: "renderToolbar",
      value: function renderToolbar() {
        return x`
      <lit-toolbar
        @add-row="${this.onAddRow}"
        @edit-row="${this.onEditRow}"
        @delete-row="${this.onDeleteRow}"
        @save-row="${this.onSaveRow}"
        @discard-row="${this.onDiscardRow}"
        .editMode="${this.editMode}"
        .hasSelectedRow="${!!this.selectedRow}"
        
      ></lit-toolbar>
    `;
      }
    }, {
      kind: "method",
      key: "renderTable",
      value: function renderTable() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.pageData = this.sortedData.slice(start, end);
        return x`

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              
              ${this.columns.map(column => x`
                  <th @click="${() => this.onSortClick(column.field)}">
                    ${x`<span class="flex-item">
                      ${column.label}
                      ${this.tableSort.direction === "asc" ? x`<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            height="18px"
                            width="18px"
                            opacity="0"
                            class="margin-left-4 ${this.tableSort.field === column.field ? "opacity" : ""}"
                          >
                            <path
                              d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"
                            />
                          </svg>` : x`<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            height="18px"
                            width="18px"
                            opacity="0"
                            class="margin-left-4 dsc ${this.tableSort.field === column.field ? "opacity" : ""}"
                          >
                            <path
                              d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"
                            />
                          </svg>`}
                    </span>`}
                  </th>
                `)}
            </tr>
          </thead>
          <tbody>
            ${this.pageData.map(item => x`
              
                <tr
                  @click="${() => {
          if (this.readonly) return;
          if (this.editMode && this.selectedRow !== item) {
            this.unselect();
          }
          if (this.selectedRow === item && !this.editMode) {
            this.selectedRow = null;
          } else {
            this.selectedRow = item;
          }
          this.requestUpdate();
        }}"
                  class="table-row ${this.editMode && this.selectedRow === item ? "edit" : ""} ${this.selectedRow === item ? "selected" : ""}"
                >
                  ${this.columns.map(column => x`
                      <td>
                        ${this.editMode && this.selectedRow === item ? x`<input
                              type="text"
                              .value="${item[column.field]}"
                              class="table-cell-input input-styled"
                              @input="${event => this.onCellEdit({
          field: column.field,
          value: event.target.value
        })}"
                              @focus="${() => {
          this.editCell = {
            columnName: column.field,
            row: item
          };
          this.requestUpdate();
        }}"
                              @blur="${() => {
          if (this.editCell?.row === item) {
            this.editCell = {
              columnName: column.field,
              row: item
            };
            this.requestUpdate();
          }
        }}"
                              ?disabled=${!!this.readonly}
                            />` : x`<span class="table-cell-value"
                              >${item[column.field]}</span
                            >`}
                      </td>
                    `)}
                </tr>
              `)}
          </tbody>
        </table>
      </div>
      ${this.onLoad(this.collection)}                    
      ${this.totalPages > 1 ? this.renderPagination() : null}
      
    `;
      }
    }, {
      kind: "method",
      key: "renderPagination",
      value: function renderPagination() {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(start + this.pageSize - 1, this.filteredData.length);
        const total = this.filteredData.length;
        return x`
      <div class="pagination">
        <span class="pagination-total">${start}-${end} of ${total}</span>
        <button
          class="pagination-button"
          @click="${() => this.onPageChange(1)}"
          ?disabled="${this.currentPage === 1}"
        >
          <svg
            height="24px"
            width="24px"
            fill="currentColor"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path
              d="M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"
            ></path>
          </svg>
        </button>
        <button
          class="pagination-button"
          @click="${() => this.onPageChange(this.currentPage - 1)}"
          ?disabled="${this.currentPage === 1}"
        >
          <svg
            height="24px"
            width="24px"
            fill="currentColor"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path
              d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
            ></path>
          </svg>
        </button>
        <button
          class="pagination-button"
          @click="${() => this.onPageChange(this.currentPage + 1)}"
          ?disabled="${this.currentPage === this.totalPages}"
        >
          <svg
            height="24px"
            width="24px"
            fill="currentColor"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path
              d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
            ></path>
          </svg>
        </button>
        <button
          class="pagination-button"
          @click="${() => this.onPageChange(this.totalPages)}"
          ?disabled="${this.currentPage === this.totalPages}"
        >
          <svg
            height="24px"
            width="24px"
            fill="currentColor"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"
            ></path>
          </svg>
        </button>
      </div>
      <script>
        
  const nacTable = document.querySelector("andys-table");

  
</script>
    `;
      }
    }, {
      kind: "method",
      key: "saveSelectedRow",
      value: function saveSelectedRow() {
        if (!this.selectedRow) return;
        const editedRow = this.data.find(item => item === this.selectedRow);
        if (editedRow) {
          Object.assign(editedRow, this.tempEditRowData);
          this.dispatchEvent(new CustomEvent("change", {
            detail: {
              collection: JSON.stringify(this.data)
            }
          }));
        }
      }
    }, {
      kind: "method",
      key: "updatePageData",
      value: function updatePageData() {
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
        if (this.totalPages < 1) {
          this.currentPage = 1;
        }
        this.requestUpdate();
      }
    }, {
      kind: "method",
      key: "onAddRow",
      value: function onAddRow() {
        this.searchText = "";
        this.tableSort = {
          field: "",
          direction: "asc"
        };
        const searchInput = this.shadowRoot?.querySelector("#search-input");
        if (searchInput) searchInput.value = "";
        this.updatePageData();
        const newRow = {};
        this.columns.forEach(column => newRow[column.field] = "");
        this.data.push(newRow);
        this.selectedRow = newRow;
        this.editMode = true;
        this.editCell = null;
        this.updatePageData();
        this.currentPage = this.totalPages;
        this.focusInputOnEdit();
      }
    }, {
      kind: "method",
      key: "onEditRow",
      value: function onEditRow() {
        if (this.selectedRow) {
          this.editMode = true;
          this.editCell = {
            columnName: "",
            row: this.selectedRow
          };
          this.requestUpdate();
          this.focusInputOnEdit();
        }
      }
    }, {
      kind: "method",
      key: "onDeleteRow",
      value: function onDeleteRow() {
        if (this.selectedRow) {
          const index = this.data.indexOf(this.selectedRow);
          this.data.splice(index, 1);
          this.unselect();
          this.updatePageData();
          this.dispatchEvent(new CustomEvent("change", {
            detail: {
              collection: JSON.stringify(this.data)
            }
          }));
          this.onChange(this.data);
        }
      }
    }, {
      kind: "method",
      key: "onSaveRow",
      value: function onSaveRow() {
        if (!this.selectedRow) return;
        if (this.editMode) {
          this.editMode = false;
          this.saveSelectedRow();
          this.updatePageData();
          this.onChange(this.data);
        }
      }
    }, {
      kind: "method",
      key: "onDiscardRow",
      value: function onDiscardRow() {
        if (this.selectedRow) {
          const editedRow = this.pageData.find(item => item === this.selectedRow);
          if (editedRow) {
            this.columns.forEach(column => {});
            this.editMode = false;
            this.editCell = null;
            this.requestUpdate();
            this.onChange(this.data);
          }
        }
      }
    }, {
      kind: "method",
      key: "onChange",
      value: function onChange(e) {
        const value = e;
        const args = {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: value
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
      }
    }, {
      kind: "method",
      key: "onLoad",
      value: function onLoad(e) {
        console.info("data: " + this.data);
        var dataCheck = this.data.toString();
        if (dataCheck == null || dataCheck == '') {
          this.onChange(this.collection);
        }
      }
    }, {
      kind: "method",
      key: "focusInputOnEdit",
      value: function focusInputOnEdit() {
        setTimeout(() => {
          const inputElement = this.shadowRoot?.querySelector(".selected")?.querySelector("input");
          if (inputElement) inputElement.focus();
        }, 50);
      }
    }]
  };
}, s);
_decorate([e$1("lit-toolbar")], function (_initialize2, _LitElement2) {
  class LitToolbar extends _LitElement2 {
    constructor(...args) {
      super(...args);
      _initialize2(this);
    }
  }
  return {
    F: LitToolbar,
    d: [{
      kind: "field",
      decorators: [n$1({
        type: Boolean
      })],
      key: "editMode",
      value() {
        return false;
      }
    }, {
      kind: "field",
      decorators: [n$1({
        type: Boolean
      })],
      key: "hasSelectedRow",
      value() {
        return false;
      }
    }, {
      kind: "get",
      static: true,
      key: "styles",
      value: function styles() {
        return i$2`
      :host {
        background-color: rgba(0, 0, 0, 0.04);
        border-radius: 4px;
        width: 100%;
        max-width: 420px;
      }
      .button-wrapper {
        box-sizing: border-box;
        height: 56px;
        padding: 16.5px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      button {
        background-color: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        border: none;
        outline: none;
        padding: 8px;
        margin: 0;
      }

      .delete {
        color: #d32f2f;
      }

      button:hover {
        text-decoration: underline;
      }

      button:disabled {
        text-decoration: none;
        cursor: default;
        color: rgba(0, 0, 0, 0.3);
      }

      button > svg {
        margin-right: 2px;
      }
    `;
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        return x`
      <div class="button-wrapper">
        <button
          @click="${() => this.dispatchEvent(new CustomEvent("add-row"))}"
        >
          <svg
            height="18px"
            width="18px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Add
        </button>
        <button
          @click="${() => this.dispatchEvent(new CustomEvent("edit-row"))}"
          ?disabled="${!this.hasSelectedRow}"
        >
          <svg
            height="18px"
            width="18px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 22 22"
            fill="currentColor"
          >
            <path
              d="M16 2H17V3H18V4H19V5H20V6H19V7H18V8H17V7H16V6H15V5H14V4H15V3H16M12 6H14V7H15V8H16V10H15V11H14V12H13V13H12V14H11V15H10V16H9V17H8V18H7V19H6V20H2V16H3V15H4V14H5V13H6V12H7V11H8V10H9V9H10V8H11V7H12"
            />
          </svg>
          Edit
        </button>
        <button
          @click="${() => this.dispatchEvent(new CustomEvent("discard-row"))}"
          ?disabled="${!this.editMode}"
        >
          <svg
            height="18px"
            fill="currentColor"
            width="18px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M13.5,7A6.5,6.5 0 0,1 20,13.5A6.5,6.5 0 0,1 13.5,20H10V18H13.5C16,18 18,16 18,13.5C18,11 16,9 13.5,9H7.83L10.91,12.09L9.5,13.5L4,8L9.5,2.5L10.92,3.91L7.83,7H13.5M6,18H8V20H6V18Z"
            />
          </svg>

          Discard
        </button>
        <button
          @click="${() => this.dispatchEvent(new CustomEvent("save-row"))}"
          ?disabled="${!this.editMode}"
        >
          <svg
            height="18px"
            fill="currentColor"
            width="18px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M17 3H5C3.9 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H11.81C11.42 20.34 11.17 19.6 11.07 18.84C9.5 18.31 8.66 16.6 9.2 15.03C9.61 13.83 10.73 13 12 13C12.44 13 12.88 13.1 13.28 13.29C15.57 11.5 18.83 11.59 21 13.54V7L17 3M15 9H5V5H15V9M15.75 21L13 18L14.16 16.84L15.75 18.43L19.34 14.84L20.5 16.25L15.75 21"
            />
          </svg>
          Save
        </button>
        <button
          class="delete"
          @click="${() => this.dispatchEvent(new CustomEvent("delete-row"))}"
          ?disabled="${!this.hasSelectedRow}"
        >
          <svg
            height="18px"
            width="18px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
          Delete
        </button>
      </div>
    `;
      }
    }]
  };
}, s);

export { AndysTable };
