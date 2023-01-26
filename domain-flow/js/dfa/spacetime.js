/**
 * Created by tomtz on 2/24/2017.
 */
function createSpacetimeGeometry( N, M, K, cellSize) {
    var lattice = new THREE.Geometry();

    for ( var i = -N/2; i <= N/2; i++ ) {
        for ( var j = -M/2; j <= M/2; j++ ) {
            for ( var k = -K/2; k <= K/2; k++ ) {
                lattice.vertices.push( new THREE.Vector3( i * cellSize, j * cellSize, k * cellSize ) );
            }
        }
    }

    return lattice;
}

/**
 * Created by tomtz on 2/24/2017.
 */
function createSpacetimeScene( lattice, pointSize, vrtxShader, pxlShader, uniforms, timingFunction ) {
    var scene = new THREE.Scene();
    var vertices = lattice.vertices;

    var positions = new Float32Array( vertices.length * 3 );
    var colors    = new Float32Array( vertices.length * 3 );
    var sizes     = new Float32Array( vertices.length );
    var timing    = new Float32Array( vertices.length );

    var vertex;
    var color = new THREE.Color();

    for ( var i = 0, l = vertices.length; i < l; i++ ) {
        vertex = vertices[i];
        vertex.toArray( positions, i * 3 );

        color.setHSL( 0.11, 1.0, 0.5 );
        color.toArray( colors, i * 3 );

        // size is the same
        sizes[ i ]   = pointSize;

        // timing is not
        timing[ i ]   = timingFunction([ vertex.x, vertex.y, vertex.z ]);
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    geometry.addAttribute( 'schedule', new THREE.BufferAttribute( timing, 1 ) );

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( vrtxShader ).textContent,
        fragmentShader: document.getElementById( pxlShader ).textContent,

        alphaTest: 0.9
    } );

    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    return scene;
}

/**
 * Created by tomtz on 2/24/2017.
 */
function sphericalWavefront( vertex ) {
    return Math.abs(vertex[0]) + Math.abs(vertex[1]) + Math.abs(vertex[2])
}