!function e(t,n,a){function s(r,o){if(!n[r]){if(!t[r]){var u="function"==typeof require&&require;if(!o&&u)return u(r,!0);if(i)return i(r,!0);var c=new Error("Cannot find module '"+r+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[r]={exports:{}};t[r][0].call(l.exports,function(e){var n=t[r][1][e];return s(n||e)},l,l.exports,e,t,n,a)}return n[r].exports}for(var i="function"==typeof require&&require,r=0;r<a.length;r++)s(a[r]);return s}({1:[function(e,t,n){"use strict";e("./modules/theme/skip-link-focus-fix"),e("./modules/theme/navigation")},{"./modules/theme/navigation":2,"./modules/theme/skip-link-focus-fix":3}],2:[function(e,t,n){"use strict";!function(){function e(){for(var e=this;-1===e.className.indexOf("nav-menu");)"li"===e.tagName.toLowerCase()&&(-1!==e.className.indexOf("focus")?e.className=e.className.replace(" focus",""):e.className+=" focus"),e=e.parentElement}var t,n,a,s,i,r;if((t=document.getElementById("site-navigation"))&&void 0!==(n=t.getElementsByTagName("button")[0])){if(void 0===(a=t.getElementsByTagName("ul")[0]))return void(n.style.display="none");for(a.setAttribute("aria-expanded","false"),-1===a.className.indexOf("nav-menu")&&(a.className+=" nav-menu"),n.onclick=function(){-1!==t.className.indexOf("toggled")?(t.className=t.className.replace(" toggled",""),n.setAttribute("aria-expanded","false"),a.setAttribute("aria-expanded","false")):(t.className+=" toggled",n.setAttribute("aria-expanded","true"),a.setAttribute("aria-expanded","true"))},s=a.getElementsByTagName("a"),i=0,r=s.length;i<r;i++)s[i].addEventListener("focus",e,!0),s[i].addEventListener("blur",e,!0);!function(e){var t,n,a=e.querySelectorAll(".menu-item-has-children > a, .page_item_has_children > a");if("ontouchstart"in window)for(t=function(e){var t,n=this.parentNode;if(n.classList.contains("focus"))n.classList.remove("focus");else{for(e.preventDefault(),t=0;t<n.parentNode.children.length;++t)n!==n.parentNode.children[t]&&n.parentNode.children[t].classList.remove("focus");n.classList.add("focus")}},n=0;n<a.length;++n)a[n].addEventListener("touchstart",t,!1)}(t)}}()},{}],3:[function(e,t,n){"use strict";!function(){/(trident|msie)/i.test(navigator.userAgent)&&document.getElementById&&window.addEventListener&&window.addEventListener("hashchange",function(){var e,t=location.hash.substring(1);/^[A-z0-9_-]+$/.test(t)&&(e=document.getElementById(t))&&(/^(?:a|select|input|button|textarea)$/i.test(e.tagName)||(e.tabIndex=-1),e.focus())},!1)}()},{}]},{},[1]);
//# sourceMappingURL=../maps/main.js.map