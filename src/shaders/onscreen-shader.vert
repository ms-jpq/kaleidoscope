uniform lowp vec4 colour;

attribute lowp vec2 vertex;

varying lowp vec4 colourV;

void main()
{
    colourV = colour;
    gl_Position = vec4(vertex.x, vertex.y, 0.0, 1.0);
}
