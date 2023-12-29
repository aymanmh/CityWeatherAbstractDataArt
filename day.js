
class Day{
    constructor(w, h, steps, avgHr)
    {
        //this.canvas = createGraphics(w, h );
        this.cWidth = w;
        this.cHeight = h;
        this.totalSteps = steps
        this.avgHrData = avgHr;
        //console.log(this.avgHrData[23]);
        let n = 0;

        for(let i = 0; i < 24;i++)
        {
            
            let ang = radians(n * this.angle);
            let r = this.scale * sqrt(n);
            
            let x = r * sin(ang);
            let y = r * cos(ang);
            
           this.dayHours[i] = new HourShape(x,y, this.avgHrData[i]);
           n += this.inc;

            //ellipse(changeX + x, changeY + y, changeX + 20);
        }

    }

    //changeX = 0;
    //changeY = 0;
    avgHrData = [];
    totalSteps = 0;
    dayHours = [];
    angle = 137.2;
    scale = 15;
    inc = 1.1;
    draw(seed)
    {
        let n = 0;
        this.canvas.background(51);
        //this.canvas.fill(25,100,100);
        this.canvas.rectMode(CENTER);
        //this.canvas.blendMode(OVERLAY  );

        this.canvas.ellipseMode(CENTER)
        this.canvas.push();
        this.canvas.translate(this.cWidth/2,this.cHeight/2);
        //this.canvas.rect( changeX+this.cWidth/2,changeY+this.cHeight/2, 100, 80);
        //this.canvas.rect( changeX,changeY, 100, 80);
        for(let i = 0; i < 20;i++)
        {
            
            let ang = radians(n * this.angle);
            let r = this.scale * sqrt(n);
            
            let x = r * sin(ang);
            let y = r * cos(ang);
            
            var n1 = noise(seed*seed+1+x*0.005+millis()/1000)
            var n2 = noise(seed*seed*y*0.005-millis()/1000)
            
            //controls speed of movement
            let changeX = map(n1, 0 , 1,  -3,3);
            let changeY = map(n2, 0 , 1, -6,6);
            
            this.canvas.fill(seed + 20*(changeX+changeY),100,100);
            this.canvas.noStroke();
            this.canvas.ellipse(changeX + x, changeY + y, changeX + 20);
            n += this.inc;
        }
        this.canvas.pop();
    }

    draw2(seed,x1,y1)
    {
        rectMode(CENTER);
        //blendMode(OVERLAY  );

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
    constructor(x,y,avgHr)
    {
        this.x = x;
        this.y = y;
        this.avgHr = avgHr.hr;
        this.initialRadius = map(this.avgHr, 55 , 120,  10,25);
    }

    x = 0;
    y = 0;
    avgHr = 0;
    initialRadius = 0;
    render(seed)
    {
        //let n1 = noise(seed*seed+1+this.x*0.005+millis()/1000)
        //let n2 = noise(seed*seed*this.y*0.005-millis()/1000)
        
        //1000 = fast movement, 10,000 = very slow
        let speed = 5000;
        let n1 = noise(seed*seed+1+this.x*0.005+Date.now()/speed)
        let n2 = noise(seed*seed*this.y*0.005-Date.now()/speed)
        
        let stepsMapped = map(seed, 1000,  23000, 5 , 100)
        //controls speed of movement
        let changeX = map(n1, 0 , 1,  -1*stepsMapped,stepsMapped);
        let changeY = map(n2, 0 , 1, -1*stepsMapped,stepsMapped);

        let colorChange = map(n2, 0 ,1, -35,35)
        let radius = changeX + this.initialRadius;
        fill(colorChange + 25,100,100);
        noStroke();
        ellipse(changeX + this.x, changeY + this.y, radius);

        let numVertices = 6;
        for(let i = 0; i < numVertices; i++)
        {
            const rad = i * 2 * PI / numVertices;
            const xp = (radius/2) * cos(rad);
            const yp = (radius/2) * sin(rad);
            ellipse(changeX + xp + this.x, changeY + yp + this.y, 0.33 * radius);
        }
    }
}