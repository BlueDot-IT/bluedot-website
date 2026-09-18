/* BlueDot Spatial: small, dependency-free WebGL2 renderer.
 * All scene surfaces are world-space triangle meshes. No screenshot layers.
 * Native document scroll selects a continuous camera path. */
'use strict';
(() => {
const canvas = document.getElementById('world');
const status = document.getElementById('render-status');
const gl = canvas.getContext('webgl2', {alpha:false, antialias:true, powerPreference:'high-performance'});
if (!gl) { document.documentElement.classList.add('no-webgl'); status.textContent='3D is unavailable in this browser. All page content remains accessible below.'; return; }
const MAX_PROGRESS=3.5;
const PI=Math.PI, TAU=PI*2, clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const mix=(a,b,t)=>a+(b-a)*t, smooth=(a,b,t)=>{t=clamp((t-a)/(b-a));return t*t*(3-2*t);};
const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,n)=>a.map(x=>x*n),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>mul(a,1/Math.max(.00001,Math.hypot(...a)));
const I=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function matrix(pos=[0,0,0],scale=1,rot=0){let c=Math.cos(rot)*scale,s=Math.sin(rot)*scale;return new Float32Array([c,0,-s,0,0,scale,0,0,s,0,c,0,...pos,1]);}
function multiply(a,b){let o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function look(eye,target,up=[0,1,0]){let z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function projection(fov,aspect){let f=1/Math.tan(fov*.5),n=.2,far=650;return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+n)/(n-far),-1,0,0,2*far*n/(n-far),0]);}
let seed=2611;function random(){seed=(Math.imul(1664525,seed)+1013904223)|0;return(seed>>>0)/4294967296;}
function hash(x,z){let v=Math.sin(x*127.1+z*311.7)*43758.5453;return v-Math.floor(v);}
function noise(x,z){let a=Math.floor(x),b=Math.floor(z),u=x-a,v=z-b;u=u*u*(3-2*u);v=v*v*(3-2*v);return mix(mix(hash(a,b),hash(a+1,b),u),mix(hash(a,b+1),hash(a+1,b+1),u),v);}
function fbm(x,z){let v=0,a=.5;for(let i=0;i<5;i++){v+=noise(x,z)*a;x=x*2.03+3.2;z=z*2.03+7.1;a*=.5;}return v;}
const VERT=`#version 300 es
precision highp float;precision highp int;
layout(location=0) in vec3 aPosition;layout(location=1) in vec3 aNormal;layout(location=2) in vec2 aUV;layout(location=3) in vec2 aData;
uniform mat4 uVP,uModel;uniform float uBuild,uSecurity,uTime;uniform vec3 uShape;uniform int uMode;
out vec3 vP,vN,vLocal;out vec2 vUV,vData;

// Closed parametric ribbons. Position and surface normals change together in 3D.
float signedPower(float v,float p){return sign(v)*pow(abs(v),p);}
vec3 ribbonCenter(float u,float lane){
 float a=u*6.28318530718;float phase=lane*2.09439510239;
 float wobble=sin(a*3.+uTime*.65+phase*(1.-uShape.y))*.13;
 vec3 ring=vec3(cos(a)*6.1,sin(a)*6.1,sin(a*2.+phase)*.35);
 float tilt=phase+.25;
 ring=vec3(ring.x,ring.y*cos(tilt)-ring.z*sin(tilt),ring.y*sin(tilt)+ring.z*cos(tilt));
 float r=4.2+1.25*cos(3.*a)+.18*sin(a+uTime*.45);
 vec3 flow=vec3(r*cos(2.*a),r*sin(2.*a)*.78,2.4*sin(3.*a));
 vec3 build=vec3(signedPower(cos(a),.42)*5.45,signedPower(sin(a),.42)*5.45,(lane-1.)*2.15);
 float turn=(lane-1.)*.18;
 build=vec3(build.x*cos(turn)+build.z*sin(turn),build.y,-build.x*sin(turn)+build.z*cos(turn));
 vec3 p=ring*uShape.x+flow*uShape.y+build*uShape.z;
 p+=normalize(p+vec3(.001))*wobble;
 float rot=.24+sin(uTime*.18)*.12;
 return vec3(p.x*cos(rot)+p.z*sin(rot),p.y,-p.x*sin(rot)+p.z*cos(rot));
}
vec3 ribbonSurface(float u,float v,float lane){
 vec3 c=ribbonCenter(u,lane),T=normalize(ribbonCenter(u+.0004,lane)-ribbonCenter(u-.0004,lane));
 vec3 B=normalize(cross(T,normalize(c+vec3(.1,.3,.2))));
 vec3 N=normalize(cross(B,T));
 float twist=u*12.5663706144+lane*.8*(1.-uShape.y)+uTime*.24+sin(u*6.283+uTime*.3)*.18;
 vec3 W=B*cos(twist)+N*sin(twist);
 float width=mix(.72,.43,uShape.y)*(.90+.10*sin(u*18.85));
 return c+W*((v-.5)*2.*width+(lane-1.)*1.11*uShape.y)+normalize(c)*sin(v*3.14159265)*.065;
}
void main(){vec3 p=aPosition;vec3 normal=aNormal;
 if(uMode==9){
  p=ribbonSurface(aUV.x,aUV.y,aData.x);
  vec3 du=ribbonSurface(aUV.x+.0005,aUV.y,aData.x)-ribbonSurface(aUV.x-.0005,aUV.y,aData.x);
  vec3 dv=ribbonSurface(aUV.x,aUV.y+.002,aData.x)-ribbonSurface(aUV.x,aUV.y-.002,aData.x);
  normal=normalize(cross(du,dv));
 }

 if(uMode==6)p+=normalize(p)*uSecurity*(.12+aData.x*.035);
 if(uMode==5){float f=smoothstep(aData.x*.32,aData.x*.32+.52,uBuild);p.y=p.y*f-.2*(1.-f);p.x+=(1.-f)*sin(aData.x*38.)*14.;p.z+=(1.-f)*cos(aData.x*31.)*9.;}
 vec4 w=uModel*vec4(p,1.);vP=w.xyz;vN=normalize(mat3(uModel)*normal);vLocal=aPosition;vUV=aUV;vData=aData;gl_Position=uVP*w;}`;
