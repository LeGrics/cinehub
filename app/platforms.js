(function(root){
  'use strict';
  var platforms=[
    {id:'movy',name:'Movy',home:'https://www.movy.sx/fr',hosts:['www.movy.sx','movy.sx'],icon:'platform-icons/movy.svg',roots:['#__next'],ads:{storage:'session',key:'ads-enabled-session',value:'false'}},
    {id:'cinejoy',name:'Cinejoy',home:'https://cinejoy.pk/',hosts:['cinejoy.pk','www.cinejoy.pk'],icon:'platform-icons/cinejoy.ico',roots:['body > div[style*="display: contents"]','#svelte'],ads:{storage:'local',key:'addies',value:'false'}},
    {id:'7movies',name:'7movies',home:'https://7movies.ac/',hosts:['7movies.ac','www.7movies.ac'],icon:'platform-icons/7movies.ico',roots:[],scrollMode:'document',ads:{storage:'session',key:'cinrift_ad_free',value:'true',cleanStart:'cinehub.7movies.cleanStart.1',scripts:['/r7.js','https://oa.ingangupbelt.com/']}}
  ];
  root.CineHubPlatforms=platforms;
  if(typeof module!=='undefined')module.exports=platforms;
})(typeof window==='undefined'?globalThis:window);
