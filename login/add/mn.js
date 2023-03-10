import { app, database, ref, gebi, child, get } from "../../main.js";
import { push, update, remove, set } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
const auth = getAuth(app); const dbRef = ref(database);
const edtSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m19.3 8.925-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Z"/></svg>';
let frm = document.forms[0], idUpdt = '', aSn = {valed: {}, Fake: {} }, vUp = { lvrvaled: 0, lvrFake: 0 }, stId,vlFk;

gebi('logaut').onclick = () => {
  signOut(auth).then(() => { 
    let datCoki = new Date();
    datCoki.setDate(-1);
    document.cookie = 'enter=;expires=' + datCoki + ';path=/';
    window.open("../", '_self');
   });
}

/* get Upload */
get(child(dbRef, "updatV/")).then(e => {
  vUp.lvrvaled = e.val().vrvaled;
  vUp.lvrFake = e.val().vrFake
})

/* function zFill(nm,width) {
   nm = ''+nm ;
  while (nm.length < width) {
    nm = '0' + nm
  }
  return nm
} */


frm.onsubmit = (e) => {
  e.preventDefault();
  let namePg = frm.namePg.value, lienPg = frm.lienPg.value, nmbrCcpPg = frm.nmbrCcpPg.value,
    emailPg = frm.emailPg.value, chPg = frm.chPg.value, inf = frm.inf.value,rsltCcp = false;
    idUpdt =frm.idUpdt.value;
  namePg = namePg.trim(); lienPg = lienPg.trim(); nmbrCcpPg = nmbrCcpPg.trim();
  emailPg = emailPg.trim();
if (namePg == '') {
  namePg='بدون إسم'
}
  /* Start  facebook*/
  let inFcbk = lienPg.indexOf('facebook.com');
  if (inFcbk < 0 && lienPg.length > 0) {
    gebi('msageUrl').style.display = 'block';
    setTimeout(() => {
      gebi('msageUrl').style.display = 'none';
    }, 2000);
    return 0
  } else if (inFcbk > -1) {
    lienPg = lienPg.slice(inFcbk + 13, lienPg.length)
  }

  /* End  facebook*/
  /* Start verefail CCP Compte */
  if (!isNaN(nmbrCcpPg) && nmbrCcpPg.indexOf(' ') < 0) {

    if (nmbrCcpPg.length == 12) {
      if (nmbrCcpPg.indexOf('00') == 0) { rsltCcp = true; nmbrCcpPg = nmbrCcpPg.slice(2, nmbrCcpPg.length) }
    } else if (nmbrCcpPg.length == 20) {
      if (nmbrCcpPg.indexOf('0079999900') == 0) { rsltCcp = true; nmbrCcpPg = nmbrCcpPg.slice(10, nmbrCcpPg.length) }
    } else if (nmbrCcpPg.length == 10) { rsltCcp = true }

  }
  if (rsltCcp == false && nmbrCcpPg.length > 0) {
    gebi('msageCcp').style.display = 'block';
    setTimeout(() => {
      gebi('msageCcp').style.display = 'none';
    }, 2000);
    return 0
  }
  /* End verefail CCP Compte */

  if (inFcbk < 0 && lienPg.length > 0) { return 0 }

  if (idUpdt == '' || vlFk == chPg) {
    vUp['lvr'+chPg]++;
    set(ref(database, 'updatV/vr'+ chPg), vUp['lvr'+chPg])
    .then(()=>{
      if (idUpdt == '') {
        stId = 'P' + vUp['lvr'+chPg];
        apdorSt(set);
      } else {
        stId = idUpdt;
        apdorSt(update);
      }
    });
   

  } else {
    vUp.lvrvaled++; vUp.lvrFake++;
    set(ref(database, 'updatV/vrvaled'), vUp.lvrvaled);
    set(ref(database, 'updatV/vrFake'), vUp.lvrFake)
    .then(()=>{
      stId = 'P' +vUp['lvr'+chPg];
      remove(child(dbRef, idUpdt));
      apdorSt(set);
    });
    
  }

  function apdorSt(uppSt) {
    aSn[chPg][stId] = { 0: namePg, 1: lienPg, 2: nmbrCcpPg, 3: emailPg, 4: inf }
    uppSt(ref(database, chPg + '/' + stId),aSn[chPg][stId])
      .then(() => {
        gebi('vlpush').style.display = 'block';
        setTimeout(() => {
          gebi('vlpush').style.display = 'none';
        }, 2000);

        frm.reset();
        let childdv;
        childdv = document.createElement('div');
        childdv.className = 'dvPlc';
        
        if ( vlFk == chPg || idUpdt == '') {
          if (idUpdt == '') {
            gebi(`list${chPg}`).innerHTML += dvUpdt(chPg, stId, aSn[chPg][stId]);
          } else {
            gebi(chPg + '/' + idUpdt).outerHTML = dvUpdt(chPg, stId, aSn[chPg][stId]);
            // idUpdt = ''; 
            upAdd();
          }
        } else {
          remove(child(dbRef, vlFk+'/'+idUpdt));
          gebi(vlFk+'/'+idUpdt).remove();
          upAdd();
          gebi(`list${chPg}`).innerHTML += dvUpdt(chPg, stId, aSn[chPg][stId]);
        }
        function upAdd() {
          gebi('supmt').innerText = 'التعديل';
          frm.sub.value= 'إضافة';
            setTimeout(() => {
              gebi('supmt').innerText = 'الإضافة';
            }, 3000);
        }
      })
      .catch((e) => {
        gebi('errpush').style.display = 'block';
        console.log(e);
        setTimeout(() => {
          gebi('errpush').style.display = 'none';
        }, 2000);
      });
  }
}