const COMMON=`
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}
float fb(vec2 p){float a=.5,v=0.;for(int i=0;i<5;i++){v+=n(p)*a;p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 sky(vec3 rd){
 float hgt=max(rd.y,0.);vec3 horizon=vec3(.25,.38,.52);vec3 col=mix(horizon,vec3(.007,.025,.060),smoothstep(0.,.65,hgt));
 float sun=dot(rd,normalize(vec3(.30,.095,-1.)));float warm=pow(max(sun,0.),16.);col+=vec3(.52,.24,.08)*warm*exp(-hgt*4.);
 col+=vec3(1.,.68,.33)*pow(max(sun,0.),650.);col+=vec3(1.,.85,.66)*pow(max(sun,0.),16000.)*2.;
 vec2 q=rd.xz/(abs(rd.y)+.16)*2.;float cl=fb(q+vec2(uTime*.005,0.));float cloud=smoothstep(.42,.73,cl)*smoothstep(.01,.18,rd.y);
 col=mix(col,vec3(.24,.29,.37)+vec3(.18,.075,.015)*warm,cloud*.53);
 col=mix(col,col*1.42+vec3(.05,.085,.10),uBuild*.82);
 vec3 horizonDawn=mix(vec3(.95,.52,.32),vec3(1.0,.78,.45),pow(max(sun,0.),3.5));
 vec3 midSkyDawn=vec3(.16,.44,.76);
 vec3 zenithDawn=vec3(.07,.20,.48);
 vec3 dawn=mix(horizonDawn,midSkyDawn,smoothstep(0.,.45,hgt));
 dawn=mix(dawn,zenithDawn,smoothstep(.45,.95,hgt));
 dawn+=vec3(.75,.35,.10)*pow(max(sun,0.),10.)*exp(-hgt*3.2);
 dawn+=vec3(1.0,.78,.42)*pow(max(sun,0.),55.)*1.6;
 dawn+=vec3(1.0,.92,.78)*pow(max(sun,0.),1200.)*2.4;
 vec3 dawnCloud=mix(vec3(.98,.76,.62),vec3(.55,.65,.80),hgt);
 dawn=mix(dawn,dawnCloud,cloud*.32);
 return mix(col,dawn,uTomorrow);}
vec3 fog(vec3 col,vec3 p,vec3 eye){float d=length(p-eye);float f=(1.-exp(-d*.0045))*clamp(1.12-p.y*.016,.12,1.);return mix(col,sky(normalize(p-eye)),f);}
`;
const FRAG=`#version 300 es
precision highp float;precision highp int;
in vec3 vP,vN,vLocal;in vec2 vUV,vData;out vec4 color;
uniform vec3 uCam;uniform float uTime,uBuild,uSecurity,uEnergy,uClip,uTomorrow;uniform int uMode;uniform sampler2D uEarth;
${COMMON}
void main(){if(uClip>.5&&vP.y<.03)discard;vec3 N=normalize(vN),V=normalize(uCam-vP);float facing=max(dot(N,V),0.);vec3 col;float alpha=1.;
 if(uMode==1){
  vec4 tex=texture(uEarth,vec2(1.-vUV.x,vUV.y));
  vec3 sunDir=normalize(vec3(-.4,.7,.7));
  float sunDot=dot(N,sunDir);
  float light=max(sunDot,0.);
  float detail=fb(vUV*340.);float land=tex.r;
  vec3 ocean=vec3(.006,.035,.083),continent=vec3(.035,.15,.24)*(detail*.6+.7);col=mix(ocean,continent,land)*(.55+light*.95);
  col+=tex.g*vec3(.035,.40,.70)*.7+tex.b*vec3(.01,.09,.14)*uSecurity;
  float night=smoothstep(.20,-.20,sunDot);
  col+=pow(tex.a,1.2)*vec3(1.,.82,.56)*(night*2.2+.15);
  float gridU=1.-smoothstep(.012,.06,abs(fract(vUV.x*36.)-.5));float gridV=1.-smoothstep(.014,.06,abs(fract(vUV.y*18.)-.5));
  col+=max(gridU,gridV)*vec3(.02,.15,.29)*(.035+uSecurity*.09);
  float scan=exp(-pow((fract(vUV.y-uTime*.022)-.5)*40.,2.));col+=scan*vec3(.04,.32,.5)*(.12+uSecurity*.3);
  float rimScatter=pow(1.-facing,3.5)*(0.35+0.65*max(sunDot*.5+.5,0.));
  col+=rimScatter*vec3(.04,.45,.95)*1.1;
  float spec=pow(max(dot(reflect(-sunDir,N),V),0.),60.);col+=spec*vec3(.18,.3,.4)*(1.-land);
 }else if(uMode==9){
  if(!gl_FrontFacing)N=-N;
  vec3 R=reflect(-V,N);float F=pow(1.-abs(dot(N,V)),3.);
  vec3 environment=sky(R);
  float broad=pow(max(dot(N,normalize(vec3(-.4,.9,.35))),0.),3.);
  float strip=pow(max(dot(R,normalize(vec3(-.25,.55,.80))),0.),14.);
  float strip2=pow(max(dot(R,normalize(vec3(.85,.3,-.42))),0.),28.);
  float tint=.35+.30*sin(vUV.x*18.85+vData.x*1.7);
  vec3 metal=mix(vec3(.055,.24,.43),vec3(.46,.67,.82),tint);
  vec3 irid=vec3(.5)+.5*cos(vec3(0.,2.,4.)+F*4.2+vUV.x*6.28);
  vec3 tomorrowIrid=vec3(.5)+.5*cos(vec3(0.2,2.2,4.4)+F*4.8+vUV.x*6.28+uTime*.12);
  irid=mix(irid,tomorrowIrid*vec3(1.1,.8,1.3),uTomorrow*.65);
  metal=mix(metal,irid*mix(vec3(.38,.65,.98),vec3(.75,.50,1.15),uTomorrow*.5),.38);
  float aniso=pow(max(1.-abs(dot(R,normalize(cross(N,vec3(0.,1.,0.))))),0.),16.);
  col=environment*metal*(.66+F*.8)+broad*vec3(.12,.20,.27);
  col+=strip*vec3(.80,.90,.97)*1.25+strip2*vec3(.18,.50,.85)*1.3+aniso*vec3(.35,.68,1.)*.45;
  float edge=1.-smoothstep(.01,.047,min(vUV.y,1.-vUV.y));
  float pulse=pow(1.-fract(vUV.x-uTime*.075+vData.x*.21),20.);
  col+=edge*mix(vec3(.025,.30,.85),vec3(.98,.55,.18),uTomorrow*.6)*(.65+pulse*2.5);
  col+=F*vec3(.05,.14,.23)*.4;
  float dawnRim=mix(1.0,0.48+0.52*abs(dot(N,V)),uTomorrow*.8);
  col*=dawnRim;
 }else if(uMode==11){
  col=vec3(.025,.18,.49)+pow(1.-abs(dot(N,V)),2.)*vec3(.02,.35,.72);
  col+=pow(max(dot(reflect(-normalize(vec3(-.4,.8,.6)),N),V),0.),22.)*vec3(.5,.85,1.1);
  col*=.90+.10*sin(uTime*1.1);
 }else if(uMode==17){
  // Architectural glazing uses modeled mullions, not UV-stamped window stripes.
  if(!gl_FrontFacing)N=-N;
  float fres=.08+.72*pow(1.-abs(dot(N,V)),5.);
  vec3 reflected=sky(reflect(-V,N));
  col=mix(vec3(.24,.34,.40),reflected,.32+fres*.5);
  col+=pow(max(dot(N,normalize(V+normalize(vec3(-.42,.66,.43)))),0.),90.)*.22;
  if(vP.x<-178.&&vP.x>-205.&&vP.y>4.5){
   float lensRim=pow(1.-abs(dot(N,V)),2.8);
   vec3 coating=mix(vec3(.08,.32,.95),vec3(.72,.18,.90),lensRim);
   col=mix(col,coating,.68);
   col+=pow(max(dot(reflect(-V,N),normalize(vec3(.3,.8,-.5))),0.),40.)*vec3(.9,1.0,1.3)*1.3;
  }
 }else if(uMode==16){
  float grain=sin(vP.x*25.+n(vP.xz*4.)*9.)*.035+n(vP.xz*90.)*.022;
  vec3 timber=vec3(.28,.16,.075)+grain;
  float light=max(dot(N,normalize(vec3(-.42,.66,.43))),0.);
  col=timber*(vec3(.43,.52,.62)+light*vec3(1.05,.92,.70));
  col+=pow(max(dot(N,normalize(V+vec3(-.42,.66,.43))),0.),18.)*.06;
  col*=mix(.65,1.,smoothstep(0.05,1.1,vP.y));
 }else if(uMode==14){
  // Book bindings: rich jewel-tone cloth covers and paper pages
  float isSpine=step(abs(N.x),.72);
  vec3 paper=vec3(.93,.90,.82);
  float pick=vData.y;
  vec3 cloth=mix(vec3(.78,.14,.18),vec3(.10,.35,.65),smoothstep(.20,.38,pick));
  cloth=mix(cloth,vec3(.12,.52,.28),smoothstep(.45,.62,pick));
  cloth=mix(cloth,vec3(.85,.55,.14),smoothstep(.68,.82,pick));
  cloth=mix(cloth,vec3(.42,.18,.55),smoothstep(.85,1.0,pick));
  vec3 base=mix(paper,cloth,isSpine);
  float sun=max(dot(N,normalize(vec3(-.42,.66,.43))),0.);
  col=base*(vec3(.45,.52,.60)+vec3(1.0,.92,.75)*sun);
  col+=pow(max(dot(N,normalize(V+normalize(vec3(-.42,.66,.43)))),0.),18.)*.08;
 }else if(uMode==13){
  // Brushed metal and cast stone on the appended architecture only.
  float metal=clamp(vData.y,0.,1.);
  float grain=n(vP.xz*72.)*.025+n(vec2(vP.y*210.,vP.x*.8))*.018;
  vec3 base=mix(vec3(.47,.52,.56),vec3(.22,.29,.35),metal)+grain;
  vec3 L=normalize(vec3(-.42,.66,.43));
  float diffuse=max(dot(N,L),0.);
  float fres=.08+.72*pow(1.-abs(dot(N,V)),4.);
  vec3 reflected=sky(reflect(-V,N));
  col=base*(vec3(.38,.48,.58)+vec3(.95,.88,.74)*diffuse);
  col=mix(col,reflected,fres*(.22+metal*.42));
  float spec=pow(max(dot(N,normalize(L+V)),0.),mix(18.,85.,metal));
  col+=spec*vec3(.48,.55,.60)*(.12+metal*.45);
  col*=mix(.52,1.,smoothstep(0.02,.95,vP.y));
 }else if(uMode==12){
  col=vec3(.58,.68,.77)*(.65+max(N.y,0.)*.35);
  col=mix(col,sky(reflect(-V,N)),.32);
 }else if(uMode==2){
  float fres=pow(1.-abs(dot(N,V)),2.8);col=vec3(.015,.40,1.05);alpha=fres*.29*smoothstep(0.,.16,abs(dot(N,V))); color=vec4(col,alpha);return;
 }else if(uMode==3){
  float head=pow(max(0.,1.-fract(vUV.x-uTime*(.035+uEnergy*.09)+vData.x)),25.);
  if(vP.x<-270.){
   float lanternPulse=.92+.08*sin(uTime*2.5+vP.x);
   col=vec3(1.0,.72,.28)*lanternPulse*2.2;
  }else if(vP.x<-220.){
   col=vec3(1.0,.82,.48)*1.8;
  }else if(vP.x<-170.){
   float starBlink=sin(uTime*3.0+vData.x*12.0)*.5+.5;
   col=mix(vec3(.45,.25,1.0),vec3(.30,.80,1.0),starBlink)*2.0;
  }else if(vP.x<-110.){
   float ledType=fract(vData.x*7.31);
   vec3 ledColor=vec3(.05,.95,.35);
   if(ledType>.72)ledColor=vec3(1.0,.72,.10);
   else if(ledType>.48)ledColor=vec3(.05,.85,1.0);
   else if(ledType>.30)ledColor=vec3(1.0,.18,.25);
   float ledPulse=step(.35,fract(uTime*(1.2+ledType*2.5)+vData.x*9.1));
   col=ledColor*(.35+ledPulse*2.6);
  }else if(uTomorrow>0.){
   col=mix(vec3(.08,.52,1.0),vec3(1.0,.75,.30),sin(vData.x*6.28+uTime*.5)*.5+.5)*1.6;
  }else{
   col=vec3(.08,.52,1.0)+head*vec3(.60,.78,.80)*2.2;
  }
 }else if(uMode==6){
  vec2 g=min(vUV,1.-vUV);float lines=1.-smoothstep(.012,.035,min(g.x,g.y));float fres=pow(1.-abs(dot(N,V)),2.5);float spec=pow(max(dot(reflect(-normalize(vec3(-.4,.7,.7)),N),V),0.),35.);col=vec3(.08,.52,.9)+spec*.6;alpha=uSecurity*(.025+lines*.24+fres*.18);color=vec4(col,alpha);return;
 }else{
  float sun=max(dot(N,normalize(vec3(-.42,.66,.43))),0.);float skyLight=N.y*.5+.5;vec3 base;
   if(uMode==4){
    float isWall=1.-smoothstep(.25,.75,abs(N.y));
    float isRoof=smoothstep(.5,.8,N.y);
    vec3 roof=mix(vec3(.035,.050,.072),vec3(.065,.085,.110),vData.x)*(0.9+fb(vP.xz*1.8)*0.1);
    if(vData.y>.85){
     float blink=sin(uTime*4.0+vData.x*30.0)*.5+.5;
     roof+=vec3(.95,.25,.15)*blink*2.5;
    }
    float facadeX=abs(N.z)>.5?vP.x:vP.z;
    float facadeY=vP.y;
    vec2 cell=floor(vec2(facadeX/.90,facadeY/1.15));
    vec2 uvCell=fract(vec2(facadeX/.90,facadeY/1.15));
    float spandrel=step(uvCell.y,.20);
    float mullion=step(uvCell.x,.16);
    float glassPane=(1.-spandrel)*(1.-mullion)*(1.-smoothstep(2.0,.3,facadeY));
    float cellRand=h(cell+vec2(vData.x*43.1,vData.x*97.7));
    float isLit=step(.80,cellRand)*glassPane;
    vec3 winColor=mix(vec3(1.0,.85,.55),vec3(.35,.65,.90),h(cell*2.7))*(.85+.45*h(cell*5.3));
    vec3 frame=mix(vec3(.035,.060,.085),vec3(.09,.13,.17),vData.x);
    vec3 glassCol=mix(frame,vec3(.012,.025,.040),glassPane*(1.-isLit));
    vec3 wall=mix(glassCol,winColor*0.85,isLit);
    base=mix(wall,roof,isRoof);
   }else if(uMode==5){base=mix(vec3(.07,.17,.25),vec3(.54,.61,.64),vData.y);float seam=1.-smoothstep(.015,.025,min(min(vUV.x,1.-vUV.x),min(vUV.y,1.-vUV.y)));base+=seam*vec3(.025,.19,.35);}
   else if(uMode==8){
    float isBloom=step(.86,vData.x)*step(.35,vP.y);
    vec3 foliage=mix(vec3(.06,.24,.11),vec3(.16,.52,.20),vData.y)*(.75+vData.x*.4);
    vec3 petal=mix(vec3(.94,.28,.48),vec3(.98,.78,.22),sin(vData.x*28.)*.5+.5);
    base=mix(foliage,petal,isBloom);
   }
   else if(uMode==7){float snow=smoothstep(24.,37.,vP.y+fb(vP.xz*.1)*8.)*smoothstep(.25,.8,N.y);base=mix(vec3(.13,.19,.23),vec3(.56,.65,.70),snow);base*=.73+fb(vP.xz*.3)*.4;}
   else{base=mix(vec3(.12,.17,.21),vec3(.47,.51,.53),vData.y);base*=.95+fb(vP.xz*1.3)*.09;}
   col=base*(vec3(.24,.38,.54)*(.5+skyLight*.5)+vec3(.92,.88,.76)*sun*(.9+uBuild*.9));
   if(uMode==8){
    float sss=pow(max(dot(-V,normalize(vec3(-.42,.66,.43))),0.),3.)*.45;
    col+=mix(vec3(.08,.35,.15),vec3(.35,.20,.10),step(.86,vData.x))*sss;
   }
   vec3 R=reflect(-V,N);vec3 environment=sky(R);float F=.045+.95*pow(1.-facing,5.);
   if(uMode==4){
    float isWall=1.-smoothstep(.25,.75,abs(N.y));
    float glassPane=(1.-smoothstep(2.0,.3,vP.y))*isWall;
    col=mix(col,environment,glassPane*.45+F*.32);
    col+=pow(1.-facing,4.0)*vec3(.06,.14,.22)*isWall;
   }else if(uMode==5){float glass=(1.-vData.y)*.78;col=mix(col,environment,glass*.62+F*.22);float mullions=1.-smoothstep(.025,.05,abs(fract(vUV.x*6.)-.5));col*=1.-mullions*.25*glass;}
  if(uMode==0){col=mix(col,environment,.10+F*.18);col+=vec3(.03,.07,.14)*pow(max(dot(R,normalize(vec3(9.,12.,-12.)-vP)),0.),32.);}
  if(uMode==5&&vData.y>.5)col*=1.6;
  float spec=pow(max(dot(N,normalize(V+normalize(vec3(-.4,.7,.4)))),0.),uMode==4?70.:28.);col+=spec*vec3(.22,.3,.4);
  float bounce=exp(-distance(vP,vec3(9.,12.,-12.))*.07)*max(dot(N,normalize(vec3(9.,12.,-12.)-vP)),0.);col+=vec3(.01,.06,.11)*bounce;
  col*=mix(.62,1.,smoothstep(0.,1.8,vP.y));
 }
 if(uMode==7&&uTomorrow>0.)col=mix(col,sky(normalize(vP-uCam)),uTomorrow*.28);
 color=vec4(fog(col,vP,uCam),alpha);
}`;
const SCREEN=`#version 300 es
precision highp float;precision highp int;layout(location=0) in vec2 aPosition;out vec2 vUV;void main(){vUV=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const SKYFRAG=`#version 300 es
precision highp float;precision highp int;in vec2 vUV;out vec4 color;uniform vec3 uCam,uFront,uRight,uUp;uniform vec2 uResolution;uniform float uFov,uTime,uBuild,uTomorrow;
${COMMON}
void main(){vec2 p=vUV*2.-1.;p.x*=uResolution.x/uResolution.y;vec3 rd=normalize(uFront+(uRight*p.x+uUp*p.y)*uFov);color=vec4(sky(rd),1.);}`;
const FLOORFRAG=`#version 300 es
precision highp float;precision highp int;in vec3 vP,vN,vLocal;in vec2 vUV,vData;out vec4 color;uniform sampler2D uMirror;uniform mat4 uMirrorVP;uniform vec3 uCam;uniform float uTime,uBuild,uTomorrow,uExtension;
${COMMON}
void main(){vec4 projected=uMirrorVP*vec4(vP,1.);vec2 uv=projected.xy/projected.w*.5+.5;float water=1.-smoothstep(-35.,-32.,vP.z);
 float ripple=sin(vP.x*1.7+vP.z*.4+uTime*.7)*sin(vP.z*.85-uTime*.38)+sin(vP.x*3.1-vP.z*2.2+uTime*1.1)*.22;
 uv+=vec2(ripple*.0007,ripple*.001)*(water+.12);
 float dist=length(vP-uCam);float blurOff=mix(.0012,.0032,clamp(dist*.015,0.,1.));
 vec3 refl=texture(uMirror,clamp(uv,.001,.999)).rgb*.5;
 for(int k=0;k<4;k++){float ang=float(k)*1.5708;refl+=texture(uMirror,clamp(uv+vec2(cos(ang),sin(ang))*blurOff,.001,.999)).rgb*.125;}
 float fres=pow(1.-max(dot(normalize(uCam-vP),vec3(0.,1.,0.)),0.),3.);vec3 base=mix(vec3(.12,.15,.18),vec3(.035,.09,.13),water);
 base=mix(base,mix(vec3(.10,.18,.25),vec3(.035,.12,.20),water),uTomorrow*.85);vec3 col=mix(base,refl,mix(.48,.75,water)+fres*.18);
 float sunGlint=pow(max(dot(reflect(-normalize(uCam-vP),vec3(0.,1.,0.)),normalize(vec3(.30,.095,-1.))),0.),32.);col+=vec3(1.0,.65,.28)*sunGlint*.7*uTomorrow*water;
 vec2 seam=abs(fract(vP.xz/4.)-.5);float line=1.-smoothstep(.005,.012,min(seam.x,seam.y));col*=1.-line*.24*(1.-water);
 float path=abs(vP.x-(sin(vP.z*.065)*10.+5.));float lit=exp(-path*38.)+exp(-path*2.8)*.2;float packet=pow(1.-fract(-vP.z*.025-uTime*.055),14.);col+=lit*mix(vec3(.015,.30,.9),vec3(.05,.65,1.0),uTomorrow)*(1.+packet*2.);
 float path2=abs(vP.x-(sin(vP.z*.065)*10.+5.75));col+=exp(-path2*35.)*vec3(.02,.15,.45);
 col*=.96+fb(vP.xz*2.)*.06;
 if(uExtension>0.){
  float shade=0.;
  vec2 sunShift=vec2(2.2,-2.2);
  shade+=exp(-dot((vP.xz-vec2(-137.,-55.)+sunShift)/vec2(16.,13.),(vP.xz-vec2(-137.,-55.)+sunShift)/vec2(16.,13.))*1.9);
  shade+=exp(-dot((vP.xz-vec2(-191.,-48.)+sunShift)/vec2(15.,13.),(vP.xz-vec2(-191.,-48.)+sunShift)/vec2(15.,13.))*1.9);
  shade+=exp(-dot((vP.xz-vec2(-245.,-39.)+sunShift)/vec2(17.,14.),(vP.xz-vec2(-245.,-39.)+sunShift)/vec2(17.,14.))*1.9);
  shade+=exp(-dot((vP.xz-vec2(-294.,-24.)+sunShift)/vec2(17.,14.),(vP.xz-vec2(-294.,-24.)+sunShift)/vec2(17.,14.))*1.9);
  col*=1.-clamp(shade,0.,1.)*.34*uExtension;
 }
 color=vec4(fog(col,vP,uCam),1.);
}`;
const BLURFRAG=`#version 300 es
precision highp float;precision highp int;in vec2 vUV;out vec4 color;uniform sampler2D uTexture;uniform vec2 uDirection;uniform int uExtract;
void main(){vec3 c=texture(uTexture,vUV).rgb;if(uExtract==1){float bright=max(c.r,max(c.g,c.b));color=vec4(c*smoothstep(.60,1.,bright),1.);return;}
 c*=.227027;c+=(texture(uTexture,vUV+uDirection*1.384615).rgb+texture(uTexture,vUV-uDirection*1.384615).rgb)*.316216;
 c+=(texture(uTexture,vUV+uDirection*3.230769).rgb+texture(uTexture,vUV-uDirection*3.230769).rgb)*.070270;color=vec4(c,1.);}`;
const FINALFRAG=`#version 300 es
precision highp float;precision highp int;in vec2 vUV;out vec4 color;uniform sampler2D uTexture,uBloom;uniform float uTime;
vec3 acesFilm(vec3 x){float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.,1.);}
void main(){
 vec2 distUV=vUV-.5;float caDist=dot(distUV,distUV);
 vec2 caOffset=distUV*(caDist*.004);
 vec3 c;
 c.r=texture(uTexture,vUV-caOffset).r;
 c.g=texture(uTexture,vUV).g;
 c.b=texture(uTexture,vUV+caOffset).b;
 c+=texture(uBloom,vUV).rgb*.52;
 c=acesFilm(c*1.08);
 float vignette=1.-caDist*.32;c*=vignette;
 float grain=fract(sin(dot(vUV*1900.+fract(uTime),vec2(12.9898,78.233)))*43758.5453);c+=(grain-.5)*.003;
 color=vec4(c,1.);
}`;
function compile(v,f){const program=gl.createProgram();for(const[type,src]of[[gl.VERTEX_SHADER,v],[gl.FRAGMENT_SHADER,f]]){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));gl.attachShader(program,s);gl.deleteShader(s);}gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));return{program,loc:{}};}
function use(p){gl.useProgram(p.program);current=p;}let current;
function uni(name,value){let l=current.loc[name];if(l===undefined)l=current.loc[name]=gl.getUniformLocation(current.program,name);if(l===null)return;if(typeof value==='number')gl.uniform1f(l,value);else if(value.length===16)gl.uniformMatrix4fv(l,false,value);else if(value.length===3)gl.uniform3fv(l,value);else if(value.length===2)gl.uniform2fv(l,value);}
function int(name,value){let l=current.loc[name];if(l===undefined)l=current.loc[name]=gl.getUniformLocation(current.program,name);if(l!==null)gl.uniform1i(l,value);}
function bindTexture(name,texture,slot){gl.activeTexture(gl.TEXTURE0+slot);gl.bindTexture(gl.TEXTURE_2D,texture);int(name,slot);}
function mesh(data){let vao=gl.createVertexArray(),buffer=gl.createBuffer();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);let sizes=[3,3,2,2],offset=0;for(let i=0;i<4;i++){gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,sizes[i],gl.FLOAT,false,40,offset*4);offset+=sizes[i];}gl.bindVertexArray(null);return{vao,buffer,count:data.length/10};}
function vertex(out,p,n,uv=[0,0],d=[0,0]){out.push(...p,...n,...uv,...d);}
function triangle(out,a,b,c,d=[0,0],uv=[[0,0],[1,0],[1,1]],normals=null){let n=norm(cross(sub(b,a),sub(c,a)));[a,b,c].forEach((p,i)=>vertex(out,p,normals?normals[i]:n,uv[i],d));}
function box(out,c,s,d=[.3,.7],rotation=0){const pts=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p=>{p=p.map((v,i)=>v*s[i]/2);let x=p[0],z=p[2];return[c[0]+x*Math.cos(rotation)+z*Math.sin(rotation),c[1]+p[1],c[2]-x*Math.sin(rotation)+z*Math.cos(rotation)];});for(const q of [[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[3,7,6,2],[0,1,5,4]]){triangle(out,pts[q[0]],pts[q[1]],pts[q[2]],d);triangle(out,pts[q[0]],pts[q[2]],pts[q[3]],d,[[0,0],[1,1],[0,1]]);}}
function sphere(u=128,v=64,r=1){let out=[];function point(i,j){let a=i/u*TAU,b=j/v*PI;return[r*Math.sin(b)*Math.cos(a),r*Math.cos(b),r*Math.sin(b)*Math.sin(a)];}for(let j=0;j<v;j++)for(let i=0;i<u;i++){let p=[point(i,j),point(i+1,j),point(i+1,j+1),point(i,j+1)],uv=[[i/u,1-j/v],[(i+1)/u,1-j/v],[(i+1)/u,1-(j+1)/v],[i/u,1-(j+1)/v]];for(const ids of [[0,2,1],[0,3,2]])triangle(out,...ids.map(k=>p[k]),[0,0],ids.map(k=>uv[k]),ids.map(k=>norm(p[k])));}return out;}
function tube(out,fn,r=.04,steps=200,sides=6,d=[0,0]){let rings=[];for(let i=0;i<=steps;i++){let t=i/steps,p=fn(t),T=norm(sub(fn(t+.0001),fn(t-.0001))),R=norm(cross(T,Math.abs(T[1])>.98?[1,0,0]:[0,1,0])),U=norm(cross(R,T));rings.push(Array.from({length:sides},(_,j)=>{let n=add(mul(R,Math.cos(j/sides*TAU)),mul(U,Math.sin(j/sides*TAU)));return{p:add(p,mul(n,r)),n};}));}for(let i=0;i<steps;i++)for(let j=0;j<sides;j++){let q=[rings[i][j],rings[i+1][j],rings[i+1][(j+1)%sides],rings[i][(j+1)%sides]];for(const ids of [[0,1,2],[0,2,3]]){for(const k of ids)vertex(out,q[k].p,q[k].n,[(i+(k===1||k===2?1:0))/steps,k<2?j/sides:(j+1)/sides],d);}}}
let solid,skyProgram,floorProgram,blurProgram,finalProgram;
try {solid=compile(VERT,FRAG);skyProgram=compile(SCREEN,SKYFRAG);floorProgram=compile(VERT,FLOORFRAG);blurProgram=compile(SCREEN,BLURFRAG);finalProgram=compile(SCREEN,FINALFRAG);}catch(e){console.error(e);document.documentElement.classList.add('no-webgl');status.textContent='The 3D renderer could not start. All services are available below.';return;}
const quad=gl.createVertexArray();gl.bindVertexArray(quad);const qb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,qb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.bindVertexArray(null);
function screen(){gl.bindVertexArray(quad);gl.drawArrays(gl.TRIANGLES,0,3);}
const geometry={};let a=[];
// Architectural shell: structural ribs, overhead canopy, terrace edge, railings.
for(let k=0;k<5;k++){let z=14-k*10;for(let j=0;j<28;j++){let t=(j+.5)/28*PI;let x=Math.cos(t)*28,y=Math.sin(t)*22;box(a,[x,y,z],[2.6,1.35,1.2],[.2,.34],0);}}
// Continuous concrete arc sections have real front, back and side faces.
function arch(out,z,rX,rY,thickness,depth,start=0,end=PI){let steps=90;for(let j=0;j<steps;j++){let t=mix(start,end,j/steps),t2=mix(start,end,(j+1)/steps);let p=[[(rX)*Math.cos(t),rY*Math.sin(t),z-depth/2],[(rX)*Math.cos(t2),rY*Math.sin(t2),z-depth/2],[(rX+thickness)*Math.cos(t2),(rY+thickness)*Math.sin(t2),z-depth/2],[(rX+thickness)*Math.cos(t),(rY+thickness)*Math.sin(t),z-depth/2]];for(let side=0;side<2;side++){let q=p.map(v=>[v[0],v[1],v[2]+side*depth]);triangle(out,q[0],q[1],q[2],[.3,.65]);triangle(out,q[0],q[2],q[3],[.3,.65]);}for(let k=0;k<4;k++){let b=p[(k+1)%4],c=p[k];triangle(out,c,b,[b[0],b[1],b[2]+depth],[.3,.48]);triangle(out,c,[b[0],b[1],b[2]+depth],[c[0],c[1],c[2]+depth],[.3,.48]);}}}
a=[];arch(a,10,26,22,1.5,4);arch(a,-10,28,23,1,2);arch(a,-30,31,23,1.2,2);
box(a,[-23,12,3],[2,25,3],[.2,.22]);box(a,[27,12,-4],[1.6,24,2],[.2,.45]);
// Ceiling slats open onto the sky; no flat backdrop is moved by the pointer.
for(let k=0;k<7;k++)box(a,[-17+k*2.9,23.7,8],[.34,.7,36],[.15,.4]);
for(let side of[-1,1]){box(a,[side*22,.65,-9],[.28,1.3,39],[.2,.5]);for(let z=-28;z<=10;z+=3)box(a,[side*22,1.7,z],[.075,2,.075],[.1,.3]);box(a,[side*22,2.7,-9],[.13,.11,39],[.1,.5]);}
// Foreground monolith establishes near-field perspective.
box(a,[18.8,3.4,8],[3.4,6.8,2.8],[.2,.63],-.12);box(a,[-19,.5,13],[4,1,4],[.2,.35]);geometry.arch=mesh(a);
a=[];for(let k=0;k<3;k++)tube(a,t=>{let ang=t*PI;return[Math.cos(ang)*(26+k*2.5),Math.sin(ang)*(21.8+k*.7),10-k*20];},.035,100,5,[k*.19,0]);
for(let x of[-21.6,21.6])tube(a,t=>[x,2.75,mix(10,-28,t)],.025,8,5,[.4,0]);geometry.archLights=mesh(a);
// Distant skyline spanning across the bay behind the pavilion, fully grounded on the water plane.
a=[];
{
  let citySeed=4821;
  function cityRandom(){citySeed=(Math.imul(1664525,citySeed)+1013904223)|0;return(citySeed>>>0)/4294967296;}
  function tower(out,x,z,h,w,d,rot,seedVal){
    let pHeight=Math.min(h*0.32,3.2);
    // Base podium grounded at y = -0.5 into the water plane to guarantee solid footing
    box(out,[x,pHeight*0.5-0.25,z],[w,pHeight+0.5,d],[seedVal,0.2],rot);
    if(h>2.8){
      let hasSetback=h>6.5;
      let midH=hasSetback?h*0.68:h;
      let midY=pHeight+(midH-pHeight)*0.5;
      let sw=w*0.82,sd=d*0.82;
      box(out,[x,midY,z],[sw,midH-pHeight,sd],[seedVal,0.0],rot);
      if(hasSetback){
        let topH=h-midH;
        let topY=midH+topH*0.5;
        let tw=sw*0.75,td=sd*0.75;
        box(out,[x,topY,z],[tw,topH,td],[seedVal,0.4],rot);
        box(out,[x,h+0.3,z],[tw*0.48,0.6,td*0.48],[seedVal,0.7],rot);
        if(h>11.0){
          box(out,[x,h+1.5,z],[0.08,2.8,0.08],[seedVal,1.0],0);
        }
      }
    }
  }
  // Full panoramic skyline across the sound (where it was originally: x from -68 to +68)
  for(let i=0;i<210;i++){
    let x=(cityRandom()-0.5)*136;
    let z=-72-cityRandom()*44;
    // Clearance: avoid pavilion floor and near camera path so no tower blocks the view
    if(Math.abs(x)<18&&z>-88)continue;
    if(Math.hypot(x+76,z+80)<24)continue;
    let h=2.5+Math.pow(cityRandom(),2.6)*15.5;
    let w=0.9+cityRandom()*2.0;
    let d=0.8+cityRandom()*1.7;
    let rot=(cityRandom()-0.5)*0.20;
    tower(a,x,z,h,w,d,rot,cityRandom());
  }
}
geometry.city=mesh(a);
// Heightfield mountain ranges extend into the volume of the scene.
a=[];function height(x,z){let ridge=fbm(x*.024,z*.024);let edge=smooth(-85,-160,z);return (Math.pow(ridge,1.4)*64+Math.abs(Math.sin(x*.021))*8)*edge+.2;}
for(let j=0;j<54;j++)for(let i=0;i<100;i++){let x=-260+i*5.2,z=-120-j*4.5;let p=[[x,height(x,z),z],[x+5.2,height(x+5.2,z),z],[x+5.2,height(x+5.2,z-4.5),z-4.5],[x,height(x,z-4.5),z-4.5]];let ns=p.map(q=>norm([height(q[0]-.3,q[2])-height(q[0]+.3,q[2]),.6,height(q[0],q[2]-.3)-height(q[0],q[2]+.3)]));triangle(a,p[0],p[1],p[2],[0,0],[[0,0],[1,0],[1,1]],[ns[0],ns[1],ns[2]]);triangle(a,p[0],p[2],p[3],[0,0],[[0,0],[1,1],[0,1]],[ns[0],ns[2],ns[3]]);}geometry.mountains=mesh(a);
geometry.earth=mesh(sphere());
function panels(){let out=[],U=36,V=18;const point=(i,j)=>{let a=i/U*TAU,b=j/V*PI;return[Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)];};for(let j=1;j<V-1;j++)for(let i=0;i<U;i++){let q=[point(i,j),point(i+1,j),point(i+1,j+1),point(i,j+1)],c=mul(q.reduce((a,b)=>add(a,b),[0,0,0]),.25);q=q.map(p=>add(c,mul(sub(p,c),.85)));let N=norm(c);for(let ids of[[0,2,1],[0,3,2]])triangle(out,...ids.map(k=>q[k]),[random(),0],ids.map(k=>[[0,0],[1,0],[1,1],[0,1]][k]),[N,N,N]);}return out;}
geometry.shell=mesh(panels());geometry.atmosphere=mesh(sphere(80,40,1.055));
// Three independent orbital planes. Tubes are occluded by the actual globe.
a=[];const center=[9,12,-12],radius=8;
for(let k=0;k<3;k++){let tilt=[.28,-.65,1.10][k],r=10.5+k*.42;tube(a,t=>{let q=t*TAU, x=Math.cos(q)*r,z=Math.sin(q)*r;return[center[0]+x,center[1]+z*Math.sin(tilt),center[2]+z*Math.cos(tilt)];},.022+k*.004,256,6,[k*.32,0]);}
geometry.orbits=mesh(a);
// A larger network trajectory links the globe to the destination pavilion.
a=[];for(let k=0;k<4;k++)tube(a,t=>{let z=mix(-5,-91,t);return[6+Math.sin(t*TAU*1.12+k*.23)*mix(8,4,t),mix(12,3,t)+Math.sin(t*TAU+k*.23)*3,z];},.02,260,5,[k*.21,0]);geometry.network=mesh(a);
// Software chapter: floor plates, columns and glass volumes assemble in depth.
a=[];for(let level=0;level<6;level++){let y=level*2.3+.35,w=11.8-level*.48,d=10.8-level*.40;box(a,[0,y,-77],[w,.34,d],[level*.08,.95]);for(let side of[-1,1]){for(let side2 of[-1,1])box(a,[side*(w/2-.55),y+1,-77+side2*(d/2-.55)],[.28,2.0,.28],[level*.08,.9]);}box(a,[0,y+1,-77],[w-1.6,1.72,d-1.6],[level*.08,.1]);}
for(let i=0;i<14;i++)box(a,[-14+i*2.1,.15,-67],[1.72,.3,3.4],[i/28,.95]);geometry.building=mesh(a);
a=[];arch(a,-69,18,16,.75,1.3);arch(a,-86,18,16,.75,1.3);for(let x of[-18,18])box(a,[x,8,-77.5],[.5,16,17],[.1,.75]);geometry.pavilion=mesh(a);
a=[];tube(a,t=>[Math.cos(t*PI)*17.4,Math.sin(t*PI)*15.7,-68.9],.035,150,6,[.4,0]);for(let k=0;k<6;k++)tube(a,t=>[mix(-5.7,5.7,t),.55+k*2.3,-71.5+k*.2],.025,3,5,[k*.08,0]);geometry.buildLights=mesh(a);
a=[];triangle(a,[-320,0,65],[320,0,65],[320,0,-410]);triangle(a,[-320,0,65],[320,0,-410],[-320,0,-410]);geometry.floor=mesh(a);
// Folded leaf surfaces and branched stems. Fully geometric, including their reflections.
a=[];let planters=[];
for(const [x,z,h] of [[-18,14,5],[23,6,8],[-22,-24,5],[23,-25,6],[-15,-66,5],[16,-66,6]]){
 box(planters,[x,.45,z],[2.5,.9,2.5],[.2,.66]);tube(a,t=>[x+Math.sin(t*2.)*.25,.6+t*h,z],.11,10,6,[.1,0]);
 for(let b=0;b<14;b++){let ang=random()*TAU,by=h*(.30+random()*.5)+.6,reach=1+random()*1.6;const branch=t=>[x+Math.cos(ang)*reach*t,by+t*(.35+reach*.22),z+Math.sin(ang)*reach*t];tube(a,branch,.027,5,4,[.2,0]);
  for(let k=0;k<22;k++){let t=.2+random()*.8,c=add(branch(t),[(random()-.5)*1.3,(random()-.5)*.7,(random()-.5)*1.3]),dir=norm([Math.cos(ang)+(random()-.5),.2+random()*.7,Math.sin(ang)+(random()-.5)]),side=norm(cross(dir,[0,1,0])),L=.3+random()*.38,W=L*.22,p0=sub(c,mul(dir,L*.5)),tip=add(c,mul(dir,L*.5)),left=add(c,mul(side,W)),right=sub(c,mul(side,W)),fold=add(c,[0,.07,0]);let d=[random(),1];triangle(a,p0,left,fold,d);triangle(a,left,tip,fold,d);triangle(a,tip,right,fold,d);triangle(a,right,p0,fold,d);}
 }
}
geometry.greenery=mesh(a);geometry.planters=mesh(planters);
// The west terrace is an extension of the same world, not a second canvas.
const tomorrowCenter=[-76,10,-80];
a=[];const ribbonSteps=224,ribbonAcross=16;
for(let lane=0;lane<3;lane++)for(let i=0;i<ribbonSteps;i++)for(let j=0;j<ribbonAcross;j++){
 const uv=[[i/ribbonSteps,j/ribbonAcross],[(i+1)/ribbonSteps,j/ribbonAcross],[(i+1)/ribbonSteps,(j+1)/ribbonAcross],[i/ribbonSteps,(j+1)/ribbonAcross]];
 for(const ids of [[0,1,2],[0,2,3]])for(const id of ids)vertex(a,[0,0,0],[0,1,0],uv[id],[lane,0]);
}
geometry.ribbons=mesh(a);geometry.core=mesh(sphere(40,24));
a=[];
// A low, physically modeled annular terrace frames the reflection without a UI panel.
for(let j=0;j<160;j++){
 const t=j/160*TAU,t2=(j+1)/160*TAU;
 const p=(r,t,y)=>[-76+Math.cos(t)*r,y,-80+Math.sin(t)*r];
 const q=[p(9.6,t,.13),p(9.6,t2,.13),p(12.,t2,.13),p(12.,t,.13)];
 triangle(a,q[0],q[1],q[2]);triangle(a,q[0],q[2],q[3]);
 const q2=[p(12.,t,0),p(12.,t2,0),p(12.,t2,.13),p(12.,t,.13)];
 triangle(a,q2[0],q2[1],q2[2]);triangle(a,q2[0],q2[2],q2[3]);
}
geometry.tomorrowTerrace=mesh(a);
// Extend western foothills behind Tomorrow terrace without intruding on the central lake.
a=[];
const foothill=(x,z)=>height(x,-120)*smooth(-88,-120,z)*smooth(-42,-58,x);
for(let j=0;j<16;j++)for(let i=0;i<45;i++){
 let x=-260+i*4.8,z=-88-j*2;
 let q=[[x,foothill(x,z),z],[x+4.8,foothill(x+4.8,z),z],[x+4.8,foothill(x+4.8,z-2),z-2],[x,foothill(x,z-2),z-2]];
 let ns=q.map(v=>norm([foothill(v[0]-.3,v[2])-foothill(v[0]+.3,v[2]),.6,foothill(v[0],v[2]-.3)-foothill(v[0],v[2]+.3)]));
 triangle(a,q[0],q[1],q[2],[0,0],[[0,0],[1,0],[1,1]],[ns[0],ns[1],ns[2]]);
 triangle(a,q[0],q[2],q[3],[0,0],[[0,0],[1,1],[0,1]],[ns[0],ns[2],ns[3]]);
}
geometry.mountainSkirt=mesh(a);
a=[];arch(a,-99,27,23,1.1,2.5);arch(a,-106,30,24,.9,1.5);geometry.tomorrowArch=mesh(a);
a=[];
for(let k=0;k<3;k++)tube(a,t=>[-76+Math.cos(t*TAU)*(9.45+k*.16),.16,-80+Math.sin(t*TAU)*(9.45+k*.16)],.019,160,5,[k*.27,0]);
// Sweeping light curves join the old pavilion to the new plaza.
for(let k=0;k<3;k++)tube(a,t=>[mix(-9,-76,t),.22+Math.sin(t*PI)*.25,-62-Math.sin(t*PI*.65)*18+k*.45],.025,180,5,[k*.19,0]);
geometry.tomorrowLights=mesh(a);
// Four appended destinations, each physically modeled in the shared world.
// Constructed after the original geometry so its seeded materials stay unchanged.
const destinations=[
 {id:'services',center:[-137,0,-55]},
 {id:'research',center:[-191,0,-48]},
 {id:'about',center:[-245,0,-39]},
 {id:'contact',center:[-294,0,-24]}
];
function deck(out,r,y=.28){for(let j=0;j<96;j++){const t=j/96*TAU,u=(j+1)/96*TAU,A=[Math.cos(t)*r,y,Math.sin(t)*r],B=[Math.cos(u)*r,y,Math.sin(u)*r],C=[B[0],0,B[2]],D=[A[0],0,A[2]];triangle(out,[0,y,0],B,A,[.2,.05]);triangle(out,A,B,C,[.2,.1]);triangle(out,A,C,D,[.2,.1]);}}
function ring(out,r,y,z=0,tilt=0,radius=.1){tube(out,t=>{const q=t*TAU;return[Math.cos(q)*r,y+Math.sin(q)*r*Math.cos(tilt),z+Math.sin(q)*r*Math.sin(tilt)];},radius,160,8,[.3,0]);}
// Chamfered modules catch highlights at their edges rather than reading as flat cubes.
function chamferBox(out,c,size,b=.12,rotation=0){
 const h=size.map(v=>v/2),r=h.map(v=>v-b),co=Math.cos(rotation),si=Math.sin(rotation);
 const emit=(q)=>{q=q.map(v=>[c[0]+v[0]*co+v[2]*si,c[1]+v[1],c[2]-v[0]*si+v[2]*co]);if(dot(cross(sub(q[1],q[0]),sub(q[2],q[0])),sub(q[0],c))<0)q.reverse();triangle(out,q[0],q[1],q[2]);if(q.length===4)triangle(out,q[0],q[2],q[3]);};
 for(let axis=0;axis<3;axis++)for(const sign of[-1,1]){const u=(axis+1)%3,v=(axis+2)%3;emit([[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>{const q=[0,0,0];q[axis]=sign*h[axis];q[u]=a*r[u];q[v]=b*r[v];return q;}));}
 for(let a=0;a<3;a++)for(let b=a+1;b<3;b++)for(const sa of[-1,1])for(const sb of[-1,1]){const t=3-a-b;const point=(side,end)=>{const q=[0,0,0];q[a]=sa*(side?h[a]:r[a]);q[b]=sb*(side?r[b]:h[b]);q[t]=end*r[t];return q;};emit([point(0,-1),point(1,-1),point(1,1),point(0,1)]);}
 for(const x of[-1,1])for(const y of[-1,1])for(const z of[-1,1]){const signs=[x,y,z];emit([0,1,2].map(a=>r.map((v,i)=>signs[i]*(i===a?h[i]:v))));}
}
// Architecture and landscape are modeled at human scale around each camera stop.
// Each material is batched once per location, including its reflection pass.
function place(){return{stone:[],glass:[],wood:[],plants:[],lights:[],books:[]};}
function finishPlace(p){return[['stone',13],['glass',17],['wood',16],['plants',8],['lights',3],['books',14]].filter(([key])=>p[key].length).map(([key,mode])=>[mesh(p[key]),mode]);}
function pillar(p,x,z,h=16){box(p.stone,[x,h/2,z],[.55,h,.65],[.2,.85]);box(p.stone,[x,.35,z],[1.2,.7,1.3],[.2,.15]);}
function paving(p,w=45,d=38,z=-1){
 box(p.stone,[0,.1,z],[w,.2,d],[.2,.04]);
 for(let x=-w/2+1;x<w/2;x+=3.2)for(let q=z-d/2+1;q<z+d/2;q+=3.2)box(p.stone,[x,.23,q],[3.13,.13,3.13],[.2,.08]);
}
function windowWall(p,x,z,w,h,y=0){
 box(p.stone,[x,y+.4,z],[w,.8,.65],[.2,.12]);
 box(p.stone,[x,y+h,z],[w,.45,.65],[.2,.18]);
 const bays=Math.ceil(w/3.4),bw=w/bays;
 for(let i=0;i<bays;i++){
  const bx=x-w/2+(i+.5)*bw;
  box(p.glass,[bx,y+h/2,z],[bw-.12,h-.9,.12],[.1,.12]);
  box(p.stone,[bx-bw/2,y+h/2,z+.12],[.09,h,.16],[.2,.9]);
 }
 for(let k=3;k<h;k+=3.1)box(p.stone,[x,y+k,z+.14],[w,.09,.14],[.2,.9]);
}
function railing(p,x,z,w,y=3.5){
 for(let a=-w/2;a<=w/2;a+=1.7)box(p.stone,[x+a,y+.6,z],[.055,1.2,.055],[.2,.9]);
 box(p.stone,[x,y+1.2,z],[w,.055,.07],[.2,.9]);
}
function bench(p,x,z,rot=0){
 const point=(a,b,c)=>[x+a*Math.cos(rot)+c*Math.sin(rot),b,z-a*Math.sin(rot)+c*Math.cos(rot)];
 for(let k=0;k<5;k++)box(p.wood,point(0,.95,-.45+k*.22),[4.3,.13,.17],[.3,.2],rot);
 for(const side of[-1,1])box(p.stone,point(side*1.65,.55,0),[.2,.8,.8],[.2,.9],rot);
 for(let k=0;k<3;k++)box(p.wood,point(0,1.3+k*.2,-.57),[4.3,.15,.1],[.3,.2],rot);
}
function planter(p,x,z,w=4,d=3){
 box(p.stone,[x,.65,z],[w,1.3,d],[.2,.08]);
 box(p.wood,[x,1.31,z],[w-.25,.1,d-.25],[.1,.15]);
}
function tree(p,x,z,h=7){
 // Branched stems and folded leaf blades, not billboard foliage or green spheres.
 const trunk=t=>[x+Math.sin(t*1.6)*.2,1.2+t*h,z];
 tube(p.wood,trunk,.14,12,7,[.2,.4]);
 for(let branch=0;branch<11;branch++){
  const angle=branch*2.399,by=1.2+h*(.40+branch*.043),reach=1.4+h*.20;
  const stem=t=>[x+Math.cos(angle)*reach*t,by+t*1.9,z+Math.sin(angle)*reach*t];
  tube(p.wood,stem,.045,6,5,[.2,.4]);
  for(let leaf=0;leaf<37;leaf++){
   const q=branch*41+leaf,t=.25+hash(q,x)*.75;
   const c=add(stem(t),[(hash(q,z)-.5)*1.8,(hash(q+3,x)-.5)*1.5,(hash(q+9,z)-.5)*1.8]);
   const dir=norm([Math.cos(angle)+(hash(q+5,z)-.5),.2+hash(q+2,z),Math.sin(angle)+(hash(q+6,z)-.5)]);
   const side=norm(cross(dir,[0,1,0])),L=.3+hash(q+7,x)*.34,W=L*.3;
   const a=sub(c,mul(dir,L)),b=add(c,mul(side,W)),tip=add(c,mul(dir,L)),d=sub(c,mul(side,W)),fold=add(c,[0,.1,0]);
   for(const v of[[a,b,fold],[b,tip,fold],[tip,d,fold],[d,a,fold]])triangle(p.plants,...v,[hash(q,z),.8]);
  }
 }
}
function bollard(p,x,z){box(p.stone,[x,.8,z],[.22,1.6,.22],[.2,.9]);box(p.lights,[x,1.48,z+.13],[.12,.13,.025],[.2,0]);}
function desk(p,x,z,w=4){
 box(p.wood,[x,1.7,z],[w,.15,1.9],[.3,.3]);
 for(const a of[-1,1])for(const b of[-1,1])box(p.stone,[x+a*(w/2-.2),.85,z+b*.68],[.1,1.7,.1],[.2,.9]);
 box(p.stone,[x,2.5,z-.4],[1.9,1.12,.12],[.2,.9]);
 box(p.glass,[x,2.5,z-.32],[1.72,.96,.025],[.1,.05]);
 box(p.stone,[x,1.95,z-.4],[.12,.5,.12],[.2,.9]);
 box(p.stone,[x,1.81,z+.35],[1.35,.04,.4],[.2,.8]);
 box(p.wood,[x,1.0,z+1.5],[1,.12,1],[.3,.3]);
 box(p.stone,[x,.5,z+1.5],[.15,1,.15],[.2,.9]);
 box(p.wood,[x,1.7,z+1.95],[1,1.2,.12],[.3,.3]);
}
function stairs(p,x,z,w=10,count=4){for(let k=0;k<count;k++)box(p.stone,[x,.14*(count-k),z+k*.7],[w,.28*(count-k),.75],[.2,.06]);}
// Tomorrow: a campus courtyard, with a glass bridge, planted terraces and colonnades.
let p=place();paving(p,50,42,-1);
for(const side of[-1,1]){
 box(p.stone,[side*21,1.2,-5],[9,2.4,25],[.2,.08]);
 windowWall(p,side*20,-17,12,14,2.4);
 for(let z=-15;z<=10;z+=5)pillar(p,side*17,z,18);
 box(p.stone,[side*21,18,-3],[11,.55,31],[.2,.2]);
 for(let z=-13;z<(side<0?-6:10);z+=6){planter(p,side*21,z,5,4);tree(p,side*21,z,6);}
 bench(p,side*13,12,side*.15);
}
box(p.stone,[0,13,-17],[32,.55,5],[.2,.1]);
windowWall(p,0,-14.4,32,3.5,13.3);
box(p.stone,[0,17.1,-17],[33,.5,6],[.2,.15]);
for(let x=-14;x<=14;x+=7){pillar(p,x,-19,13);box(p.lights,[x,12.6,-14],[4,.055,.12],[.2,0]);}
railing(p,0,19,36,.25);stairs(p,0,21,12,5);
const courtyardParts=finishPlace(p);
// Services: a two-storey engineering lab with a mezzanine, equipment and workstations.
p=place();paving(p,47,39,-1);
windowWall(p,0,-17,43,18);
box(p.stone,[0,8,-13],[44,.45,9],[.2,.15]);railing(p,0,-8.5,44,8.25);
for(const side of[-1,1]){
 for(let z=-16;z<=12;z+=7)pillar(p,side*21,z,19);
 box(p.stone,[side*21,19,-1],[1.1,.65,36],[.2,.9]);
 for(let z=-12;z<12;z+=7){box(p.glass,[side*21,9,z],[.12,16,6.8],[.1,.14]);}
}
for(let x=-20;x<=20;x+=5.7){box(p.stone,[x,19,-1],[.22,.65,35],[.2,.85]);box(p.lights,[x,18.6,-1],[.055,.045,19],[.2,0]);}
for(const x of[-10,-3,4,11])desk(p,x,-10,4.5);
for(let n=0;n<3;n++){
 const x=7+n*3.3;chamferBox(p.stone,[x,3.2,2],[2.5,5.9,2.7],.09);
 box(p.glass,[x,3.2,3.39],[2.16,5.5,.045],[.1,.05]);
 for(let r=0;r<9;r++){box(p.stone,[x,.8+r*.58,3.46],[2.02,.025,.05],[.2,.8]);box(p.lights,[x-.7,.96+r*.58,3.48],[.08,.05,.03],[r*.1,0]);}
}
desk(p,-1,3,6);stairs(p,-15,-8,4,12);
planter(p,-19,-12);planter(p,17,12);tree(p,17,12,6);
destinations[0].parts=finishPlace(p);
// Research: an open-front observatory dome surrounding a real instrument and gallery.
p=place();paving(p,48,41,-1);
for(let j=0;j<12;j++)for(let k=0;k<12;k++){
 const point=(a,b)=>[Math.cos(a)*22*Math.cos(b),2+22*Math.sin(b),-5+Math.sin(a)*22*Math.cos(b)];
 const a=PI+j/12*PI,b=k/12*PI/2,c=a+PI/12,d=b+PI/24;
 const q=[point(a,b),point(c,b),point(c,d),point(a,d)];
 triangle(p.glass,q[0],q[1],q[2],[.2,.3]);triangle(p.glass,q[0],q[2],q[3],[.2,.3]);
}
for(let j=0;j<=12;j++){const a=PI+j/12*PI;tube(p.stone,t=>[Math.cos(a)*22*Math.cos(t*PI/2),2+22*Math.sin(t*PI/2),-5+Math.sin(a)*22*Math.cos(t*PI/2)],.14,32,7,[.2,.9]);}
for(let k=0;k<5;k++){const b=k/5*PI/2;tube(p.stone,t=>[Math.cos(PI+t*PI)*22*Math.cos(b),2+22*Math.sin(b),-5+Math.sin(PI+t*PI)*22*Math.cos(b)],.10,50,6,[.2,.9]);}
windowWall(p,0,-16,33,5);box(p.stone,[0,5.5,-13],[34,.45,6],[.2,.12]);railing(p,0,-10,34,5.7);
for(const x of[-14,14]){pillar(p,x,-12,5.6);desk(p,x,-7,4);}
// Telescope tube, lens rim, mount and tripod establish purpose and scale.
const barrel=t=>[8-t*4,7+t*6,3-t*8];
tube(p.stone,barrel,1.25,8,24,[.2,.25]);
for(const t of[.06,.87]){const c=barrel(t),axis=norm([-4,6,-8]),R=norm(cross(axis,[0,1,0])),U=cross(axis,R);tube(p.stone,q=>add(c,add(mul(R,Math.cos(q*TAU)*1.35),mul(U,Math.sin(q*TAU)*1.35))),.12,60,8,[.2,.9]);}
const lens=barrel(1.001),axis=norm([-4,6,-8]),R=norm(cross(axis,[0,1,0])),U=cross(axis,R);
for(let j=0;j<32;j++){const point=t=>add(lens,add(mul(R,Math.cos(t)*1.19),mul(U,Math.sin(t)*1.19)));triangle(p.glass,lens,point(j/32*TAU),point((j+1)/32*TAU),[.1,.05]);}
box(p.stone,[6,6,0],[3,1.4,2],[.2,.9]);
for(let k=0;k<3;k++){const a=k*TAU/3;tube(p.stone,t=>[6+Math.cos(a)*4*(1-t),.3+t*5.5,Math.sin(a)*4*(1-t)],.17,3,8,[.2,.9]);}
stairs(p,0,19,14,4);for(const x of[-18,18]){const z=x<0?-12:12;planter(p,x,z);if(x>0)tree(p,x,z,5);bollard(p,x,17);}
destinations[1].parts=finishPlace(p);
// About: a planted studio courtyard with desks, bookshelves and a shaded garden.
p=place();paving(p,46,40,0);
windowWall(p,0,-16,42,14);
for(const side of[-1,1]){
 for(let z=-15;z<=13;z+=7)pillar(p,side*20,z,15);
 box(p.stone,[side*20,15,-1],[1,.5,35],[.2,.1]);
 for(let z=-14;z<10;z+=3)box(p.wood,[side*21,7,z],[.20,14,.75],[.3,.3]);
}
for(let z=-16;z<10;z+=1.2)box(p.wood,[0,15.4,z],[43,.22,.42],[.3,.3]);
for(const x of[-12,0,12])desk(p,x,-10,5);
for(let level=0;level<5;level++){
 box(p.wood,[13,1+level*1.1,-15],[8,.12,.7],[.3,.3]);
 for(let book=0;book<15;book++)box(p.books,[9.5+book*.48,1.45+level*1.1,-14.95],[.3,.65+hash(book,level)*.25,.43],[book/15,hash(book+1,level)]);
}
planter(p,5,4,8,6);tree(p,4,4,9);tree(p,7,3,6);
for(const x of[-14,17]){const z=x<0?-12:11;planter(p,x,z,4,3);if(x>0)tree(p,x,z,5);}
bench(p,-3,7,.15);bench(p,12,7,-.15);stairs(p,0,21,12,4);
destinations[2].parts=finishPlace(p);
// Contact: an entrance forecourt with a sheltered doorway, planted edges and a promenade.
p=place();paving(p,49,45,0);
for(const x of[-17,17]){
 windowWall(p,x,-17,17,17);
 box(p.stone,[x,17.3,-19],[18,.5,7],[.2,.15]);
 for(let j=0;j<4;j++)box(p.stone,[x-7+j*4.5,8.5,-16.5],[.25,17,.5],[.2,.85]);
}
arch(p.stone,-9,11,18,.85,1.5);arch(p.stone,-15,11,18,.7,1.2);
for(let j=0;j<17;j++){const a=j/16*PI;box(p.stone,[Math.cos(a)*11.35,Math.sin(a)*18.35,-12],[.15,.25,6],[.2,.9]);}
windowWall(p,0,-20,19,10);
for(const x of[-2,2]){box(p.glass,[x,3.2,-19.7],[3.8,6,.14],[.1,.08]);box(p.stone,[x>0?.3:-.3,2.8,-19.4],[.06,1.2,.08],[.2,.9]);}
box(p.stone,[0,7,-15],[10,.4,9],[.2,.18]);box(p.lights,[0,6.75,-10.5],[8,.05,.05],[.2,0]);
stairs(p,0,-4,18,5);
for(const side of[-1,1]){
 for(const z of(side<0?[-13]:[1,12])){planter(p,side*18,z,5,5);if(side>0)tree(p,side*18,z,7);bench(p,side*12,z,.1*side);}
 for(let z=2;z<23;z+=6)bollard(p,side*9,z);
 railing(p,side*18,22,10,.25);
}
destinations[3].parts=finishPlace(p);
// Thin illuminated paths make the camera's lateral travel legible in world space.
a=[];
const pathCenters=[[-90,0,-66],...destinations.map(d=>d.center)];
for(let j=1;j<pathCenters.length;j++)for(let k=0;k<2;k++)tube(a,t=>{const c=pathCenters[j-1],d=pathCenters[j];return[mix(c[0],d[0],t),.2,mix(c[2],d[2],t)+15+Math.sin(t*PI)*4+k*.4];},.03,70,5);
geometry.extensionPaths=mesh(a);
// Continue the floor and mountain horizon past the old world's west boundary.
a=[];triangle(a,[-650,0,65],[-320,0,65],[-320,0,-410]);triangle(a,[-650,0,65],[-320,0,-410],[-650,0,-410]);geometry.extensionFloor=mesh(a);
a=[];
const westHeight=(x,z)=>z>-120?foothill(x,z):height(x,z);
for(let j=0;j<61;j++)for(let i=0;i<70;i++){
 const x=-624+i*5.2,z=-88-j*4.5;
 const q=[[x,westHeight(x,z),z],[x+5.2,westHeight(x+5.2,z),z],[x+5.2,westHeight(x+5.2,z-4.5),z-4.5],[x,westHeight(x,z-4.5),z-4.5]];
 const ns=q.map(v=>norm([westHeight(v[0]-.3,v[2])-westHeight(v[0]+.3,v[2]),.6,westHeight(v[0],v[2]-.3)-westHeight(v[0],v[2]+.3)]));
 triangle(a,q[0],q[1],q[2],[0,0],[[0,0],[1,0],[1,1]],[ns[0],ns[1],ns[2]]);triangle(a,q[0],q[2],q[3],[0,0],[[0,0],[1,1],[0,1]],[ns[0],ns[2],ns[3]]);
}
geometry.extensionMountains=mesh(a);
// Texture format: land mask / shoreline / national outlines / artistic light clusters.
const earthTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,earthTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([60,0,0,0]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
let textureReady=false;const earthImage=new Image();earthImage.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,earthTexture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,earthImage);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);textureReady=true;requestRender();};earthImage.src=window.SCENE_ASSETS.earth;
function target(){let texture=gl.createTexture(),fbo=gl.createFramebuffer(),depth=gl.createRenderbuffer();return{texture,fbo,depth,w:0,h:0};}
let sceneTarget=target(),mirrorTarget=target(),bloomA=target(),bloomB=target();
const msaa={fbo:gl.createFramebuffer(),color:gl.createRenderbuffer(),depth:gl.createRenderbuffer(),w:0,h:0};
function sizeMSAA(w,h){msaa.w=w;msaa.h=h;let samples=Math.min(innerWidth<700?2:4,gl.getParameter(gl.MAX_SAMPLES));gl.bindFramebuffer(gl.FRAMEBUFFER,msaa.fbo);gl.bindRenderbuffer(gl.RENDERBUFFER,msaa.color);gl.renderbufferStorageMultisample(gl.RENDERBUFFER,samples,gl.RGBA8,w,h);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.RENDERBUFFER,msaa.color);gl.bindRenderbuffer(gl.RENDERBUFFER,msaa.depth);gl.renderbufferStorageMultisample(gl.RENDERBUFFER,samples,gl.DEPTH_COMPONENT16,w,h);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,msaa.depth);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Multisample framebuffer unavailable');}

function sizeTarget(t,w,h){if(t.w===w&&t.h===h)return;t.w=w;t.h=h;gl.bindTexture(gl.TEXTURE_2D,t.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t.texture,0);gl.bindRenderbuffer(gl.RENDERBUFFER,t.depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,t.depth);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Incomplete framebuffer');}
function framebuffer(t){gl.bindFramebuffer(gl.FRAMEBUFFER,t?t.fbo:null);gl.viewport(0,0,t?t.w:canvas.width,t?t.h:canvas.height);}
const media=matchMedia('(prefers-reduced-motion: reduce)');
const state={time:0,progress:0,desired:0,paused:media.matches,drag:0,quality:1,visible:true,testing:false,ready:false,eye:[-2,5.8,27],aim:[1,9,-12],frame:0,frameMS:16,security:0,energy:0,build:0,tomorrow:0,shape:[0,1,0],shapeTarget:[0,1,0]};
let pointer=[0,0],pointerSmooth=[0,0],last=0,raf=0,needsRender=true,resizeNeeded=true,width=0,heightPx=0,pr=1;
const keys=[
 [0,[-2,5.8,27],[1,9,-12]],
 [.17,[2,7.5,20],[4,10,-12]],
 [.36,[31,14,8],[3,11,-7]],
 [.55,[38,15,-31],[5,11,-19]],
 [.72,[9,6,-38],[-5,6,-74]],
 [.90,[-10,5,-49],[-5,6,-78]],
 [1,[-6,4,-55],[-5,6,-79]]
];
function catmull(a,b,c,d,t){return a.map((_,i)=>.5*((2*b[i])+(-a[i]+c[i])*t+(2*a[i]-5*b[i]+4*c[i]-d[i])*t*t+(-a[i]+3*b[i]-3*c[i]+d[i])*t*t*t));}
function cameraAt(p){let i=0;while(i<keys.length-2&&p>keys[i+1][0])i++;let t=clamp((p-keys[i][0])/(keys[i+1][0]-keys[i][0]));let result=[];for(let k=1;k<3;k++)result.push(catmull(keys[Math.max(0,i-1)][k],keys[i][k],keys[i+1][k],keys[Math.min(keys.length-1,i+2)][k],t));return result;}
// Leave cameraAt(0..1) untouched. New waypoints continue from its final pose.
const tomorrowKeys=[
 [1,[-6,4,-55],[-5,6,-79]],
 [1.12,[-26,8,-54],[-25,8,-77]],
 [1.28,[-61,11,-46],[-64,10,-78]],
 [1.46,[-83,11,-46],[-83,10,-81]],
 [1.65,[-91,11.5,-52],[-85,10,-81]]
];
function tomorrowCameraAt(p){
 let i=0;while(i<tomorrowKeys.length-2&&p>tomorrowKeys[i+1][0])i++;
 let t=clamp((p-tomorrowKeys[i][0])/(tomorrowKeys[i+1][0]-tomorrowKeys[i][0]));
 // Ease into the lateral departure. It is reversible on native scroll.
 if(i===0)t=t*t*(3-2*t);
 return [1,2].map(k=>catmull(tomorrowKeys[Math.max(0,i-1)][k],tomorrowKeys[i][k],tomorrowKeys[i+1][k],tomorrowKeys[Math.min(tomorrowKeys.length-1,i+2)][k],t));
}
// A separate continuation preserves every original camera pose through 1.65.
const extensionKeys=[
 [1.65,[-91,11.5,-52],[-85,10,-81]],
 [1.82,[-119,10,-19],[-130,9,-55]],
 [1.98,[-146,10,-19],[-143,9,-55]],
 [2.15,[-157,11,-21],[-143,11,-55]],
 [2.30,[-181,11,-10],[-184,11,-48]],
 [2.43,[-200,11,-12],[-197,11,-48]],
 [2.60,[-216,12,-13],[-201,11,-48]],
 [2.77,[-235,10,0],[-239,9,-39]],
 [2.88,[-254,10,-2],[-251,9,-39]],
 [3.05,[-269,11,-3],[-254,10,-39]],
 [3.22,[-283,11,16],[-288,11,-24]],
 [3.33,[-303,11,15],[-300,11,-24]],
 [3.50,[-311,12,10],[-299,11,-26]]
];
function extensionCameraAt(p){
 let i=0;while(i<extensionKeys.length-2&&p>extensionKeys[i+1][0])i++;
 const t=clamp((p-extensionKeys[i][0])/(extensionKeys[i+1][0]-extensionKeys[i][0]));
 return [1,2].map(k=>catmull(i?extensionKeys[i-1][k]:tomorrowKeys[3][k],extensionKeys[i][k],extensionKeys[i+1][k],extensionKeys[Math.min(extensionKeys.length-1,i+2)][k],t));
}
function setUniforms(cam,vp,clip){use(solid);uni('uCam',cam);uni('uVP',vp);uni('uTime',state.time);uni('uBuild',state.build);uni('uSecurity',state.security);uni('uEnergy',state.energy);uni('uClip',clip);uni('uTomorrow',state.tomorrow);uni('uShape',state.shape);bindTexture('uEarth',earthTexture,0);}
let drawCalls=0,triangles=0;
function draw(mesh,mode,model=I()){int('uMode',mode);uni('uModel',model);gl.bindVertexArray(mesh.vao);gl.drawArrays(gl.TRIANGLES,0,mesh.count);drawCalls++;triangles+=mesh.count/3;}
let activeFov=46/180*PI,proj=I(),mirrorVP=I();
function renderWorld(cam,aim,reflection){let up=reflection?[0,-1,0]:[0,1,0],vp=multiply(proj,look(cam,aim,up)),front=norm(sub(aim,cam)),right=norm(cross(front,up)),realUp=norm(cross(right,front));
 gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.disable(gl.BLEND);use(skyProgram);uni('uCam',cam);uni('uFront',front);uni('uRight',right);uni('uUp',realUp);uni('uResolution',[width,heightPx]);uni('uFov',Math.tan(activeFov/2));uni('uTime',state.time);uni('uBuild',state.build);uni('uTomorrow',state.tomorrow);screen();
 gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.clear(gl.DEPTH_BUFFER_BIT);gl.disable(gl.CULL_FACE);setUniforms(cam,vp,reflection?1:0);
 draw(geometry.mountains,7);
 const eastVisible=cam[0]>-150;
 const rot=1.9+state.time*.016+state.progress*.18+state.drag;
 if(eastVisible){draw(geometry.city,4);draw(geometry.arch,0);draw(geometry.greenery,8);draw(geometry.planters,0);draw(geometry.pavilion,0);draw(geometry.building,5);
 draw(geometry.earth,1,matrix(center,radius,rot));draw(geometry.orbits,3);draw(geometry.archLights,3);
 if(state.energy>.01)draw(geometry.network,3);
 if(state.build>.4)draw(geometry.buildLights,3);}
 if(state.progress>1)draw(geometry.mountainSkirt,7);
 if(state.progress>1&&cam[0]>-180){
  draw(geometry.tomorrowTerrace,12);
  draw(geometry.tomorrowArch,12,matrix([-76,0,0]));
  draw(geometry.tomorrowLights,3);
  draw(geometry.ribbons,9,matrix(tomorrowCenter,.72));
  for(const [part,mode] of courtyardParts)draw(part,mode,matrix([-76,-(1-smooth(1.05,1.27,state.progress))*22,-80]));
  draw(geometry.core,11,matrix(tomorrowCenter,.85+state.shape[0]*.65));
  for(let k=0;k<3;k++){
   let t=state.time*.23+k*TAU/3;
   let pos=add(tomorrowCenter,[Math.cos(t)*7.3,Math.sin(t)*4.4,Math.sin(t*.9+k)*2.5]);
   draw(geometry.core,3,matrix(pos,.095));
  }
 }
 // Appended locations stay outside the first four scenes and arrive after Tomorrow.
 if(state.progress>1.65){
  const arrival=smooth(1.65,1.78,state.progress);
  draw(geometry.extensionMountains,7);
  draw(geometry.extensionPaths,3,matrix([0,-(1-arrival)*2,0]));
  for(const destination of destinations){
   if(Math.abs(cam[0]-destination.center[0])>100)continue;
   const position=add(destination.center,[0,-(1-arrival)*28,0]);
   for(const [part,mode] of destination.parts)draw(part,mode,matrix(position));
  }
 }
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);if(eastVisible)draw(geometry.atmosphere,2,matrix(center,radius,rot));
 if(eastVisible&&state.security>.01)draw(geometry.shell,6,matrix(center,radius,rot*.6));gl.depthMask(true);gl.disable(gl.BLEND);
 if(!reflection){use(floorProgram);uni('uExtension',smooth(1.65,1.78,state.progress));uni('uVP',vp);uni('uModel',I());int('uMode',0);uni('uCam',cam);uni('uTime',state.time);uni('uBuild',state.build);uni('uMirrorVP',mirrorVP);uni('uTomorrow',state.tomorrow);bindTexture('uMirror',mirrorTarget.texture,1);draw(geometry.floor,0);if(state.progress>1.65)draw(geometry.extensionFloor,0);}
 return vp;
}
function resize(){width=canvas.clientWidth;heightPx=canvas.clientHeight;let maxDpr=innerWidth<700?1.25:1.5;pr=Math.min(devicePixelRatio||1,maxDpr)*state.quality;let w=Math.max(1,Math.round(width*pr)),h=Math.max(1,Math.round(heightPx*pr));canvas.width=w;canvas.height=h;sizeTarget(sceneTarget,w,h);sizeMSAA(w,h);sizeTarget(mirrorTarget,Math.max(1,Math.round(w*.55)),Math.max(1,Math.round(h*.55)));sizeTarget(bloomA,Math.max(1,Math.round(w*.25)),Math.max(1,Math.round(h*.25)));sizeTarget(bloomB,bloomA.w,bloomA.h);resizeNeeded=false;}
const chapters=[...document.querySelectorAll('.chapter')],chapterLinks=[...document.querySelectorAll('[data-chapter]')];
const expertise=document.getElementById('expertise');
const destinationPanels=[...document.querySelectorAll('.destination')];
let uiIndex=-1,expertiseShown=false;
function updateUI(p=state.progress){
 const index=pIndex(p),enter=smooth(1.15,1.33,p);
 document.documentElement.dataset.chapter=String(index);
 if(index!==uiIndex){
  uiIndex=index;
  chapters.forEach((el,i)=>{let visible=i===index;el.classList.toggle('active',visible);el.setAttribute('aria-hidden',String(!visible));el.inert=!visible;});
  destinationPanels.forEach(el=>{const visible=Number(el.dataset.destination)===index;el.classList.toggle('active',visible);el.inert=!visible;el.setAttribute('aria-hidden',String(!visible));});
  chapterLinks.forEach(el=>{let active=Number(el.dataset.chapter)===index;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
   const chNum=document.getElementById('chapter-number');if(chNum)chNum.textContent='';
   document.getElementById('chapter-name').textContent=['THE BIG PICTURE','SECURITY & DEFENSE','CUT THE BUSYWORK','CUSTOM SOFTWARE','WHERE IT ALL CONNECTS','THE WORKSHOP · SERVICES','THE OBSERVATORY · RESEARCH','THE STUDIO · ABOUT','THE SIGNAL PLAZA · CONTACT'][index];
  }
  const shown=p>=1.27&&index===4;
  if(shown!==expertiseShown){expertiseShown=shown;expertise.inert=!shown;expertise.setAttribute('aria-hidden',String(!shown));}
  expertise.style.setProperty('--arrival',(index>4?0:enter).toFixed(4));
  expertise.style.setProperty('--arrival-y',`${((1-enter)*38).toFixed(2)}px`);
  document.querySelector('.stage').style.setProperty('--tomorrow',state.tomorrow.toFixed(4));
  document.documentElement.classList.toggle('in-tomorrow',p>1.20&&index===4);
  document.documentElement.classList.toggle('in-destination',index>=5);
  document.getElementById('journey-progress').style.transform=`scaleX(${p/MAX_PROGRESS})`;
  const invite=document.querySelector('.scroll-invite');
  if(index===8){invite.textContent='BACK TO THE BEGINNING';invite.dataset.chapter='0';}else{invite.textContent='SCROLL TO MOVE FURTHER';invite.dataset.chapter=String(Math.min(index+1,8));}
}
function render(){if(resizeNeeded)resize();const p=state.paused&&!state.testing?[.04,.31,.52,.9,1.49,1.98,2.43,2.88,3.33][pIndex(state.desired)]:state.progress;let [cam,aim]=p<=1?cameraAt(p):p<=1.65?tomorrowCameraAt(p):extensionCameraAt(p);if(width<700){let delta=sub(cam,aim);cam=add(aim,mul(delta,1.22));aim[1]-=1.5;
  const mobileArrival=smooth(1.12,1.40,p)*(1-smooth(1.65,1.82,p));
  if(mobileArrival>0){cam=cam.map((v,i)=>mix(v,[-80,14,-42][i],mobileArrival));aim=aim.map((v,i)=>mix(v,[-76,-1.5,-80][i],mobileArrival));}
  }cam[0]+=pointerSmooth[0]*.28;cam[1]+=pointerSmooth[1]*.12;aim[0]+=pointerSmooth[0]*.08;aim[1]+=pointerSmooth[1]*.05;state.eye=cam;state.aim=aim;
  state.security=smooth(.17,.29,p)*(1-smooth(.42,.51,p));state.energy=smooth(.37,.5,p);state.build=smooth(.65,.93,p);state.tomorrow=smooth(1.05,1.31,p);
  let fovVelocity=clamp(Math.abs(state.desired-state.progress)*4.,0.,1.)*(2.2*PI/180.);
  activeFov=(width<700?60:46)*PI/180+fovVelocity;proj=projection(activeFov,width/heightPx);drawCalls=0;triangles=0;
 let mirrorCam=[cam[0],-cam[1],cam[2]],mirrorAim=[aim[0],-aim[1],aim[2]];framebuffer(mirrorTarget);mirrorVP=renderWorld(mirrorCam,mirrorAim,true);
 framebuffer(msaa);renderWorld(cam,aim,false);gl.bindFramebuffer(gl.READ_FRAMEBUFFER,msaa.fbo);gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,sceneTarget.fbo);gl.blitFramebuffer(0,0,msaa.w,msaa.h,0,0,sceneTarget.w,sceneTarget.h,gl.COLOR_BUFFER_BIT,gl.NEAREST);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);
 use(blurProgram);framebuffer(bloomA);int('uExtract',1);uni('uDirection',[0,0]);bindTexture('uTexture',sceneTarget.texture,0);screen();
 framebuffer(bloomB);int('uExtract',0);uni('uDirection',[1/bloomA.w,0]);bindTexture('uTexture',bloomA.texture,0);screen();
 framebuffer(bloomA);uni('uDirection',[0,1/bloomA.h]);bindTexture('uTexture',bloomB.texture,0);screen();
 framebuffer(null);use(finalProgram);bindTexture('uTexture',sceneTarget.texture,0);bindTexture('uBloom',bloomA.texture,1);uni('uTime',state.time);uni('uBuild',state.build);screen();gl.depthMask(true);state.frame++;needsRender=false;updateUI(p);window.dispatchEvent(new Event('scene-frame'));
 if(!state.ready&&textureReady){state.ready=true;document.documentElement.classList.add('scene-ready');status.textContent='';window.dispatchEvent(new Event('scene-ready'));}
}
function pIndex(p){return p<.21?0:p<.43?1:p<.69?2:p<1.13?3:p<1.78?4:p<2.23?5:p<2.68?6:p<3.13?7:8;}
function requestRender(){needsRender=true;if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
function frame(now){raf=0;if(document.hidden||state.testing)return;const dt=Math.min(.05,(now-(last||now))/1000);last=now;
 state.frameMS=mix(state.frameMS,Math.max(1,dt*1000),.05);
 if(!state.paused){state.time+=dt;state.progress=mix(state.progress,state.desired,1-Math.exp(-dt*7));pointerSmooth=pointerSmooth.map((v,i)=>mix(v,pointer[i],1-Math.exp(-dt*3)));}
 else{state.progress=state.desired;pointerSmooth=[0,0];}
 if(state.paused)state.shape=[...state.shapeTarget];
 else state.shape=state.shape.map((v,i)=>mix(v,state.shapeTarget[i],1-Math.exp(-dt*3.8)));
 const moving=Math.abs(state.progress-state.desired)>.0001;
 if(state.visible&&(needsRender||moving||!state.paused))render();
 if(state.visible&&!state.paused)raf=requestAnimationFrame(frame);
}
function scroll(){
 const section=document.getElementById('journey'),r=section.getBoundingClientRect();
 state.desired=clamp(-r.top/(section.offsetHeight-innerHeight)*MAX_PROGRESS,0,MAX_PROGRESS);
 state.visible=r.bottom>0&&r.top<innerHeight;
 requestRender();
}
addEventListener('scroll',scroll,{passive:true});addEventListener('resize',()=>{resizeNeeded=true;scroll();},{passive:true});
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointer=[(e.clientX/innerWidth-.5)*2,(.5-e.clientY/innerHeight)*2];}},{passive:true});
document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else requestRender();});
const motionButton=document.getElementById('motion');function syncMotion(){motionButton.setAttribute('aria-pressed',String(!state.paused));motionButton.textContent=state.paused?'Motion off':'Motion on';document.documentElement.classList.toggle('motion-off',state.paused);requestRender();}motionButton.addEventListener('click',()=>{state.paused=!state.paused;syncMotion();});media.addEventListener('change',e=>{state.paused=e.matches;syncMotion();});
document.getElementById('quality')?.addEventListener('change',e=>{state.quality=Number(e.target.value);resizeNeeded=true;requestRender();});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0;document.documentElement.classList.add('context-lost');status.innerHTML='The 3D scene was interrupted. <button type="button" id="reload-scene">Reload scene</button>';document.getElementById('reload-scene').addEventListener('click',()=>location.reload());});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
// Deterministic capture hooks. No telemetry or network access.
window.BlueDotScene={
 ready:()=>state.ready,
 maxProgress:MAX_PROGRESS,
 setCapability(index){if(!Number.isInteger(index)||index<0||index>2)return;state.shapeTarget=[0,0,0];state.shapeTarget[index]=1;if(state.paused)state.shape=[...state.shapeTarget];requestRender();},
 capture(progress,time=8){const step=clamp(time-state.time,0,.1);if(!state.paused)state.shape=state.shape.map((v,i)=>mix(v,state.shapeTarget[i],1-Math.exp(-step*3.8)));state.testing=true;cancelAnimationFrame(raf);raf=0;state.progress=clamp(progress,0,MAX_PROGRESS);state.desired=state.progress;state.time=time;pointerSmooth=[0,0];render();gl.finish();return this.stats();},
 resume(){state.testing=false;last=0;scroll();requestRender();},
 stats(){return{webgl:true,textureReady,progress:state.progress,camera:[...state.eye],target:[...state.aim],frame:state.frame,drawCalls,triangles,canvas:[canvas.width,canvas.height],paused:state.paused,shape:[...state.shape],tomorrow:state.tomorrow,location:pIndex(state.progress)>=5?destinations[pIndex(state.progress)-5].id:null,error:gl.getError()};}
};
syncMotion();scroll();requestRender();
})();
