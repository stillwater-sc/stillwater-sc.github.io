/**
 * Created by tomtz on 2/14/2017.
 */
function createIndexSpaceGeometry( N, M, K, cellSize, center, matmul ) {
    var lattice = new THREE.Geometry();

    if (center) {
        for ( var i = -N/2; i <= N/2; i++ ) {
            for ( var j = -M/2; j <= M/2; j++ ) {
                for ( var k = -K/2; k <= K/2; k++ ) {
                    lattice.vertices.push( new THREE.Vector3( i * cellSize, j * cellSize, k * cellSize ) );
                }
            }
        }
    } else {
        for ( var i = 0; i < N; i++ ) {
            for ( var j = 0; j < M; j++ ) {
                for ( var k = 0; k < K; k++ ) {
                    if (matmul) {
                        // create the lattices for a, b, and c recurrences
                        lattice.vertices.push( new THREE.Vector3( i * cellSize, j * cellSize, k * cellSize ) );
                        lattice.vertices.push( new THREE.Vector3( i * cellSize, j * cellSize, k * cellSize ) );
                        lattice.vertices.push( new THREE.Vector3( i * cellSize, j * cellSize, k * cellSize ) );
                    } else {
                        lattice.vertices.push( new THREE.Vector3( i * cellSize, j * cellSize, k * cellSize ) );
                    }
                }
            }
        }
    }

    return lattice;
}

function createIndexSpaceScene( lattice, pointSize ) {
    var scene = new THREE.Scene();
    // var geometry1 = new THREE.BoxGeometry( 200, 200, 200, 16, 16, 16 );
    var vertices = lattice.vertices;

    var positions = new Float32Array( vertices.length * 3 );
    var colors    = new Float32Array( vertices.length * 3 );
    var sizes     = new Float32Array( vertices.length );

    var vertex;
    var color = new THREE.Color();

    var hue = 0.11;
    for ( var i = 0, l = vertices.length; i < l; i++ ) {
        vertex = vertices[i];
        vertex.toArray( positions, i * 3 );

        // color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
        color.setHSL( hue, 1.0, 0.5 );
        color.toArray( colors, i * 3 );

        sizes[ i ] = pointSize;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

    var material = new THREE.ShaderMaterial( {
        uniforms: {
            color:    { value: new THREE.Color( 0xffffff ) },
            texture:  { value: new THREE.TextureLoader().load( "../../textures/sprites/ball.png" ) }
        },

        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

        alphaTest: 0.9
    } );

    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    return scene;
}