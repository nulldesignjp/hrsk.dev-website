/*
	script.js	
*/


window.addEventListener('DOMContentLoaded', () => {

    var style0 = "color:white;font-weight:bold;background-color:#181818;padding: 3px 6px;";
    console.log("%chrsk.dev, Since 2022.09",style0);

	let scene, camera,renderer, focus, background
	let amb, dir, po
	let time,timeScale,clock
	let loopKey
	let mesh
	let resizeKey

	let _w = window.innerWidth;
	let _h = window.innerHeight;

	init();
	setup();
	update();

	window.addEventListener( 'resize', resize );

	setTimeout(()=>{
		document.querySelector('header').style.opacity = 1
		document.querySelector('label').style.opacity = 1
		document.querySelector('section').style.opacity = 1
		document.querySelector('footer').style.opacity = 1

		document.querySelector('header').style.filter = 'blur(0px)'
		document.querySelector('label').style.filter = 'blur(0px)'
		document.querySelector('section').style.filter = 'blur(0px)'
		document.querySelector('footer').style.filter = 'blur(0px)'
	},1000)


	//	dark mode
	let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	let darkModeOn = darkModeMediaQuery.matches;
	modeCheck();

	darkModeMediaQuery.addListener((e) => {
		darkModeOn = e.matches;
		modeCheck();
	});

	function modeCheck()
	{
		if (darkModeOn) {
		    document.body.classList.remove('light-mode');
		    document.body.classList.add('dark-mode');
		    background = 0x181818
		    meshColor = 0x333333
		} else {
		    document.body.classList.remove('dark-mode');
		    document.body.classList.add('light-mode');
		    background = 0xF0F0F0
		    meshColor = 0xFFFFFF
		}
		
		scene.background = new THREE.Color( background )
		scene.fog = new THREE.Fog( background, 7, 10 )
		mesh.material.color = new THREE.Color( meshColor )
	}

	document.getElementById('switch').addEventListener('change',() => {
		darkModeOn = !darkModeOn;
		modeCheck();
	})



	// setTimeout( update,1000)

	function init()
	{
		var _canvas = document.createElement('canvas')
		document.getElementById('vantajs').appendChild( _canvas )

		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer({antialias: true, canvas: _canvas})
		camera = new THREE.PerspectiveCamera( 50, _w/_h, 0.1, 20 );
		focus = new THREE.Vector3();
		clock = new THREE.Clock();

		background = 0xF0F0F0

		amb = new THREE.AmbientLight( 0xFFFFFF, 0.8 )
		dir = new THREE.DirectionalLight( 0xFFFFFF, 1.0 )
		po = new THREE.PointLight( 0xFFFFFF, 0.2 ) 

		scene.add( amb );
		scene.add( dir );
		scene.add( po );

		scene.fog = new THREE.Fog( background, 7, 10 )

		// meshList = [];
		let _geometry = new THREE.BoxGeometry( 1,1,1 )
		let _material = new THREE.MeshPhongMaterial({
			flatShading: true,
			color: 0xFFFFFF
		});
		mesh = new THREE.Mesh( _geometry, _material );

		scene.add(mesh)
	}

	function setup()
	{
		var _w  = window.innerWidth;
		var _h = window.innerHeight;

		time = 0;
		timeScale = 1.0;
		
		scene.background = new THREE.Color( background )

		renderer.setPixelRatio( window.devicePixelRatio )
		renderer.setSize( _w, _h )

		camera.position.set( 0, 0, -10 )

		po.position.set( 0, 5, 0 )
		dir.position.set( 10, 20, 30)

		mesh.scale.set(3,3,3)
		mesh.rotation.set( Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2)
	}

	function update(){
		loopKey = window.requestAnimationFrame( update );

		if( renderer.domElement.classList.contains('hide') )
		{
			return;
		}

		mesh.rotation.x += 0.001;
		mesh.rotation.y += 0.001;

		let _delta = clock.getDelta();
		time += _delta * timeScale;

		focus.x = Math.sin( time * 0.764 ) * 0.215;
		focus.y = Math.cos( time * 0.3371 ) * 0.215;
		focus.z = Math.cos( time * 0.146 ) * 0.415;

		camera.lookAt(focus)

		renderer.render( scene, camera )
	}

	function resize()
	{
		renderer.domElement.classList.add('hide')

		clearTimeout( resizeKey )
		resizeKey = setTimeout( ()=>{

			var _w  = window.innerWidth;
			var _h = window.innerHeight;

			renderer.setSize( _w, _h );

			if( camera.aspect )
			{
				camera.aspect = _w / _h;
			} else {
				camera.left = - _w * 0.5;
				camera.right = _w * 0.5;
				camera.bottom = - _h * 0.5;
				camera.top = _h * 0.5;
			}
			camera.updateProjectionMatrix();

			renderer.domElement.classList.remove('hide')

			//	update view
			// _this.controls.update();
			// _this.camera.lookAt( _this.focus );
		}, 400 )
	}

})