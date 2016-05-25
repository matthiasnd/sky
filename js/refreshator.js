


var Refreshator = {
    
    // update the weather
    Update: function(callback) {
        
        // build url
        var url = "/weather.php";
        if(window.location.pathname.length > 3)
            url += "?loc=" + window.location.pathname.substr(1);
        
        // make a get
        $.get(url, function(data){
            // parse
            var weather = JSON.parse(data);
            
            // set values
            Clouds.Density = (weather.clouds.all) ? weather.clouds.all : 40;
            Clouds.Speed = (weather.wind.speed) ? weather.wind.speed : 5;
            Clouds.Direction = (weather.wind.deg) ? weather.wind.deg : 90;
            Sky.Sunrise = weather.sys.sunrise;
            Sky.Sunset = weather.sys.sunset;
            
            // call callback
            if(typeof(callback) == "function")
                callback();
            
        });
    }
    
}