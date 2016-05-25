

var Firmament = {
    
    // color settings
    DayColor: "#6698FF",
    CloudDayColor: "#EEEEEE",
    CloudNightColor: "#333333",
    NightColor: "#07060A",
    StarColor: "#FFFFFF",
    Cloudy: false,
    
    // other settings
    StarAmount: 0.005,
    StarMinSize: 1,
    StarMaxSize: 3,
    StarMovement: .0005,
    
    // intern stuff
    canvas: null,
    ctx: null,
    current: null,
    background: null,
    stars: [],
    moved: 0,
    
    // load up canvas
    Init: function(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    },
    
    // set day
    SetDay: function(){
        // check if day isn't day
        if(this.current != "day") {
            this.current = "day";
            
            // set background color
            this.CalculateBackground();
            this.DrawBackground();
            
            // reset stars
            this.stars = [];
        }
    },
    
    // set to night
    SetNight: function(){
        // check the night
        if(this.current != "night") {
            this.current = "night";
            
            // set background color
            this.CalculateBackground();
            this.DrawBackground();

            // calculate star amount
            var starcount = this.canvas.width * this.canvas.height / 100 * this.StarAmount;
            
            // gimme stars
            for(i = 0; i < starcount; i++) {
                // calculate random position
                var x = Math.random() * this.canvas.width;
                var y = Math.random() * this.canvas.height;
                
                this.AddStar(x, y);
            }
        }
    },
    
    // caclulate the background out of cloudiness and day/night
    CalculateBackground: function() {
        if(this.Cloudy) {
            if(this.current == "day")
                this.background = this.CloudDayColor;
            else
                this.background = this.CloudNightColor;
        }
        else {
            if(this.current == "night")
                this.background = this.NightColor;
            else
                this.background = this.DayColor;
        }
    },    
    
    // draw current background color
    DrawBackground: function() {
        // set background color
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // add a new star to the firmament
    AddStar: function(x, y) {
        // calculate random starsize
        var starsize = Math.random() * (this.StarMaxSize - this.StarMinSize) + this.StarMinSize;

        // create canvas for star
        var starCanvas = document.createElement("canvas");
        var starCanvasContext = starCanvas.getContext("2d");

        // set canvas size
        starCanvas.height = starCanvas.width = starsize * 4;

        // draw the star
        starCanvasContext.beginPath();
        starCanvasContext.arc(starsize * 2, starsize * 2, starsize, 0, 2 * Math.PI, false);
        starCanvasContext.fillStyle = this.StarColor;
        starCanvasContext.fill();

        // to the main canvas
        this.ctx.drawImage(starCanvas, x, y);

        // push to universe
        this.stars.push({
            x: x,
            y: y,
            speed: Math.random(),
            canvas: starCanvas
        });
    },
    
    // animate: redraw background, animate stars
    Animate: function() {
        // set background color
        this.DrawBackground();
        
        // nothing more if cloudy
        if(!this.Cloudy) {
        
            // day or night?
            if(this.current == "day") {
                // sun maybe?
            }
            else if(this.current == "night") {

                // increase move counter
                this.moved += this.StarMovement;

                // loop stars
                for(var i = 0; i < this.stars.length; i++) {
                    // move the star
                    this.stars[i].x += this.stars[i].speed * this.StarMovement;

                    // check if out of bound
                    if(this.stars[i].x > this.canvas.width + 50) {
                        this.stars[i].x = -50;
                        this.stars[i].y = Math.random() * this.canvas.height;
                    }
                    else {
                        // render
                        this.ctx.drawImage(this.stars[i].canvas, this.stars[i].x, this.stars[i].y);
                    }
                }
            }
        }
    },
    
    // tick: add new stars
    Tick: function() {
        // calculate background
        this.CalculateBackground();
    }
    
}