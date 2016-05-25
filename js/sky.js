

var Sky = {
    
    // intern stuff
    canvas: null,
    ctx: null,
    current: null,
    
    // settings
    Sunset: 1564031540,
    Sunrise: 1463974285,
    
    TickingSpeed: 1000,
    
    // init function for canvas and sky
    Init: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        Firmament.Init(this.canvas, this.ctx);
        Clouds.Init(this.canvas, this.ctx);
    },
        
    // start this, tick and animate
    Start: function() {
        this.Tick();
        
        Clouds.Start();
        
        setInterval(this.Tick, this.TickingSpeed);
        this.Animate();
    },
    
    // sky logic, like day night cycle and stuff
    Tick: function() {
        Sky.UpdateFirmament();
        Firmament.Tick();
        Clouds.Tick();
    },
    
    // animation loop, rendering frames
    Animate: function(){
        
        Firmament.Animate();
        Clouds.Animate();
        
        window.requestAnimationFrame(Sky.Animate);
    },
        
    // update firmament
    UpdateFirmament: function() {
        if((Date.now() > this.Sunrise * 1000 && Date.now() < this.Sunset * 1000)
          || (Date.now() > (this.Sunrise + 24 * 60 * 60) * 1000 && Date.now() < (this.Sunset + 24 * 60 * 60) * 1000)) {
            if(this.current != "day") {
                Clouds.StartColor = Clouds.DayColor;
                Firmament.SetDay();
            }
        }
        else if(this.current != "night") {
                Clouds.StartColor = Clouds.NightColor;
                Firmament.SetNight();
        }
        
        if(Clouds.Density >= 75)
            Firmament.Cloudy = true;
        else
            Firmament.Cloudy = false;
    }
    
    
    
}