class Wave
{
	constructor( parent, jsonobj)
	{
		this.waveCounter = 0;
		
		this.Parent = parent;
		this.Name = jsonobj.name;
		this.Hint = jsonobj.hint;
		this.Enemies = new Array();
		this.isStarted = false;

		this.delay = 100;
		this.waveStartTime = -1;
		
		
		for( var e = 0; e < jsonobj.enemies.length; e++ )
		{
			var quantity = jsonobj.enemies[e].qty;
			var type = jsonobj.enemies[e].type;
			
			for( var i = 0; i < quantity; i++ )
			{
				this.Enemies.push( EnemyFactory.createEnemy( type, this.Parent.Path ));
			}
		}
		
		this.enemyIndex = 0;
		this.waveSpawnComplete = false;
		this.wavelength = this.Enemies.length;
	}

	get IsActive(){ return this.waveStartTime > 0; }
	/**
	 * Starts sending the wave of enemies
	 * 
	 * @memberof Wave 
	 * @returns {void}
	 */
	startWave()
	{
		this.waveStartTime = game_time;
		this.isStarted = true;
		this.Enemies.forEach( (e, i) => {
			e.StartTime = this.delay * i + this.waveStartTime;
		});
	}

	update()
	{
		if( !this.isStarted )
			return;
		this.Enemies.forEach( (e) => {
			if( e.StartTime < game_time )
				e.IsMoving = true;
			if( (typeof e === 'undefined' || e.AtGoal || e.Health <= 0) && e.Despawn == false)
			{
				e.Despawn = true;
			}
		});
		this.Enemies = this.Enemies.filter( (el) => !el.Despawn );
		this.Enemies.forEach( (e) => e.update());		
	}

	draw( ctx )
	{
		if( this.isStarted )
		{
			this.Enemies.forEach( (e) => e.draw(ctx ));
		}
	}
}