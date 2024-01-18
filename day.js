
class Day{
    constructor(w, h, steps, avgHr, weather)
    {
        //this.canvas = createGraphics(w, h );
        this.cWidth = w;
        this.cHeight = h;
        this.totalSteps = steps
        this.avgHrData = avgHr;
        //console.log(this.avgHrData[23]);
        let n = 0;

        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        const avgWindSpeed = average(weather.map(a => a.windSpeed));
        //console.log(avgWindSpeed)
        const avgWindDir = average(weather.map(a => a.windDir));
        //console.log(avgWindDir)

        let angleChange = map(avgWindSpeed, 0 , 40, 0, 2)
        //console.log(angleChange);
        let incChange = map(avgWindDir, 0 , 360, -0.05,0.05)

        for(let i = 0; i < 24;i++)
        {
            console.log(weather[i].time.getHours());
            let ang = radians(n * (this.angle + angleChange))  ;
            let r = this.scale * sqrt(n);
            
            let x = r * sin(ang);
            let y = r * cos(ang);
            
            this.dayHours[i] = new HourShape(x,y, this.avgHrData[i] , weather[i]);
            n += this.inc + incChange;
        }
    }

    avgHrData = [];
    totalSteps = 0;
    dayHours = [];
    angle = 137.2;
    scale = 15;
    inc = 1.1;

    draw(x1,y1)
    {
        rectMode(CENTER);
        //blendMode(HARD_LIGHT);

        ellipseMode(CENTER)
        push();
        translate(x1 + this.cWidth/2,y1 + this.cHeight/2);

        for(let i = 0; i < 24;i++)
        {
           this.dayHours[i].render(this.totalSteps);

        }
        pop();
    }
}

class HourShape
{
    constructor(x,y,avgHr, weather)
    {
        this.x = x;
        this.y = y;
        this.avgHr = avgHr.hr;
        this.initialRadius = map(this.avgHr, 55 , 120,  10,25);
        this.weather = weather;

        this.numVertices = map(this.weather.humidity, 25, 100, 4, 12);

        this.saturation = 85 + map(this.weather.uvIndex,0,10, 0, 15)
        this.alpha = map(this.weather.cloudCoverage, 0, 100, 70 , 100 );
        this.brightness = map(this.weather.solarEnergy , 0 , 4 , 75, 100)
        //this.color = map(this.weather.temp, -10,40, 0 , 360) % 360 + 180;
        this.color = map(this.weather.feelsLike, -10,40, 175 , 360);
        this.strokeAlpha =  map(this.weather.precip, 0, 25, 50 , 100 );
    }

    x = 0;
    y = 0;
    avgHr = 0;
    weather = {};
    // avg heart rate
    initialRadius = 0;
    // humidity
    numVertices = 0;
    // UV index
    saturation = 0;
    //cloud coverage
    alpha = 0;
    //solar energy
    brightness = 0;
    // feelslike temp
    color = 0;
    // precipitation
    strokeAlpha =  0;

    render(totalSteps)
    {       
        //1000 = fast movement, 10,000 = very slow
        let speed = 11000 - map(this.avgHr, 55, 165, 1000, 10000);
        let n1 = noise(totalSteps*totalSteps+1+this.x*0.005+Date.now()/speed)
        let n2 = noise(totalSteps*totalSteps*this.y*0.005-Date.now()/speed)
        
        let stepsMapped = map(totalSteps, 1000,  23000, 5 , 100)
        //controls pace of movement
        let changeX = map(n1, 0 , 1,  -1*stepsMapped,stepsMapped);
        let changeY = map(n2, 0 , 1, -1*stepsMapped,stepsMapped);

        let colorChange = 0;
        if(this.weather.precipType != '')
        {
            colorChange = map(n2, 0 ,1, -150,150);
        }
        else
        {
            colorChange = map(n2, 0 ,1, -20,20);
        }

        let radius = changeX + this.initialRadius;

        fill(colorChange + this.color , this.saturation,this.brightness,this.alpha);
        stroke(this.weather.time.getHours() , this.strokeAlpha);
        
        for(let i = 0; i < this.numVertices; i++)
        {
            const rad = i * 2 * PI / this.numVertices;
            const xp = (radius/2) * cos(rad);
            const yp = (radius/2) * sin(rad);
            ellipse(changeX + xp + this.x, changeY + yp + this.y, 0.33 * radius);
        }
        ellipse(changeX + this.x, changeY + this.y, radius);
    }
}