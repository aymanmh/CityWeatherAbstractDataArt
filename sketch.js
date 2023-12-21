
var pos;
var prev;

let hrTable;
let weatherTable;
let heart_rate = [];
let weather_data = [];
//let HoursInMonth = 720;
const HoursInMonth = 400;

//res 1920×1080
const canvasWidth = 1920;
const canvasHeight = 1000;


let dCanvas = [];
let gridCanvas;

const numberOfDays = 30;

function preload()
{
   hrTable = loadTable('assets/heart_rate.csv', 'csv', 'header');
   weatherTable = loadTable('assets/berlin 2023-11-01 to 2023-11-30.csv', 'csv', 'header');
}

function setup() 
{
	createCanvas(canvasWidth, canvasHeight);
  angleMode(DEGREES);
  background(51);

  gridCanvas = createGraphics(canvasWidth, canvasHeight );

  for(let i = 0 ; i < numberOfDays; i++)
  {
    dCanvas[i] = createGraphics(320, 216 );
    //dCanvas[i].background(8 * i);
  }

  frameRate(60);
  //noLoop();
  //blendMode(BLEND )
  filter(BLUR );
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

  background(51);
  
  let orangeValue = 20;
  colorMode(HSB, 360, 100, 100, 1)

  createGrid();
  //image(gridCanvas, 0, 0)
  
  let i = 0;
  for (var y = 0; y < height; y += height / 5) {
    for (var x = 0; x < width; x += width / 6) {
      //let i = x + x * y;
      //console.log( dCanvas[i]);
      //dCanvas[i].background(8 * i);
      var n1 = noise(1+x*0.005+millis()/1000)
      var n2 = noise(y*0.005-millis()/1000)
      
      //dCanvas[i].fill(111+(i*2 * n1),23 + (i*3*n2),45 + (i/(2+n1+n2)));
      dCanvas[i]. fill(0 + i*20*(n1+n2),100,100);
      //var n = noise(x*0.005+millis()/1000,y*0.005)
      //console.log(n);
      let changeX = map(n1, 0 , 1,  -160,160);
      //console.log(changeX);
      //let changeX = map(mouseX, 0 , width, -160,160);
      let changeY = map(n2, 0 , 1, -108,108);
      //let changeY = map(mouseY, 0 , height, -108,108);
      dCanvas[i].rectMode(CENTER)
      dCanvas[i].rect( changeX+320/2,changeY+216/2, 100, 80);

      image(dCanvas[i], x ,y )
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
