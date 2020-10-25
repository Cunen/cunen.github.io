(this.webpackJsonphomepage=this.webpackJsonphomepage||[]).push([[0],{15:function(e,t,a){e.exports=a(30)},20:function(e,t,a){},21:function(e,t,a){},28:function(e,t,a){},29:function(e,t,a){},30:function(e,t,a){"use strict";a.r(t);var n=a(1),o=a.n(n),r=a(13),l=a.n(r),c=(a(20),a(4)),i=a(2),u=(a(21),a(5)),s=a.n(u),m=(a(22),a(26),a(14)),d=a(0),f=a(3),b=[{name:"Bedroom",icon:o.a.createElement(f.a,null)},{name:"Kitchen",icon:o.a.createElement(f.i,null)},{name:"Living room",icon:o.a.createElement(f.b,null)},{name:"House",icon:o.a.createElement(f.d,null)},{name:"Shopping",icon:o.a.createElement(f.f,null)},{name:"Toilet",icon:o.a.createElement(f.h,null)},{name:"Outside",icon:o.a.createElement(f.c,null)}];function v(){return{categories:b,getCategoryIcon:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:24,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"black",n=b.find((function(t){return t.name===e}));return n?o.a.createElement(d.b.Provider,{value:{style:{fontSize:t+"px",color:a}}},o.a.createElement("div",null,n.icon)):o.a.createElement(o.a.Fragment,null,"404")}}}a(28);var p=[{title:"Hours",milliseconds:36e5},{title:"Days",milliseconds:864e5},{title:"Weeks",milliseconds:6048e5},{title:"Months",milliseconds:24192e5}];function E(e){var t=e.firestore,a=e.closeEditModal,n=e.job,r=e.users,l=v().categories,c=o.a.useState(n?n.name:""),u=Object(i.a)(c,2),s=u[0],m=u[1],d=o.a.useState(n?n.interval:1),f=Object(i.a)(d,2),b=f[0],E=f[1],g=o.a.useState(n?n.intervalUnit:p[0]),h=Object(i.a)(g,2),y=h[0],j=h[1],k=o.a.useState(n?n.points:1),S=Object(i.a)(k,2),C=S[0],N=S[1],O=o.a.useState(n?n.category:l[0].name),w=Object(i.a)(O,2),B=w[0],M=w[1],A=o.a.useState(n?n.assignee:"nobody"),U=Object(i.a)(A,2),F=U[0],I=U[1];return o.a.createElement("div",{id:"modalBackground",className:"modalBackground",onClick:function(e){"modalBackground"===e.target.id&&a()},onSubmit:n?function(e){(e.preventDefault(),n&&s&&b&&C)&&(t.collection("jobs").doc(n.id).update({name:s,interval:b,intervalUnit:y,points:C,category:B,assignee:F}),a())}:function(e){e.preventDefault(),s&&b&&C&&(t.collection("jobs").add({name:s,interval:b,intervalUnit:y,points:C,category:B,completedAt:new Date,assignee:F}),a())}},o.a.createElement("div",{className:"modal"},o.a.createElement("form",null,o.a.createElement("label",{htmlFor:"name"},n?"Edit job":"Create a job"),o.a.createElement("input",{type:"text",id:"name",name:"name",placeholder:"Name",value:s,onChange:function(e){return m(e.currentTarget.value)}}),o.a.createElement("label",{htmlFor:"category"},"Category"),o.a.createElement("select",{name:"category",id:"category",value:B,onChange:function(e){return M(e.currentTarget.value)}},l.map((function(e){return o.a.createElement("option",{key:e.name,value:e.name},e.name)}))),o.a.createElement("label",{htmlFor:"interval"},"Repeat every"),o.a.createElement("input",{type:"number",name:"interval",id:"interval",value:b,onChange:function(e){return E(e.currentTarget.value)}}),o.a.createElement("div",{className:"durationButtons"},p.map((function(e){return o.a.createElement("button",{className:e.title===y.title?"selected":"",key:e.title,type:"button",onClick:function(){return j(e)}},e.title)}))),o.a.createElement("label",{htmlFor:"points"},"Points"),o.a.createElement("input",{type:"number",name:"points",id:"points",value:C,onChange:function(e){return N(e.currentTarget.value)}}),o.a.createElement("label",{htmlFor:"assignee"},"Assignee"),o.a.createElement("select",{name:"assignee",id:"assignee",value:F,onChange:function(e){return I(e.currentTarget.value)}},o.a.createElement("option",{value:"nobody"},"Anyone"),r.map((function(e){return o.a.createElement("option",{key:e.email,value:e.email},e.name)}))),!n&&o.a.createElement("button",{type:"submit",disabled:!s},"Create"),n&&o.a.createElement("div",{className:"dualButtons"},o.a.createElement("button",{type:"subbmit"},"Save"),o.a.createElement("button",{type:"button",onClick:function(){n&&(t.collection("jobs").doc(n.id).delete(),a())}},"Delete")))))}function g(e){var t=e.openCreateModal;return o.a.createElement("div",{className:"addJob jobCube",onClick:t},o.a.createElement(d.b.Provider,{value:{style:{fontSize:"100px",color:"rgb(0, 123, 255)"}}},o.a.createElement("div",null,o.a.createElement(f.e,null))),"Add a new job")}function h(e){var t=e.job,a=1e3*t.completedAt.seconds,n=(new Date).getTime(),r=(a+t.intervalUnit.milliseconds*t.interval-n)/1e3,l=r<=0;return o.a.createElement("div",{className:function(){var e=["timeleft"];return l&&e.push("late"),r<86400?e.push("soon"):e.push("early"),e.join(" ")}()},!l&&"in ",function(){var e=Math.abs(r);return e<60?Math.floor(e)+" seconds":e<3600?Math.floor(e/60)+" minutes":e<86400?Math.floor(e/3600)+" hours":e<604800?Math.floor(r/86400)+" days":e<2419200?Math.floor(e/604800)+" weeks":Math.floor(e/2419200)+" months"}(),l&&" late")}function y(e){var t=e.url;return o.a.createElement("img",{className:"assigneeBubble",src:t,alt:t})}function j(e){var t=e.job,a=e.firestore,n=e.selectedJob,r=e.setSelectedJob,l=e.openEditModal,c=e.assignee,i=v().getCategoryIcon;console.log(c);return o.a.createElement("div",{className:"jobCube",onClick:function(){r(t)}},t===n?o.a.createElement(o.a.Fragment,null,o.a.createElement("button",{className:"jobBtn",onClick:function(){a.collection("jobs").doc(t.id).update({completedAt:new Date})}},"Mark done"),o.a.createElement("button",{className:"jobBtn",onClick:l},"Edit")):o.a.createElement(o.a.Fragment,null,c&&o.a.createElement(y,{url:c.imageUrl}),o.a.createElement(h,{job:t}),i(t.category,70),t.name))}a(29);var k=function(e){var t=e.firestore,a=e.user,n=o.a.useState([]),r=Object(i.a)(n,2),l=r[0],u=r[1],s=o.a.useState([]),m=Object(i.a)(s,2),d=m[0],f=m[1],b=o.a.useState(),v=Object(i.a)(b,2),p=v[0],h=v[1],y=o.a.useState(!1),k=Object(i.a)(y,2),S=k[0],C=k[1];o.a.useEffect((function(){t.collection("jobs").onSnapshot((function(e){var t=e.docs.map((function(e){return Object(c.a)({id:e.id},e.data())}));u(t)}))}),[t]),o.a.useEffect((function(){t.collection("users").onSnapshot((function(e){var t=e.docs.map((function(e){return Object(c.a)({id:e.id},e.data())}));f(t)}))}),[t]);var N=function(){C(!0)};return o.a.createElement("div",{className:"jobsContainer"},o.a.createElement(g,{firestore:t,user:a,openCreateModal:function(){h(void 0),C(!0)}}),l&&l.map((function(e){return o.a.createElement(j,{key:e.id,job:e,firestore:t,selectedJob:p,setSelectedJob:h,openEditModal:N,assignee:d.find((function(t){return t.email===e.assignee}))})})),S&&o.a.createElement(E,{closeEditModal:function(){h(void 0),C(!1)},firestore:t,job:p,users:d}))};s.a.initializeApp({apiKey:"AIzaSyDuLhFU-X9QUqlx0Cw1sn92eAtB7pSOSk0",authDomain:"housework-a9d38.firebaseapp.com",databaseURL:"https://housework-a9d38.firebaseio.com",projectId:"housework-a9d38",storageBucket:"housework-a9d38.appspot.com",messagingSenderId:"475852222396",appId:"1:475852222396:web:9fa6485a42ba1284e985b9",measurementId:"G-ZVBWH6CY7R"});var S=s.a.auth(),C=s.a.firestore();function N(){var e=o.a.useState([]),t=Object(i.a)(e,2),a=t[0],n=t[1];o.a.useEffect((function(){C.collection("users").onSnapshot((function(e){var t=e.docs.map((function(e){return Object(c.a)({id:e.id},e.data())}));n(t)}))}),[]);return o.a.createElement("button",{className:"loginButton",onClick:function(){var e=new s.a.auth.GoogleAuthProvider;S.signInWithPopup(e).then((function(e){var t=e.user;a.find((function(e){return e.email===t.email}))||C.collection("users").add({name:t.displayName,email:t.email,imageUrl:t.photoURL})}))}},o.a.createElement(d.b.Provider,{value:{style:{fontSize:"150px",color:"#ff7f34"}}},o.a.createElement("div",null,o.a.createElement(f.g,null))),"Log in")}function O(){return o.a.createElement("button",{className:"signOutButton",onClick:function(){return S.signOut()}},o.a.createElement(d.b.Provider,{value:{style:{fontSize:"50px",color:"#ff7f34"}}},o.a.createElement("div",null,o.a.createElement(f.g,null))),"Log out")}function w(e){var t=e.user,a=o.a.useState(!1),n=Object(i.a)(a,2),r=n[0],l=n[1];return t?o.a.createElement(o.a.Fragment,null,o.a.createElement("img",{className:"userImage",src:t.photoURL,alt:t.displayName,onClick:function(){return l(!r)}}),"Welcome ",t.displayName,r&&o.a.createElement(O,null)):null}var B=function(){var e=Object(m.a)(S),t=Object(i.a)(e,1)[0];return o.a.createElement("div",{className:"App"},o.a.createElement("div",{className:"header"},o.a.createElement(w,{user:t})),t&&o.a.createElement(k,{firestore:C,user:t}),!t&&o.a.createElement(N,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(B,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[15,1,2]]]);
//# sourceMappingURL=main.2242765c.chunk.js.map