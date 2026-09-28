
var pos;
var prev;

let hrTable;
let weatherTable;
let stepsTable;

let hrTableCity1;
let weatherTableCity1;
let stepsTableCity1;

let hrTableCity2;
let weatherTableCity2;
let stepsTableCity2;

let stepsData = [];
let heart_rate = [];
let weather_data = [];
let pause = false;
let showGrid = false;
let checkBox; 
//res 1920×1080
const canvasWidth = 1920*0.8;
const canvasHeight = 1080*0.9;

const dayCanvasWidth = canvasWidth * 0.16 ;
const dayCanvasHeight = canvasHeight * 0.20;

let dCanvas = [];
let days = [];
let gridCanvas;

let sel;

const numberOfDays = 30;

let dropdown
let pauseButton;

async function setup() 
{

  hrTableCity1 = await loadTable('assets/berlinAvgHR.csv', ',', 'header');
  weatherTableCity1 = await loadTable('assets/berlin.csv', ',', 'header');
  stepsTableCity1 = await loadTable('assets/berlinSteps.csv', ',', 'header');

  hrTableCity2 = await loadTable('assets/sydneyAvgHR.csv', ',', 'header');
  weatherTableCity2 = await loadTable('assets/sydney.csv', ',', 'header');
  stepsTableCity2 = await loadTable('assets/sydneySteps.csv', ',', 'header');

  hrTable = hrTableCity1;
  weatherTable = weatherTableCity1
  stepsTable = stepsTableCity1;

  dropdown = createSelect(); 
  dropdown.option("berlin"); 
  dropdown.option("sydney"); 
  dropdown.changed(changeData);

  pauseButton = createButton('Pause');
  pauseButton.mousePressed(pauseSketch);

  checkbox = createCheckbox('Show Grid', showGrid);
  checkbox.changed( () => { showGrid = !showGrid; } );

	createCanvas(canvasWidth, canvasHeight);
  colorMode(HSB, 360, 100, 100, 100)
  //angleMode(DEGREES);
  //background(20);

  gridCanvas = createGraphics(canvasWidth, canvasHeight );
  gridCanvas.pixelDensity(1);


  frameRate(30);
  //noLoop();
  //filter(BLUR );

  resetSketch();
  //calculateHrAvg()
  pixelDensity(1);

  return;
}

function draw()
{
  background(20);
  
  if(showGrid)
  {
    createGrid();
    image(gridCanvas, 0, 0)
  }

  let i = 0;
  for (var y = 0; y < height; y += height / 5) {
    for (var x = 0; x < width; x += width / 6) {
      days[i].draw(x,y);
      i++;
		}
	}

  //for debug
  //drawDebug()
}

function drawDebug()
{
  fill(0);
  textSize(20);
  text("FPS: " + frameRate().toFixed(2), 10, 30);
  text("PD: " + pixelDensity().toFixed(2), 10, 50);
}

function createGrid()
{
  for (var x = 0; x < width; x += width / 6) {
		for (var y = 0; y < height; y += height / 5) {
			gridCanvas.stroke(0);
			gridCanvas.strokeWeight(1);
			gridCanvas.line(x, 0, x, height);
			gridCanvas.line(0, y, width, y);
		}
	}
}

function calculateHrAvg()
{
  let exampleTable = new p5.Table(); 
  exampleTable.addColumn("time_stamp"); 
  exampleTable.addColumn("avg_hr"); 

  let sum = 0;
  let noOfEntries = 0;
  for(let i = 0 ; i < heart_rate.length ; i++)
  {
    let avg = 0;
    let hour = heart_rate[i].time.getHours();
    
    sum += heart_rate[i].hr;
    noOfEntries++;
    
    if(i+1 >= heart_rate.length || heart_rate[i+1].time.getHours() != hour)
    {
      avg = round(sum / noOfEntries);
      //console.log(heart_rate[i].time, avg , sum , noOfEntries)
      let newRow = exampleTable.addRow(); 
      newRow.setString("time_stamp", heart_rate[i].time);
      newRow.setNum("avg_hr", avg);
      sum = 0;
      noOfEntries = 0;
    }

  }
  //save(exampleTable, "/test2.csv");
}

function keyPressed() {
  if (keyCode  === 80) {
    pauseSketch()
  }  
}

function changeData()
{
  let city = dropdown.value();
  console.log(city);
  if(city === 'berlin')
  {
    hrTable = hrTableCity1;
    weatherTable = weatherTableCity1
    stepsTable = stepsTableCity1;
  }
  else if (city === 'sydney')
  {
    hrTable = hrTableCity2;
    weatherTable = weatherTableCity2;
    stepsTable = stepsTableCity2;
  }
  resetSketch();
}

function resetSketch()
{
  for (let d = 0; d < 30; d++)
  {
    let stepsObject = {};
    stepsObject.time = new Date(stepsTable.getString(d, 0));
    stepsObject.steps = stepsTable.getNum(d, 1);

    stepsData[d] = stepsObject;

  }

  for (let r = 0; r < hrTable.getRowCount(); r++)
  {
    let hr_object = {};
    hr_object.time = new Date(hrTable.getString(r, 0));
    hr_object.hr = hrTable.getNum(r, 1);

    heart_rate[r] = hr_object;
  }

  for (let r = 0; r < weatherTable.getRowCount(); r++)
  {
    let weather_object = {};

    weather_object.time = new Date(weatherTable.getString(r, 1));
    weather_object.temp = weatherTable.getNum(r, 2);
    weather_object.feelsLike = weatherTable.getNum(r, 3);
    weather_object.dew = weatherTable.getNum(r, 4);
    weather_object.humidity = weatherTable.getNum(r, 5);
    weather_object.precip = weatherTable.getNum(r, 6);
    weather_object.precipType = weatherTable.getString(r, 8);

    weather_object.snow = weatherTable.getNum(r, 9);
    weather_object.snowDepth = weatherTable.getNum(r, 10);

    weather_object.windGust = weatherTable.getNum(r, 11);
    weather_object.windSpeed = weatherTable.getNum(r, 12);
    weather_object.windDir = weatherTable.getNum(r, 13);

    weather_object.cloudCoverage = weatherTable.getNum(r, 15);
    weather_object.solarEnergy = weatherTable.getNum(r, 18);
    weather_object.uvIndex = weatherTable.getNum(r, 19);

    weather_data[r] = weather_object;
    //print(map(weather_object.humidity, 60, 100, 5, 12));
    //print(hr_object);
    //print(heart_rate[r].time + '::' + heart_rate[r].hr);
  }

  for(let i = 0 ; i < numberOfDays; i++)
  {
    days[i] = new Day(dayCanvasWidth, dayCanvasHeight,stepsData[i].steps, heart_rate.slice(i*24, (i*24)+24), weather_data.slice(i*24, (i*24)+24));
  }
}

function pauseSketch()
{
  pause = !pause;
   if(pause)
   {
    noLoop();
    pauseButton.html('Resume')
   }
  else
  {
    loop();
    pauseButton.html('Pause')
  }
}