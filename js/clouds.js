

var Clouds = {
    
    // cloud settings
    
    // cloud density, cloudiness from 0 to 100
    Density: 25,
    
    // cloud speed in m/s
    Speed: 6,
    
    // wind direction in degrees
    Direction: 280,
    
    // cloud radius
    Radius: 100,
    
    // alpha factor per layer
    AlphaFactor: 0.01,
    
    // circle factor for cloudiness
    CircleFactor: 0.5,
    
    // speed factor, m/s to pixels
    SpeedFactor: 0.05,
    
    // minimum speed
    MinimumSpeed: 0.1,
    
    // buffer outside the window for spawning new clouds, killing clouds outside this buffer
    // should be bigger than Radius
    Buffer: 200,
    
    // a factor between the Density and the pixels (height*width)
    DensityFactor: 500000,
    
    // factor between the layer count and the density
    LayerFor: 25,
    
    // factor from density to color
    ColorFactor: 0.5,
    
    // color to start with
    StartColor: 255,
    
    // night color
    NightColor: 100,
    
    // day color
    DayColor: 255,
    
    // the factor to spawn new clouds related to width and height and speed
    SpawnFactor: 0.00000000001,
    
    // the random factor from 0 to 1 to kill a cloud if necessary
    KillFactor: 0.3,
    
    // intern stuff
    canvas: null,
    ctx: null,
    targetclouds: null,
    frames: 0,
    overflow: 0,
    storage: [],
    
    // load up canvas
    Init: function(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    },
    
    // generate clouds
    Start: function() {
        // calculate amount of clouds
        this.targetclouds = Math.round(((this.canvas.width * this.canvas.height) / this.DensityFactor) * this.Density);
        
        // loop clouds
        for(i = 0; i < this.targetclouds; i++){
            // generate position
            var x = (this.canvas.width + 2 * this.Buffer) * Math.random() - this.Buffer;
            var y = (this.canvas.height + 2 * this.Buffer) * Math.random() - this.Buffer;

            // generate the cloud
            this.AddCloud(x, y);
        }
        
    },

    // function to add a cloud
    AddCloud: function(x, y) {
        
        // draw the cloud
        var cloudCanvas = this.DrawCloudCanvas();
					
        // save cloud
        this.storage.push({
            x: x,
            y: y,
            speed: Math.random() + this.MinimumSpeed,
            canvas: cloudCanvas
        });

        // finally draw image
        this.ctx.drawImage(cloudCanvas, x - (cloudCanvas.width/2), y - (cloudCanvas.height/2));
    },
    
    // draw a cloud
    // this function is based on Cloudgen.js by https://github.com/Ninjakannon/Cloudgen.js
    // Thanks to Ninjakannon for this awesome piece of code <3
    DrawCloudCanvas: function() {
        // settings
        var radius = this.Radius;
        var color = Math.round(this.StartColor - Math.random() * this.Density * this.ColorFactor);
        var colour = {r:color, g:color, b:color};
        var alpha = Math.random() * this.Density * this.AlphaFactor;
        var circles = Math.round(this.Density * this.CircleFactor);
        
        // Calcualte the radius of the circles used to draw the cloud.
        var circleRadius = radius * 0.6;
        
        // Create the circle's radial gradient.
        var gradient = this.ctx.createRadialGradient(circleRadius, circleRadius, 0, circleRadius, circleRadius, circleRadius);
        var gradientColour = "rgba(" + colour.r + ", " + colour.g + ", " + colour.b + ", ";
        
        gradient.addColorStop(0, gradientColour + String(alpha) + ")");
        gradient.addColorStop(1, gradientColour + "0)");
					
        // Create a canvas for the cloud
        var cloudCanvas = document.createElement("canvas");
        var cloudCanvasContext = cloudCanvas.getContext("2d");

        cloudCanvas.height = cloudCanvas.width = (radius + circleRadius) * 2;
					
        // Draw the circle with gradient to a canvas.
        var circleCanvas = document.createElement("canvas");
        var circleCanvasContext = circleCanvas.getContext("2d");
        
        circleCanvas.width = circleRadius * 2;
        circleCanvas.height = circleCanvas.width;
        
        circleCanvasContext.fillStyle = gradient;
        
        circleCanvasContext.beginPath();
        circleCanvasContext.arc(circleRadius, circleRadius, circleRadius, 0, Math.PI * 2, true);
        circleCanvasContext.fill();
        
        // Draw the specified number of circles.
        for (var i = 0; i < circles; i++) {
            // Compute a randomised circle position within the cloud.
            var angle = Math.random() * Math.PI * 2;
            var x = cloudCanvas.width/2 - circleRadius + Math.random() * radius * Math.cos(angle);
            var y = cloudCanvas.height/2 - circleRadius + Math.random() * radius * Math.sin(angle);
            
            // Draw the circle.
            cloudCanvasContext.drawImage(circleCanvas, x, y);
        }
        
        // return the canvas
        return cloudCanvas;
    },
    
    // logic
    Tick: function() {
        // reset and kill clouds
        for(var index = 0; index < this.storage.length; index++) {
            // is it ouf of range?
            var outofrange = true;
            
            // respawn clouds out of range
            if(this.storage[index].x > this.canvas.width + this.Buffer) { // right
                this.storage[index].x = (Math.random() * -(this.Buffer - this.Radius)) - this.Radius;
                this.storage[index].y = Math.random() * this.canvas.height;
            }
            else if(this.storage[index].y > this.canvas.height + this.Buffer){ // bottom
                this.storage[index].y = (Math.random() * -(this.Buffer - this.Radius)) - this.Radius;
                this.storage[index].x = Math.random() * this.canvas.width;
            }
            else if(this.storage[index].x < -this.Buffer){ // left
                this.storage[index].x = canvas.width + (Math.random() * (this.Buffer - this.Radius)) + this.Radius;
                this.storage[index].y = Math.random() * this.canvas.height;
            }
            else if(this.storage[index].y < -this.Buffer){ // top
                this.storage[index].y = canvas.height + (Math.random() * (this.Buffer - this.Radius)) + this.Radius;
                this.storage[index].x = Math.random() * this.canvas.width;
            }
            else {
                outofrange = false;
            }
            
            // remove if necessary
            if(outofrange && this.storage.length > this.targetclouds && Math.random() < this.KillFactor) {
                this.storage.splice(index, 1);
                index--;
            }
            else if(outofrange) {
                // redraw the cloud
                this.storage[index].canvas = this.DrawCloudCanvas();
            }
        }
        
        // calculate amount of clouds
        this.targetclouds = Math.round(((this.canvas.width * this.canvas.height) / this.DensityFactor) * this.Density);
        
        // calculate difference
        var difference = this.targetclouds - this.storage.length;
        
        // need to spawn?
        if(difference > 0) {
            // calculate spawnamount
            // first the available pixels
            var pixels = (this.canvas.height + this.canvas.width) * this.frames * this.Speed * this.SpeedFactor * this.SpawnFactor;
            
            // calculate amount
            var amount = Math.round(pixels / this.DensityFactor * this.Density);
            
            // deckel amount
            if(amount > difference)
                amount = difference;
            
            // loop clouds
            for(i = 0; i < this.targetclouds; i++){
                // generate position
                var rand = Math.round(Math.random() * 3);
                
                switch(rand) {
                    case 0: // top
                        var x = (this.canvas.width + 2 * this.Buffer) * Math.random() - this.Buffer;
                        var y = (Math.random() * -(this.Buffer - this.Radius)) - this.Radius;
                        break;
                    case 1: // bottom
                        var x = (this.canvas.width + 2 * this.Buffer) * Math.random() - this.Buffer;
                        var y = canvas.height + (Math.random() * (this.Buffer - this.Radius)) + this.Radius;
                        break;
                    case 2: // left
                        var x = (Math.random() * -(this.Buffer - this.Radius)) - this.Radius;
                        var y = (this.canvas.height + 2 * this.Buffer) * Math.random() - this.Buffer;
                        break;
                    case 3: // right
                        var x = canvas.width + (Math.random() * (this.Buffer - this.Radius)) + this.Radius;
                        var y = (this.canvas.height + 2 * this.Buffer) * Math.random() - this.Buffer;
                        break;
                }
                
                // generate the cloud
                this.AddCloud(x, y);
            }
            
        }
        
        this.frames = 0;
    },
    
    // animate the cloud movement
    Animate: function() {
        for(var index = 0; index < this.storage.length; index++) {
            
            // move length
            var moveto = this.storage[index].speed * this.Speed * this.SpeedFactor
                
            // move
            this.storage[index].x += Math.sin(this.Direction / 360 * 2 * Math.PI) * moveto;
            this.storage[index].y -= Math.cos(this.Direction / 360 * 2 * Math.PI) * moveto;
            
            // draw to canvas
            this.ctx.drawImage(this.storage[index].canvas, this.storage[index].x - (this.storage[index].canvas.width/2), this.storage[index].y - (this.storage[index].canvas.height/2));
        }
        
        // increase frame counter
        this.frames++;
    }
    
        
    
    
}