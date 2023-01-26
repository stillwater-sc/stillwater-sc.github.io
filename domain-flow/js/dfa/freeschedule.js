/**
 * Created by tomtz on 2/14/2017.
 */
function createFreeScheduleWavefrontScene( lattice, pointSize, vrtxShader, pxlShader, uniforms, timingFunction ) {
    var scene = new THREE.Scene();
    var vertices = lattice.vertices;

    var positions = new Float32Array( vertices.length * 3 );
    var colors    = new Float32Array( vertices.length * 3 );
    var sizes     = new Float32Array( vertices.length );
    var timing    = new Float32Array( vertices.length );

    var vertex;
    var color = new THREE.Color();

    // Set up the data for the THREE.js BufferGeometry API call
    for ( var i = 0, l = vertices.length; i < l; i = i + 3 ) {
        // vertex coordinates of a, b, and c points are the same
        vertex = vertices[i];
        vertex.toArray( positions, i * 3 );
        vertex = vertices[i+1];
        vertex.toArray( positions, (i+1) * 3 );
        vertex = vertices[i+2];
        vertex.toArray( positions, (i+2) * 3 );

        // color of the points are the same
        // color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
        color.setHSL( 0.75, 1.0, 0.5);
        color.toArray( colors, i * 3 );
        color.setHSL( 0.5, 1.0, 0.5);
        color.toArray( colors, (i+1) * 3 );
        color.setHSL( 0, 1.0, 0.5);
        color.toArray( colors, (i+2) * 3 );

        // size is the same
        sizes[ i ]   = pointSize;
        sizes[ i+1 ] = pointSize;
        sizes[ i+2 ] = pointSize;

        // timing is not
        timing[ i ]   = timingFunction( [0,1,0], [ vertex.x, vertex.y, vertex.z ]);
        timing[ i+1 ] = timingFunction( [1,0,0], [ vertex.x, vertex.y, vertex.z ]);
        timing[ i+2 ] = timingFunction( [1,1,1], [ vertex.x, vertex.y, vertex.z ]);
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