
var pos;
var prev;

let hrTable;
let weatherTable;
let stepsTable;
let stepsData = [];
let heart_rate = [];
let weather_data = [];
let pause = false;
//res 1920×1080
const canvasWidth = 1920;
const canvasHeight = 1080;

const dayCanvasWidth = 320;
const dayCanvasHeight = 216;

let dCanvas = [];
let days = [];
let gridCanvas;

let sel;

const numberOfDays = 30;

function preload()
{
   hrTable = loadTable('assets/avg_hr.csv', 'csv', 'header');
   weatherTable = loadTable('assets/berlin 2023-11-01 to 2023-11-30.csv', 'csv', 'header');
   stepsTable = loadTable('assets/steps.csv', 'csv', 'header');
}

function setup() 
{
  let resetButton = createButton('Reset');
  let pauseButton = createButton('Pause');

  resetButton.mousePressed(resetSketch);
  pauseButton.mousePressed(pauseSketch);

  colorMode(HSB, 360, 100, 100, 1)
	createCanvas(canvasWidth, canvasHeight);
  //angleMode(DEGREES);
  background(20);

  gridCanvas = createGraphics(canvasWidth, canvasHeight );



  frameRate(25);
  //noLoop();
  //filter(BLUR );

  for (let d = 0; d < 30; d++)
  {
    let stepsObject = {};
    stepsObject.time = new Date(stepsTable.getString(d, 0));
    stepsObject.steps = stepsTable.getNum(d, 1);

    stepsData[d] = stepsObject;

  }


  for (let r = 0; r < hrTable.getRowCount(); r++)
  //for (let r = 0; r < 5; r++)
  {
    let hr_object = {};
    hr_object.time = new Date(hrTable.getString(r, 0));
    hr_object.hr = hrTable.getNum(r, 1);

    heart_rate[r] = hr_object;
  }


  resetSketch();
  //calculateHrAvg()
  return;
  //count the columns
  print(hrTable.getRowCount() + ' total rows in hrTable');
  print(hrTable.getColumnCount() + ' total columns in hrTable');

  //cycle through the hrTable
  //for (let r = 0; r < hrTable.getRowCount(); r++)
  for (let r = 0; r < 5; r++)
  {
    let hr_object = {};
    hr_object.time = new Date(hrTable.getString(r, 0));
    hr_object.hr = hrTable.getNum(r, 1);

    heart_rate[r] = hr_object
    print(heart_rate[r]);
    //print(hr_object);

 // print(heart_rate[r].time + '::' + heart_rate[r].hr);
  }

  for (let r = 0; r < 5; r++)
  {
    let weather_object = {};

    weather_object.datetime = weatherTable.getString(r, 1);
    weather_object.temp = weatherTable.getNum(r, 2);
    weather_object.feelslike = weatherTable.getNum(r, 3);
    weather_object.dew = weatherTable.getNum(r, 4);
    weather_object.humidity = weatherTable.getNum(r, 5);
    weather_object.precip = weatherTable.getNum(r, 6);

    weather_data[r] = weather_object;
    print(weather_data[r]);
    //print(hr_object);

 // print(heart_rate[r].time + '::' + heart_rate[r].hr);
  }

}

function draw()
{



  background(20);
  
  createGrid();
  //image(gridCanvas, 0, 0)
  
  let i = 0;
  for (var y = 0; y < height; y += height / 5) {
    for (var x = 0; x < width; x += width / 6) {
      //let i = x + x * y;
      //console.log( dCanvas[i]);
      //dCanvas[i].background(8 * i);

      //let changeY = map(mouseY, 0 , height, -108,108);
      //dCanvas[i].rectMode(CENTER)
      //dCanvas[i].rect( changeX+320/2,changeY+216/2, 100, 80);
      //days[i].draw(i);
      days[i].draw2(i,x,y);
      
      //image(days[i].canvas, x ,y )
      i++;

		}
	}


  //image(gridCanvas, 0,0)
 
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
  save(exampleTable, "c:/tool/test.csv");
}

function keyPressed() {
  if (keyCode  === 80) {
    pauseSketch()
  }  
}

function resetSketch()
{
  days = [];
  for(let i = 0 ; i < numberOfDays; i++)
  {
    days[i] = new Day(dayCanvasWidth, dayCanvasHeight,stepsData[i].steps, heart_rate.slice(i*24, (i*24)+24));
  }
}

function pauseSketch()
{
  pause = !pause;
   if(pause)
    noLoop();
  else
    loop();
}