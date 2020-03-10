let date=[];
let today_js = new Date;
let today_date = today_js.getFullYear()+'-'+(today_js.getMonth()+1)+'-'+today_js.getDate();
let tomorrow_date = today_js.getDate()+1;
let tomorrow = today_js.getFullYear()+'-'+(today_js.getMonth()+1)+'-'+ tomorrow_date;


let play = false;
let estimate;
let race;


$("#submit").click(function(){
    console.log("click");
    if(checkInp()){
        getEstimation();
        setTimeout(function(){reset()},2500);
    }

})

function checkInp(){ // check if input is correct
    var x = $("#number").val();
    if (isNaN(x)) // this is the code I need to change
    {
    console.log("false");
    return false;
    }else{
        return true;
    }
}

function getEstimation(){
    estimate = $.trim($("#number").val());
    console.log(estimate);
    // race= $.trim($("#race").val());
    // console.log(race);
    sendEstimation(estimate);
}

function reset(){
    $("#number").val('');
    // $("#race").val('');
    location.reload();
}

function sendEstimation(data){
    fetch("/send",
      {
        method: "POST",
        body: JSON.stringify({ estimation: estimate, time:tomorrow}),
        headers: {
          'Content-Type': 'application/json'
        },
      });
}

// ------------- data cleaning and sorting ------------------

// let date = ['2020-1-21','2020-1-24', '2020-1-26','2020-1-30','2020-1-31','2020-2-1','2020-2-2','2020-2-5','2020-2-10','2020-2-12','2020-2-13','2020-2-18','2020-2-20','2020-2-21', '2020-2-24','2020-2-25','2020-2-26','2020-2-28','2020-2-29','2020-3-1','2020-3-2','2020-3-3','2020-3-4','2020-3-5','2020-3-6','2020-3-7','2020-3-8','2020-3-9'];

// console.log(tomorrow);

// let current_data = [1,2,5,6,7,8,11,12,13,14,15,16,17,35,53,57,60,66,71,91,107,130,162,236,343,460,576,589];
let current_data=[];
let predict_data=[];

// ---------------- data updates and align in text ----------------

window.onload = function(){
    getCurrent();
    getEst();
    getChartData();
    getCurrent_est();
}
    

async function getCurrent(){ 
  const res = await fetch("/current");
  const data = await res.json();
  console.log(data);
  $("#confirmed").text(data[0]);
  $("#recovered").text(data[1]);
  $("#death").text(data[2]);
}

async function getCurrent_est(){ 
    const res = await fetch("/current_est");
    const data_est = await res.json();
    data_est.forEach(element => {
        predict_data.push([element.time,element.number]);
    }); 
  }

$("#prediction").text('Predicted Cases on '+tomorrow);


async function getEst(){ 
    const res = await fetch("/est");
    const data_est = await res.json();
    console.log(data_est)
    $("#predict-case").text(data_est[0]);
    $("#people").text(data_est[1]);
  }


// ------------------- data visulization ------------------------
// line charts drawing

async function getChartData(){ 
    const res = await fetch("/getChartData");
    let current_data1 = await res.json();
    current_data1.forEach(element => {
        current_data.push(element.number);
        date.push(element.time);
    }); 

    if(date[date.length-1] == today_date){
        date.push(tomorrow);
        console.log("push tomorrow");
    }
    // control orders to prevent blank array.
    buildCharts(current_data, date);
}

function buildCharts(data, date){ 
    // console.log(current_data1);
    console.log(data)
    console.log(date)
    let myChart = echarts.init(document.getElementById('echarts-input'));

option = {
    title: {
        text: 'CoronaVirus Cases in US',
        subtext: 'data from 1point3acres.com',
        left: 'center',
        align: 'right'
    },
    grid: {
        bottom: 80
    },
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['Current CoronaVirus', 'Prediction'],
        right: 10
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 50,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
    ],
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: false},
            data: date
        }
    ],
    yAxis: [
        {
            name: 'Cases',
            type: 'value',
        }
    ],
    series: [
        {
            name: 'Current CoronaVirus',
            type: 'line',
            animation: true,
            smooth:true,
            lineStyle: {
                width: 2
            },
            color: '#e16262',
            data: data
        },
        {
            name: 'Prediction',
            type: 'scatter',
            // yAxisIndex: 1,
            animation: true,
            smooth:true,
            areaStyle: {},
            data: predict_data
        }
    ]
    };
    myChart.setOption(option)
}

        