---
name: Background_Blue
type: fragment
author: thefox231 https://www.shadertoy.com/view/wtXcR4
---

precision highp float;

uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

//from ShaderToy
const float thickness = .1;
const vec3 mainColor = vec3(.1, .3, .3);

bool equals(float a, float b) {
    return mod(abs(a - b), 0.2) < thickness;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    vec3 color = vec3(.0);
    
    // fix aspect ratio
    float aspectRatio = iResolution.x / iResolution.y;
    uv.x *= aspectRatio;
    uv.x -= (aspectRatio - 1.) * .5;
    
    // pixelate
    float pxAmt = 90.;
    
    uv.x = floor(uv.x * pxAmt) / pxAmt;
    uv.y = floor(uv.y * pxAmt) / pxAmt;
    
    // repixelate
    pxAmt = 90.;
    
    uv.x = floor(uv.x * pxAmt) / pxAmt;
    uv.y = floor(uv.y * pxAmt) / pxAmt;
    
    // interlacing .
    if (mod(fragCoord.y, 2.) < 1.) {
        uv += .4 + sin(iTime * .5 + uv.y * 15.) * 0.1;
    } else {
        uv -= .4 + cos(iTime * .5 + uv.y * 15. + .5) * 0.1;
    }
    
    // weird plasma circles thing......
    vec2 circlePosition = vec2(.5, .5);
    float circleDistance = 1.0 - length(circlePosition - uv);
    
    vec3 circleColor = mainColor * .8 + sin(iTime + uv.x * 6. + uv.y * 9. + sin(uv.x * 8.) + cos(iTime)) * .15;
    
    if (equals(circleDistance, iTime * .1 + sin(uv.y * 3.) * (.6 + sin(iTime * .3) * .4))) {
    	color += circleColor;
    } else {
        float avg = (circleColor.r + circleColor.g + circleColor.b) / 3.;
        color += vec3(avg) * .4 * circleDistance;
    }
    
    // color shortening
    // gives it a kind of like snes-like palette
    float shortAmt = 8.0;
    color = ceil(color * shortAmt) / shortAmt;
    
    fragColor = vec4(color, 1.);
}
//-----

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}