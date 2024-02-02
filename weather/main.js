async function getHttpJson(url){
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error status: ${response.status}`);
    const result = await response.json();
    return result;
}
async function getIp(){
    const json = await getHttpJson('https://api.ipify.org?format=json');
    return json.ip;
}

async function getWeatherJson(){
    const ip = await getIp();
    console.log(ip);
    const json = await getHttpJson(`http://api.weatherapi.com/v1/forecast.json?key=18d1969289a84736870152335232110&q=${ip}&days=7&aqi=no&alerts=no`);
    return json;
    
}

const weatherJson =getWeatherJson()
let hrBlock;





weatherJson.then(obj =>{
    const cur = obj.current;
    console.log(cur)
    document.querySelector('.temp-box').innerHTML ='Temp:'+ + cur.temp_c + '°C' + '<br>' + 'RealFeel:' + cur.feelslike_c + '°C';
    document.querySelector('.country').textContent = obj.location.country;
    document.querySelector('.town').textContent = obj.location.name;
    document.querySelector('.container .img-container img').src = cur.condition.icon;
    obj.forecast.forecastday.forEach((value) =>{
        const li = document.createElement('li');
        li.className='fc-day';
        li.tabIndex = 0;

        const date = document.createElement('div');
        date.className = 'fc-day-date';
        const dayDate =  new Date(value.date);
        date.textContent = dayDate.getDate() +'.'+ (dayDate.getMonth()+1);
        
        const imgContainer = document.createElement('div');
        const img = document.createElement('img');
        imgContainer.className = 'img-container';
        img.src = value.day.condition.icon;
        imgContainer.append(img);

        const temp = document.createElement('div');
        temp.className = 'fc-temp ';
        temp.textContent = value.day.avgtemp_c + '°C';


        li.append(date);
        li.append(imgContainer);
        li.append(temp); 
        li.addEventListener('click',(e, arr = value.hour)=>{
            const container = document.querySelector('.container');
            container.style.height = 'calc(var(--index)*14)';
            container.style.paddingBottom = 'calc(var(--index)*0.5)';
            if(!hrBlock)
            {hrBlock = document.createElement('div');
            hrBlock.className = 'fc-hourly-forecast';
            container.append(hrBlock);
            }
            else hrBlock.replaceChildren();
            for(let i = 1;i<arr.length;i+=3){
                const hourTemp = document.createElement('div');
                hourTemp.className = 'fc-hour';

                const divHour = document.createElement('div');
                divHour.textContent =new Date(arr[i].time).getHours()+":00";

                const divTemp = document.createElement('div');
                divTemp.textContent = arr[i].temp_c + '°C';

                hourTemp.append(divHour);
                hourTemp.append(divTemp);
                hrBlock.append(hourTemp);
            }
            
            

        })
        document.querySelector('.fc-container').append(li);
    })

})










