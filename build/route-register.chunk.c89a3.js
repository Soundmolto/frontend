webpackJsonp([9],{"3JgR":function(t){t.exports={home:"home__3rhO9",card:"card__o7VB3",cardHeader:"cardHeader__5BBot",cardBody:"cardBody__1cD14",buttonContainer:"buttonContainer__18oBr"}},"9kk2":function(t,e,n){"use strict";function r(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function r(o,a){try{var c=e[o](a),i=c.value}catch(t){return void n(t)}if(!c.done)return Promise.resolve(i).then(function(t){r("next",t)},function(t){r("throw",t)});t(i)}return r("next")})}}function o(){return localStorage.clear(),{type:g.a.LOADING}}function a(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function r(o,a){try{var c=e[o](a),i=c.value}catch(t){return void n(t)}if(!c.done)return Promise.resolve(i).then(function(t){r("next",t)},function(t){r("throw",t)});t(i)}return r("next")})}}function c(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var u=n("aIIw"),s=n.n(u),l=n("KM04"),f=n("E/bI"),p=n("sJaT"),d=n.n(p),h=n("Cv2I"),b=n.n(h),m=n("7/cg"),y=n.n(m),v=n("gbHP"),_=n.n(v),O=(n("VFUX"),n("fitr")),g=n("CfhC"),j=n("/QC5"),w=function(){var t=r(s.a.mark(function t(e,n){var r,o,a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r={},t.prev=1,t.next=4,fetch(O.a+"/register",{body:JSON.stringify(e),method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"}});case 4:return o=t.sent,t.next=7,o.json();case 7:if(a=t.sent,200!==o.status){t.next=12;break}r={type:g.a.SUCCESSFULLY_LOGGED_IN,payload:a},t.next=13;break;case 12:throw new Error(a.error);case 13:t.next=18;break;case 15:t.prev=15,t.t0=t.catch(1),r={type:g.a.FAILED_REGISTER,payload:{error:t.t0.message}};case 18:return t.prev=18,t.abrupt("return",n(r));case 21:case"end":return t.stop()}},t,this,[[1,15,18,21]])}));return function(){return t.apply(this,arguments)}}(),C=(n("UlEV"),n("aqQ4"),n("qKn3"),n("3JgR")),P=n.n(C);n.d(e,"default",function(){return M});var E,N,x=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},k={},I=Object(l.h)("div",{class:"header"},Object(l.h)("h1",null,"Register")),S=Object(l.h)(_.a,{reversed:!0,indeterminate:!0}),M=(E=Object(f.b)(function(t){return t.auth}))(N=function(t){function e(){return c(this,t.apply(this,arguments))}return i(e,t),e.prototype.onLogin=function(){function t(){return e.apply(this,arguments)}var e=a(s.a.mark(function t(e){var n;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.preventDefault(),n=this.props.dispatch,n(o()),w(k,n,function(){return k={}});case 4:case"end":return t.stop()}},t,this)}));return t}(),e.prototype.onEmailChange=function(t){k=x({},k,{email:t.currentTarget.value||""})},e.prototype.onPasswordChange=function(t){k=x({},k,{password:t.currentTarget.value||""})},e.prototype.render=function(t){var e=t.loading,n=t.logged_in,r=t.error,o=t.errorMessage;return!0===n&&Object(j.d)("/",!0),Object(l.h)("div",null,I,Object(l.h)("div",{class:P.a.home},Object(l.h)(d.a,{className:P.a.card},Object(l.h)("form",{class:P.a.cardBody,onSubmit:this.onLogin.bind(this)},Object(l.h)(b.a,{label:"Enter your email address",type:"email",autofocus:!0,onChange:this.onEmailChange.bind(this),key:"registration-email"}),Object(l.h)(b.a,{type:"password",label:"Enter a password",onChange:this.onPasswordChange.bind(this),key:"registration-password"}),Object(l.h)("div",{className:P.a.buttonContainer},Object(l.h)(y.a,{raised:!0,onClick:this.onLogin.bind(this),type:"submit"},!n&&!e&&"Register",!n&&e&&S),r&&null!=o&&Object(l.h)("div",{className:"error-message"},o))))))},e}(l.Component))||N},UlEV:function(){},sJaT:function(t,e,n){"use strict";function r(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function a(t){return t&&t.__esModule?t:{default:t}}function c(){return c=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},c.apply(this,arguments)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=a(n("7/cg")),u=a(n("MeGi")),s=a(n("lhA9")),l=n("KM04"),f=function(t){function e(){var e=r(this,t.call(this));return e.componentName="card",e._mdcProps=["stroked"],e}return o(e,t),e}(s.default),p=function(t){function e(){var e=r(this,t.call(this));return e.componentName="card__actions",e._mdcProps=["full-bleed"],e}return o(e,t),e}(s.default),d=function(t){function e(){var e=r(this,t.call(this));return e.componentName="card__media",e._mdcProps=["square","16-9"],e}return o(e,t),e}(s.default),h=function(t){function e(){var e=r(this,t.call(this));return e.componentName="card__action",e}return o(e,t),e.prototype.materialDom=function(t){return(0,l.h)("button",c({className:"mdc-button mdc-card__action--button"},t,{ref:this.setControlRef}),t.children)},e}(i.default),b=function(t){function e(){var e=r(this,t.call(this));return e.componentName="card__action-icons",e}return o(e,t),e}(s.default),m=function(t){function e(){var e=r(this,t.call(this));return e.componentName="card__action",e}return o(e,t),e.prototype.materialDom=function(e){return e.className="mdc-card__action--icon",t.prototype.materialDom.call(this,e)},e}(u.default),y=function(t){function e(){var e=r(this,t.call(this));return e.componentName="card__media-content",e}return o(e,t),e}(s.default);f.Actions=p,f.ActionButton=h,f.ActionIcons=b,f.ActionIcon=m,f.Media=d,f.CardMediaContent=y,e.default=f}});
//# sourceMappingURL=route-register.chunk.c89a3.js.map