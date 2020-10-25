(this.webpackJsonphomepage=this.webpackJsonphomepage||[]).push([[0],{15:function(e,t,a){e.exports=a(30)},20:function(e,t,a){},21:function(e,t,a){},28:function(e,t,a){},29:function(e,t,a){},30:function(e,t,a){"use strict";a.r(t);var n=a(1),o=a.n(n),r=a(12),l=a.n(r),c=(a(20),a(2)),i=(a(21),a(4)),u=a.n(i),s=(a(22),a(26),a(13)),m=a(14),d=a(0),p=a(3),b=[{name:"Bedroom",icon:o.a.createElement(p.a,null)},{name:"Kitchen",icon:o.a.createElement(p.d,null)},{name:"Shopping",icon:o.a.createElement(p.c,null)}];function f(){return{categories:b,getCategoryIcon:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:24,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"black",n=b.find((function(t){return t.name===e}));return n?o.a.createElement(d.b.Provider,{value:{style:{fontSize:t+"px",color:a}}},o.a.createElement("div",null,n.icon)):o.a.createElement(o.a.Fragment,null,"404")}}}a(28);var v=[{title:"Hours",milliseconds:36e5},{title:"Days",milliseconds:864e5},{title:"Weeks",milliseconds:6048e5},{title:"Months",milliseconds:24192e5}];function E(e){var t=e.firestore,a=e.closeEditModal,n=e.job,r=f().categories,l=o.a.useState(n?n.name:""),i=Object(c.a)(l,2),u=i[0],s=i[1],m=o.a.useState(n?n.interval:1),d=Object(c.a)(m,2),p=d[0],b=d[1],E=o.a.useState(n?n.intervalUnit:v[0]),g=Object(c.a)(E,2),h=g[0],j=g[1],y=o.a.useState(n?n.points:1),k=Object(c.a)(y,2),C=k[0],S=k[1],w=o.a.useState(n?n.category:r[0].name),N=Object(c.a)(w,2),M=N[0],B=N[1];return o.a.createElement("div",{id:"modalBackground",className:"modalBackground",onClick:function(e){"modalBackground"===e.target.id&&a()},onSubmit:n?function(e){(e.preventDefault(),n&&u&&p&&C)&&(t.collection("jobs").doc(n.id).update({name:u,interval:p,intervalUnit:h,points:C,category:M}),a())}:function(e){e.preventDefault(),u&&p&&C&&(t.collection("jobs").add({name:u,interval:p,intervalUnit:h,points:C,category:M,completedAt:new Date}),a())}},o.a.createElement("div",{className:"modal"},o.a.createElement("form",null,o.a.createElement("p",null,n?"Edit job":"Create a job"),o.a.createElement("input",{type:"text",name:"name",placeholder:"Name",value:u,onChange:function(e){return s(e.currentTarget.value)}}),o.a.createElement("p",null,"Category"),o.a.createElement("select",{name:"category",value:M,onChange:function(e){return B(e.currentTarget.value)}},r.map((function(e){return o.a.createElement("option",{key:e.name,value:e.name},e.name)}))),o.a.createElement("p",null,"Repeat every"),o.a.createElement("input",{type:"number",name:"interval",value:p,onChange:function(e){return b(e.currentTarget.value)}}),o.a.createElement("div",{className:"durationButtons"},v.map((function(e){return o.a.createElement("button",{className:e.title===h.title?"selected":"",key:e.title,type:"button",onClick:function(){return j(e)}},e.title)}))),o.a.createElement("p",null,"Points"),o.a.createElement("input",{type:"number",name:"points",value:C,onChange:function(e){return S(e.currentTarget.value)}}),!n&&o.a.createElement("button",{type:"submit",disabled:!u},"Create"),n&&o.a.createElement("div",{className:"dualButtons"},o.a.createElement("button",{type:"subbmit"},"Save"),o.a.createElement("button",{type:"button",onClick:function(){n&&(t.collection("jobs").doc(n.id).delete(),a())}},"Delete")))))}function g(e){var t=e.openCreateModal;return o.a.createElement("div",{className:"addJob jobCube",onClick:t},o.a.createElement(d.b.Provider,{value:{style:{fontSize:"100px",color:"rgb(0, 123, 255)"}}},o.a.createElement("div",null,o.a.createElement(p.b,null))),"Add a new job")}function h(e){var t=e.job,a=1e3*t.completedAt.seconds,n=(new Date).getTime(),r=(a+t.intervalUnit.milliseconds*t.interval-n)/1e3,l=r<=0;return o.a.createElement("div",{className:function(){var e=["timeleft"];return l&&e.push("late"),r<86400?e.push("soon"):e.push("early"),e.join(" ")}()},!l&&"in ",function(){var e=Math.abs(r);return e<60?e+" seconds":e<3600?Math.floor(e/60)+" minutes":e<86400?Math.floor(e/3600)+" hours":e<604800?Math.floor(r/86400)+" days":e<2419200?Math.floor(e/604800)+" weeks":Math.floor(e/2419200)+" months"}(),l&&" late")}function j(e){var t=e.job,a=e.firestore,n=e.selectedJob,r=e.setSelectedJob,l=e.openEditModal,c=f().getCategoryIcon;return o.a.createElement("div",{className:"jobCube",onClick:function(){r(t)}},t===n?o.a.createElement(o.a.Fragment,null,o.a.createElement("button",{className:"jobBtn",onClick:function(){a.collection("jobs").doc(t.id).update({completedAt:new Date})}},"Mark done"),o.a.createElement("button",{className:"jobBtn",onClick:l},"Edit")):o.a.createElement(o.a.Fragment,null,o.a.createElement(h,{job:t}),c(t.category,70),t.name))}a(29);var y=function(e){var t=e.firestore,a=e.user,n=o.a.useState([]),r=Object(c.a)(n,2),l=r[0],i=r[1],u=o.a.useState(),s=Object(c.a)(u,2),d=s[0],p=s[1],b=o.a.useState(!1),f=Object(c.a)(b,2),v=f[0],h=f[1];o.a.useEffect((function(){t.collection("jobs").onSnapshot((function(e){var t=e.docs.map((function(e){return Object(m.a)({id:e.id},e.data())}));i(t)}))}),[t]);var y=function(){h(!0)};return o.a.createElement("div",{className:"jobsContainer"},o.a.createElement(g,{firestore:t,user:a,openCreateModal:function(){p(void 0),h(!0)}}),l&&l.map((function(e){return o.a.createElement(j,{key:e.id,job:e,firestore:t,selectedJob:d,setSelectedJob:p,openEditModal:y})})),v&&o.a.createElement(E,{closeEditModal:function(){p(void 0),h(!1)},firestore:t,job:d}))};u.a.initializeApp({apiKey:"AIzaSyDuLhFU-X9QUqlx0Cw1sn92eAtB7pSOSk0",authDomain:"housework-a9d38.firebaseapp.com",databaseURL:"https://housework-a9d38.firebaseio.com",projectId:"housework-a9d38",storageBucket:"housework-a9d38.appspot.com",messagingSenderId:"475852222396",appId:"1:475852222396:web:9fa6485a42ba1284e985b9",measurementId:"G-ZVBWH6CY7R"});var k=u.a.auth(),C=u.a.firestore();function S(){return o.a.createElement("button",{onClick:function(){var e=new u.a.auth.GoogleAuthProvider;k.signInWithPopup(e)}},"Log in")}function w(e){var t=e.user;return t?o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{className:"userImage",src:t.photoURL,alt:t.displayName}),"Welcome ",t.displayName):o.a.createElement(S,null)}var N=function(){var e=Object(s.a)(k),t=Object(c.a)(e,1)[0];return o.a.createElement("div",{className:"App"},o.a.createElement("div",{className:"header"},o.a.createElement(w,{user:t})),t&&o.a.createElement(y,{firestore:C,user:t}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(N,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[15,1,2]]]);
//# sourceMappingURL=main.694c19c3.chunk.js.map