import{m as p,r,a as f,c as d,b as N,j as e,l as b,q as v,x as t,s as w,t as y,v as F,L as A,w as E}from"./index-4975aaaa.js";import{F as i,g as O}from"./utils.profile-24d6a615.js";function L(){const{id:l}=p(),[a,c]=r.useState(void 0),[m,u]=r.useState(!0),[o,g]=r.useState([]),[n,x]=r.useState([]),h=f();return r.useEffect(()=>{(async()=>{try{let s=await d.get(`/user/${l}`);c(j=>({...j,...s.data.user})),s=await d.get("/project/members/all"),g(s.data.projects),s=await d.get(`/user/teammates/${l}`),x(s.data.teammates)}catch(s){N(s),h("/not-found")}u(!1)})()},[l]),e.jsx("div",{className:"w-full p-6",children:m||!a?e.jsx(b,{size:"big"}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`w-full grid grid-cols-1 lg:grid-cols-profile
          gap-4 place-items-center lg:place-items-stretch`,children:[e.jsxs("div",{className:"w-72 text-center rounded-lg shadow-lg bg-white grid place-content-center p-4",children:[e.jsx("img",{src:a.image_url,alt:"profile",className:`h-40 w-40 m-auto border-2 border-transparent
              outline-2 outline outline-red-500 rounded-full my-6`}),e.jsx("div",{className:"font-bold",children:a.username}),e.jsx("p",{children:a.country}),e.jsx("hr",{}),e.jsx(i,{icon:v,text:t(a.role,"No role")}),e.jsx(i,{icon:w,text:O(a.birthday)}),e.jsx(i,{icon:y,text:t(a.email,"No email")}),e.jsx(i,{icon:F,text:`Worked in ${o.length} projects`})]}),e.jsxs("div",{className:"rounded-md bg-white shadow-md p-4",children:[e.jsxs("div",{className:"relative mb-20",children:[e.jsx("h3",{className:"mb-6",children:t(a.role,"No role")}),e.jsx("div",{className:"absolute top-8 left-0 bg-gray-200 p-2 rounded-md",children:t(a.description,"No description provided")}),e.jsx("div",{className:`absolute border-transparent border-b-8 border-l-8 border-r-8 border-b-gray-200
                w-0 h-0 top-6 left-6`})]}),e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:"font-bold my-4",children:"Teammates"}),e.jsx("div",{className:"w-full grid grid-cols-3 grid-rows-3 gap-3",children:n.length===0?e.jsx("h2",{children:"No teammates"}):n.map(s=>e.jsx("div",{children:e.jsxs(A,{to:`/profile/${s.user_id}`,children:[e.jsx("img",{src:s.image_url,alt:"profile",className:"w-32 h-32 rounded-full m-auto"}),e.jsx("div",{className:"font-bold w-full text-center",children:s.username})]})},s.user_id))})]})]})]}),e.jsx("div",{className:"w-full rounded-lg p-4 grid grid-cols-2 gap-5 bg-white shadow-md mt-6",children:o.map(s=>e.jsxs("div",{className:"flex place-items-center bg-gray-100 transition-all rounded-md p-2",children:[e.jsx("img",{src:E,className:"w-24 h-24"}),e.jsxs("div",{className:"ml-2",children:[e.jsx("h3",{children:s.name}),e.jsx("p",{children:s.description})]})]},s.project_id))})]})})}export{L as default};
