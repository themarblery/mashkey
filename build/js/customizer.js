!function t(i,e,n){function o(c,s){if(!e[c]){if(!i[c]){var u="function"==typeof require&&require;if(!s&&u)return u(c,!0);if(r)return r(c,!0);var p=new Error("Cannot find module '"+c+"'");throw p.code="MODULE_NOT_FOUND",p}var f=e[c]={exports:{}};i[c][0].call(f.exports,function(t){var e=i[c][1][t];return o(e||t)},f,f.exports,t,i,e,n)}return e[c].exports}for(var r="function"==typeof require&&require,c=0;c<n.length;c++)o(n[c]);return o}({1:[function(t,i,e){"use strict";!function(t){wp.customize("blogname",function(i){i.bind(function(i){t(".site-title a").text(i)})}),wp.customize("blogdescription",function(i){i.bind(function(i){t(".site-description").text(i)})}),wp.customize("header_textcolor",function(i){i.bind(function(i){"blank"===i?t(".site-title, .site-description").css({clip:"rect(1px, 1px, 1px, 1px)",position:"absolute"}):(t(".site-title, .site-description").css({clip:"auto",position:"relative"}),t(".site-title a, .site-description").css({color:i}))})})}(jQuery)},{}]},{},[1]);
//# sourceMappingURL=../maps/customizer.js.map
