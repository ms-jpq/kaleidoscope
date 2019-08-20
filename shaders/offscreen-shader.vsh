uniform lowp float vertexCount;
uniform lowp vec4 colourA;
uniform lowp vec4 colourB;
uniform lowp float pointSize;

attribute lowp vec3 vertex;

varying lowp vec4 colourV;

void main()
{
    colourV = mix(colourA, colourB, vertex.z / (vertexCount - 1.0));
    gl_Position = vec4(vertex.x, vertex.y, 0.0, 1.0);
    gl_PointSize = pointSize;
}
