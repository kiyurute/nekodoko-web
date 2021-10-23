document.addEventListener("DOMContentLoaded",function (){


    var socket = io();
    var map;
    var markers = []

    socket.on('newjoined',(results) => {
        console.log('results is '+results);

    })

    socket.on('newposdata',(newdata) => {
        console.log(newdata)
        getdata = JSON.parse(newdata)
        let newlat = getdata.queuemessage.latitude.substr(0,getdata.queuemessage.latitude.length-1)
        let newlng = getdata.queuemessage.longitude.substr(0,getdata.queuemessage.longitude.length-1)
        console.log(newlat,newlng)
        var CatLatLng = new google.maps.LatLng(newlat, newlng);
        console.log(CatLatLng)

        let current_num = document.getElementById("datas").firstElementChild.firstElementChild.children[1].innerHTML
        console.log(current_num)

        var Options = {
         zoom: 15,      //地図の縮尺値
         center: CatLatLng,   //地図の中心座標
         mapTypeId: 'roadmap'   //地図の種類
        };

        var marker = new google.maps.Marker({
            position:CatLatLng,
            map:map,
            title:"cat",
            animation:google.maps.Animation.BOUNCE,
            icon:{
                url:"images/pin_5.svg",
                scaledSize: new google.maps.Size(60,60),
            },
            label: {
            text: "　　　　" + String(parseInt(current_num) + 1),
            color: "#2f4f4f" ,
            fontSize: "16px"
            }
        })

        map.setCenter(CatLatLng)

        markers.push(marker)


        setTimeout(function(){ marker.setAnimation(null); }, 2500)

        // let current_num = document.getElementById("dataid-0").innerHTML
        // console.log(parseInt(current_num) + 1)


        let current_minID_lettter = document.getElementById("datas").firstElementChild.firstElementChild.children[1].id.split('_')
        let current_minID_num = parseInt(current_minID_lettter[1])
        

 
        let parent = document.getElementById("datas")

        let  newDataBox = document.createElement('div')
        newDataBox.classList.add('card', 'mb-1', 'mt-1')

        let innerNewBox = document.createElement('div')
        innerNewBox.classList.add('card-body')

        let newCKBX = document.createElement("input")
        newCKBX.checked = true
        newCKBX.classList.add("me-1")
        newCKBX.type = 'checkbox'
        newCKBX.id = 'flexCheck_' + String(current_minID_num - 1)
        newCKBX.classList.add('form-check-input')

        let newID = document.createElement('label')
        newID.classList.add('form-check-label')
        newID.for = 'flexCheck_' + String(current_minID_num - 1)
        newID.id = 'dataid_' +  String(current_minID_num - 1)
        newID.innerHTML = String(parseInt(current_num) + 1)
        
        let newTime = document.createElement('p')
        newTime.classList.add('mb-0')
        newTime.innerHTML = getdata.queuemessage.timestamp.substr(0,getdata.queuemessage.timestamp.length - 5)

        let newDeviceID = document.createElement('p')
        newDeviceID.classList.add('mb-0','letter-small')
        newDeviceID.innerHTML = getdata.queuemessage.deviceid

        let newLatitude = document.createElement('p')
        newLatitude.classList.add('mb-0','letter-small')
        newLatitude.id = 'latitude_' + String(current_minID_num - 1)
        newLatitude.innerHTML = getdata.queuemessage.latitude

        let newLongitude = document.createElement('p')
        newLongitude.classList.add('mb-0','letter-small')
        newLongitude.id = 'longitude_' + String(current_minID_num - 1)
        newLongitude.innerHTML = getdata.queuemessage.longitude

        innerNewBox.appendChild(newCKBX)
        innerNewBox.appendChild(newID)
        innerNewBox.appendChild(newTime)
        innerNewBox.appendChild(newDeviceID)
        innerNewBox.appendChild(newLatitude)
        innerNewBox.appendChild(newLongitude)

        newDataBox.appendChild(innerNewBox)

        parent.insertBefore(newDataBox,parent.firstChild)

        

    })

    
    function success(pos){
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        //const accuracy = pos.coords.accuracy;
    
        // $('#loc').text(`緯度：${lat} 経度：${lng}`);
        // $('#accuracy').text(accuracy);

        var MyLatLng = new google.maps.LatLng(lat, lng);
        console.log(MyLatLng)
        var Options = {
         zoom: 16,      //地図の縮尺値
         center: MyLatLng,    //地図の中心座標
         mapTypeId: 'roadmap'   //地図の種類
        };
        map = new google.maps.Map(document.getElementById('map'), Options);
    
    }
  
    function fail(pos){
        alert('位置情報の取得に失敗しました。エラーコード：');
        const lat = 35.6955495;
        const lng = 139.7348293;

        var MyLatLng = new google.maps.LatLng(lat, lng);
        console.log(MyLatLng)
        var Options = {
         zoom: 16,      //地図の縮尺値
         center: MyLatLng,    //地図の中心座標
         mapTypeId: 'roadmap'   //地図の種類
        };
        map = new google.maps.Map(document.getElementById('map'), Options);

    }

    navigator.geolocation.getCurrentPosition(success,fail);






console.log("hello clinet")
let historybutton = document.getElementById('history-btn');

let url = location.search
console.log(url)

// let latitude = document.getElementById("latitude_1").innerHTML
// console.log(latitude)

let datas = document.querySelector('#datas')

datas.addEventListener('change',handleChange)

let lineAnkers = []

function handleChange(){
    console.log("clicked")
    let posdataarr = document.getElementById('datas')
    let datanum= posdataarr.childElementCount
    lineAnkers = []
    deleteMakers()
    for(let i=0;i<datanum;i++){
        let dataelement = document.getElementById('datas').children[i].firstElementChild.firstElementChild.id.split("_")
        let dataindex = dataelement[1]
        let dbindex = document.getElementById('datas').children[i].firstElementChild.children[1].innerHTML
        let ckbxID = 'flexCheck_' + String(dataindex);
        ckbx = document.getElementById(ckbxID)
        if(ckbx.checked){
            let latID = 'latitude_' + String(dataindex);
            let lngID = 'longitude_' + String(dataindex);
            console.log(latID)
            let checked_latitude = document.getElementById(latID).innerHTML
            let checked_longitude = document.getElementById(lngID).innerHTML
            checked_latitude = checked_latitude.substr(0,checked_latitude.length-1);
            checked_longitude = checked_longitude.substr(0,checked_longitude.length-1);
            console.log(checked_latitude,checked_longitude)
            console.log("ankers",lineAnkers)

            var CheckedLatLng = new google.maps.LatLng(checked_latitude, checked_longitude);
            // lineAnkers.push(CheckedLatLng)

            var marker = new google.maps.Marker({
                position:CheckedLatLng,
                map:map,
                title:"cat",
                // animation:google.maps.Animation.BOUNCE,
                icon:{
                    url:"images/pin_5.svg",
                    scaledSize: new google.maps.Size(60,60),
                },
                label: {
                    text: "　　　　" + dbindex,
                    color: "#2f4f4f" ,
                    fontSize: "16px"
                    }
                
            })

            map.setCenter(CheckedLatLng)

            markers.push(marker)

            // setTimeout(function(){ marker.setAnimation(null); }, 500)
        }else{
            
        }
    }

    // var flightPath = new google.maps.Polyline({
    //     path: lineAnkers,
    //     map:map,
    //     geodesic: true,
    //     strokeColor: '#d2b48c',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    //   });


}

function deleteMakers(idx=null) {
    if(idx == null){
        //生成済マーカーを順次すべて削除する
        for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
        }
          markers = [];	//参照を開放
    }else{
        //生成済マーカーからID指定されたマーカーを削除
        for (var i = 0; i < markers.length; i++) {
            if(idx.indexOf(i) >= 0){
                markers[i].setMap(null);
            }
        }
    }
}



// historybutton.addEventListener('click',() => {
//     console.log("btn pressed!")
// })

// let submitbutton = document.getElementById('submit-button')
// submitbutton.addEventListener('click',() => {
//     let deviceSelect = document.getElementById('device-select').value
//     let datanumSelect = document.getElementById('datanum-select').value
//     console.log(deviceSelect,datanumSelect)
    
// })


})