function dvUpdt(chPg, stId, aSn) {//{ 0: namePg, 1: lienPg, 2: nmbrCcpPg, 3: emailPg  }
  let fblien = aSn[1].length > 0 ? 'href="https://www.facebook.com/' + aSn[1]+'" target="_blank"' : '',
    prNmCcp = aSn[2].length > 0 ? '0079999900' + aSn[2] : '';
  return `<div id="${chPg}/${stId}" class="dvPlc ${chPg}">
  <span class="cntnr">
  <span  onclick="dltdiv('${chPg}/${stId}')" class="clear" >×</span>
  <a href="#input-box" class="mdfSVG" onclick="upVlu('${chPg}','${stId}')">${edtSVG}</a>
  </span>
  <div class="normal">
    <h2><a ${fblien}> ${aSn[0]}</a></h2><strong>:الايميل</strong> <br> ${aSn[3]}<br><br>
  <strong> :رقم الحساب البريدي </strong><br> ${prNmCcp}<br><br>
  <strong> :معلومات عن الحساب</strong><br> ${aSn[4]}
  </div>
  </div>`
}
/* ############################# result ########################################### */
/* let mydt = 'i'+new Date()*1;
console.log(mydt);
 */


let cmprNmbr = (a, b)=> a.slice(1) - b.slice(1);
rslt('valed');
rslt('Fake');

function rslt(chPg) {
  get(child(dbRef, `${chPg}/`)).then((snp) => {
    /* snp =>  = snapshot */
    if (snp.exists()) {
      let lstPg = '', kys=Object.keys(snp.val());
      kys.sort(cmprNmbr);
      aSn[chPg] = snp.val();
      kys.forEach(e=>{
        lstPg += dvUpdt(chPg, e, aSn[chPg][e]);
      });
      gebi(`list${chPg}`).innerHTML = lstPg;
     
    } else {
      gebi(`list${chPg}`).innerText = "No data available";
    }
    if (chPg == 'Fake') {
      gebi("plWt").className = "n";
      gebi("lod").className = "n";
    }
  })
  
} 



function upVlu(chPg, stId) {
  let fblien = aSn[chPg][stId][1].length > 0 ? 'https://www.facebook.com/' + aSn[chPg][stId][1] : '',
    prNmCcp = aSn[chPg][stId][2].length > 0 ? '0079999900' + aSn[chPg][stId][2] : '';
  vlFk = chPg;
  frm.namePg.value = aSn[chPg][stId][0]; frm.lienPg.value = fblien;
  frm.nmbrCcpPg.value = prNmCcp; frm.emailPg.value = aSn[chPg][stId][3];
  frm.inf.value =aSn[chPg][stId][4];
  frm.chPg.value = chPg; frm.sub.value = 'تعديل';frm.idUpdt.value = stId;
  gebi('supmt').innerText = 'التعديل';
}

function dltdiv(stId) {
  remove(child(dbRef, stId));
  gebi(stId).remove();
}

