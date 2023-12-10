
var pos;
var prev;

let hrTable;
let weatherTable;
let heart_rate = [];
let weather_data = [];
//let HoursInMonth = 720;
const HoursInMonth = 400;

const canvasWidth = 1000;
const canvasHeight = 1000;
function preload()
{
   hrTable = loadTable('assets/heart_rate.csv', 'csv', 'header');
   weatherTable = loadTable('assets/berlin 2023-11-01 to 2023-11-30.csv', 'csv', 'header');
}

function setup() 
{
	createCanvas(canvasWidth, canvasHeight);
  background(51);
  noLoop();
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
  let orangeValue = 20;


  for(let hour = 0; hour < HoursInMonth ; hour++ )
  {

        size = canvasWidth - ((canvasWidth)/HoursInMonth) * hour;
        // Use color() function

        let c = color(`hsla(${orangeValue}, 100%, 50%, 1)`);
        // Use fill() function to fill color 
        fill(c); 
        
        // Draw a circle  
        circle(canvasWidth/2, canvasHeight/2, size);
        orangeValue += 1;

  }


}
