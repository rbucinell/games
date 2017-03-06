////////////////////////////////////////////////////
// Class to Load in and store an atlas
////////////////////////////////////////////////////

//Global atlas reference
gAtlases = [];

function Atlas()
{
	var _this = this;
	
	this.SpriteSheet = new Image();
	this.Textures = [];
	this.fullyloaded = false;
	
	var imgLoaded = false;
	var dataLoaded = false;
	
	this.Load = function( spriteSheet, dataFile, trackMapReference )
	{		
		console.log( "Atlas Load");
		this.SpriteSheet.onload = function(){
			imgLoaded = true;
			_this.SpriteSheet = this;
			
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function()
			{
				if( xhttp.readyState === 4 && xhttp.status === 200 )
				{
					ReadXml( xhttp.responseXML );
					if( typeof trackMapReference !== 'undefined' )
						trackMapReference.LoadTiles();
				}
			};
			xhttp.open("GET", dataFile, true);
			xhttp.send();
		}
		this.SpriteSheet.src = spriteSheet;
		var _this = this;
		
		

		gAtlases.push( this );
	}
	
	var LoadAtlasImage = function( )
	{
		imgLoaded = true;
	}
	
	
	var ReadXml = function( xmlDoc )
	{	
	
		var elements = xmlDoc.getElementsByTagName( 'SubTexture' );
		var textureCount = elements.length;
		
		for( var i = 0; i < textureCount; i++)
		{
			var texture = new Texture( elements[i].attributes['name'].value,
									   parseInt(elements[i].attributes['x'].value),
									   parseInt(elements[i].attributes['y'].value),
									   parseInt(elements[i].attributes['width'].value),
									   parseInt(elements[i].attributes['height'].value),
									   _this);
			_this.Textures.push( texture );
		}
		
		_this.fullyloaded = true;
	};
	
	
	
	
}

//Fetches the texture by its name
Atlas.prototype.getTextureByName = function( textureName )	
{
	return $.grep(this.Textures, function(e){ return e.Name == textureName; })[0];
}

Atlas.prototype.Load = function( spriteSheet, dataFile )
{
	this.SpriteSheet.onload = function()
	{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function()
		{
			if( xhttp.readyState === 4 && xhttp.status === 200 )
			{
				
				Atlas.ReadXml.call( this, xhttp.responseXML )
				//ReadXml( xhttp.responseXML );
			}
		};
		xhttp.open("GET", dataFile, true);
		xhttp.send();
	}
	this.SpriteSheet.src = spriteSheet;
	gAtlases.push( this );
};

var XHR = function( file, callback )
{
	var xhttp = new XMLHttpRequest();
}


AtlasDataType = {
	JSON : "json",
	XML : "xml"
};