window.upVlu = upVlu;
window.dltdiv = dltdiv;
document.querySelectorAll('.h2lst').forEach(el => {
  el.onclick = (e) => {
    let nxtEl = el.nextElementSibling;
    if (nxtEl.style.display == "flex") {
      nxtEl.style.display = "none";
      el.firstElementChild.innerHTML = '▼'
    } else {
      nxtEl.style.display = "flex";
      el.firstElementChild.innerHTML = '▲';
      setTimeout(() => {
        window.scrollTo(0, e.layerY);
      }, 20);
    }

  }
})
 /*  let allCcp =
 '00799999001971441301 00799999001857380650 00799999002429688895 00799999002848267563 00799999001673385715 00799999002877269205 00799999000195904704 00799999002559427074 00799999001783284096 00799999000174793721 00799999002905768872 00799999002809847124 00799999001984284683 00799999002673558729 00799999002384063005 00799999001912355788 00799999002491897323 00799999002939317292 00799999001933475210 00799999002397636215 00799999002951239465 00799999002630874849 00799999002802653216 00799999001965521682 00799999002933880830 00799999002877269205 00799999002902255726 00799999001946017795 00799999001577203813 00799999002833459737 00799999002671626489 00799999002294115487 00799999002576733717 00799999002502646572 00799999002590194116 00799999001805676546 00799999002369801483 00799999001919371410 00799999002621214813 00799999002637712670 00799999002832471695 00799999001864448652 00799999002467592421 00799999001427403124 00799999002614488348 00799999002362671789 00799999002905375537 00799999002699574032 00799999002961918389 00799999002475944024 00799999001696332326 00799999000615282652 00799999000434914256 00799999002590194116 00799999001805676546 00799999002369801483 00799999001919371410 00799999002621214813 00799999002637712670 00799999002989463479 00799999002832471695 00799999001864448652 00799999002808685646 00799999002698409741 00799999002465436790 00799999002230422377 00799999002916191522 00799999002873674482 00799999001862877640 00799999002636636455 00799999002808150109 00799999001769743381 00799999001587392208 00799999002845857210 00799999001990355913 00799999002065331190 00799999001990355913 00799999002805872161 00799999002373829796 00799999002877269205 00799999002678775649 00799999000055634459 00799999001970098530 00799999002575197431 00799999002673558729 00799999002905375537 00799999002858839302 00799999002902190736 00799999002804860839 00799999001348157325 00799999002807659928 00799999002765285324'
,arrAllC=allCcp.split(' '),call=0; */
//set(ref(database, 'updatV/vrFake'), vUp.lvrvaled);
/*  arrAllC.forEach(e=>{
  vUp['lvrFake']++;stId='P'+vUp['lvrFake']
  aSn.Fake[stId] = { 0: '', 1: '', 2: e, 3: '', 4: '' }
    qdsf(ref(database, 'Fake/'+stId),aSn.Fake[stId])
      .then(()=>{
        call++;
        console.log(call);
      });
})  */

/* onAuthStateChanged(auth,user=>{
  if (user == null) {
    document.cookie = 'UsrEmail=;expires=' + datCoki + ';path=/';
    window.open('../','_self')
  }
}) */

/* end valedat sign in */


/* const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  }); */

/* const auth =getAuth(app);

})

//vldSgnIn();
function vldSgnIn() {
  let alcokis = document.cookie, mailCoki = '', psCoki = '';
  // alcokis = alcokis.replaceAll('=','=');
  alcokis = alcokis.split('; ')
  alcokis.forEach(e => {
    mailCoki = cokif(e, 'UsrEmail=', mailCoki);
    psCoki = cokif(e, 'UsrPassword=', psCoki);
  })

  function cokif(e, name, elck) {
    if (e.indexOf(name) > -1) {
      elck = e.substring(name.length , e.length)
    }
    return elck
  }


  signInWithEmailAndPassword(auth, mailCoki, psCoki)
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      window.open('../?resignIn','_self','','false')
    });
}

//writeUserData() ;
/*writeUserData(/* 'abdou2Id',/  'abdou2', 'abdou2@gmail.com', 'slimani abdelhadi zuin') 47
 */
//writeUserData() ;
/* 
function writeNewPost(uid, username, picture, title, body) {
  const db = getDatabase();

  // A post entry.
  const postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: picture
  };

  // Get a key for a new Post.
  const newPostKey = push(child(ref(db), 'posts')).key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return update(ref(db), updates);
}

  get data 
  const dbRef = ref(database);
get(child(dbRef, `valedat/`)).then((snp) => {
  if (snp.exists()) {
    let myarr = [];
    snp.forEach(e => {
      myarr.push(e.val());
      console.log(e.key);
    });
    console.log(myarr);
    console.log(myarr.indexOf('abdou@gmail.com',0));
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
}); 

 */