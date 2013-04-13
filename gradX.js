;

/*
 *
 *
 * gradx (id of element, {sliders}[OPTIONAL], id of target element[OPTIONAL])
 *
 * sliders structure :
 *                            
 * [
 *  {
 *     color: "COLOR",
 *     position: "POSITION" //0 to 100 without % symbol
 *  },
 *  {
 *     ....
 *     .... 
 *  }, 
 *  ....
 * ]
 *
 */

'use strict';

    
     
var gradx_selector = function(id) {
    this.ele = document.getElementById(id);
    this.ins= [];
    

};
gradx_selector.prototype = {
    
    
    
    mouse_down: function() {
        add_event(window,'mousemove', this.drag_ele);
            
    },
        
    mouse_up: function() {
    //add_event(window,'mousemove', this.drag_ele);
            
    },

    drag_ele: function(e) {
    // this.ele.style.position = 'absolute';
    //this.ele.style.top = e.clientY + 'px';
    //this.ele.style.left = e.clientX + 'px';
    //          this.obj.drag();
    },
        
    draggable: function(obj) {
        var ele = this.ele;
        ele.style.top = "86px"; //minor adjustment
        Drag.init(ele,null,6,406,86 ,86);
        return this;
    },
        
    show: function() {
        this.ele.style.display = "block";
    },
        
    hide: function() {
        this.ele.style.display = "none";
    },
    
    css: function(attr,value) {
        //very unreliable -> I know ;)
        if(typeof value == "undefined")
            return this.ele.style[attr]; //no chaining
        else this.ele.style[attr] = value;
        
        return this; //lets chain them
    },
        
    append: function(html) {
        this.ele.innerHTML += html;
    },
        
    click: function(func) {
        add_event(this.ele,'click',func);
    }
        
        
};
    
    


var gradx = {
        
    rand_RGB : [],
    rand_pos : [],
    id:null,
    slider_ids:[],
    slider_index:0, //global index for sliders
    sliders: [],//contains styles of each slider
    direction: "left",//direction of gradient 
    slider_hovered: [],
    
    jQ_present : true,

    check_jQ: function() {
        if(typeof jQuery == "undefined" && typeof $ == "undefined") {
            //doing all the hardwork so that it becomes easy to move to a robust framework such as jquery
            this.jQ_present = false;
            this.gx = function(id) {
                //very specific code
                id = id.replace("#",""); //make it comptaible with Sizzle and vanilla javascript
       
                return new gradx_selector(id);
            }
        }
        else if(typeof jQuery == "undefined") {
            this.gx = $;
        }else {
            this.gx = jQuery;
        }

    },

    add_event: function(el,evt,evt_func) {
        add_event(el,evt,evt_func);
    },
        
    get_random_position : function() {        
        var pos;
            
        do {
            pos = parseInt(Math.random()*100);                
        }            
        while(this.rand_pos.indexOf(pos) != -1); 
            
        this.rand_pos.push(pos); 
        return pos;
             
    },
        
        
    get_random_rgb : function() {
 
        var R,G,B,color;
            
        do {
            R = parseInt(Math.random()*255);
            G = parseInt(Math.random()*255);
            B = parseInt(Math.random()*255);
            
            color = "rgb("+R+", "+G+", "+B+")";
        }            
        while(this.rand_RGB.indexOf(color) != -1); 
            
        this.rand_RGB.push(color); 
        return color;

    },
        
        
    //var me  = this; //personal preference
    //var this.me = gradx.gx(this);
                                 
            
    //if target element is specified the target's style (background) is updated
    update_target : function() {
                
    },
                        
    //apply styles on fly        
    apply_style : function(ele,value) {
              
              
        //add cross-browser compatibility
        var values = [  
        "-webkit-linear-gradient("+value+")",
        "-moz-linear-gradient("+value+")",
        "-ms-linear-gradient("+value+")",
        "-o-linear-gradient("+value+")",
        "linear-gradient("+value+")"
        ];
                    
                    
                                
        var len = values.length;
                                
        while(len>=0){
            len--;
            ele.css("background",values[len]);
        }
  
    },
            
    //on load 
    apply_default_styles : function() {
        this.update_style_array()
        var value = this.get_style_value();
        this.apply_style(this.panel,value);  
    },

    //update the slider_values[] while dragging
    update_style_array : function() {
                   
        this.sliders = [];
            
        var len = this.slider_index,
        i, offset, position, id; 
            
        for(i=0; i< len; i++ ){
            id = "#gradx_slider_"+i;
            offset = parseInt(gradx.gx(id).css("left"));
            position = parseInt((offset/ gradx.container_width) * 100);
            gradx.sliders.push([gradx.gx(id).css("background-color"),position]);

        }
                    
        this.sliders.sort(function (A, B) {
            if (A[1] > B[1]) return 1;
            else return -1;
        });
    },

    //creates the complete css background value to later apply style 
    get_style_value : function() {
                                      
        var len = this.slider_index;
                  
        var style_str = "",suffix="";
        for(var i=0; i<len; i++) {                                            
            style_str += suffix + (this.sliders[i][0]+ " " + this.sliders[i][1] +"%");
            suffix = " , "; //add , from next iteration
        }
                  
        style_str = this.direction + " , " + style_str; //add direction for gradient
                  
        return style_str;
    },
                
                
    //@input rgb string rgb(<red>,<green>,<blue>)
    //@output rgb object of form { r: <red> , g: <green> , b : <blue>}
    get_rgb_obj : function(rgb) {
        
        //rgb(r,g,b)
        rgb = rgb.split("(");
        //r,g,b)
        rgb = rgb[1];
        //r g b) 
        rgb = rgb.split(",");
        
        return {
            r: parseInt(rgb[0]),
            g: parseInt(rgb[1]),
            b: parseInt(rgb[2])
        }
        
    },            
    load_info : function(ele) {
        var id = "#"+ele.id;
        this.current_slider_id = id;
        //check if current clicked element is an slider          
        if(this.slider_ids.indexOf(ele.id) != -1) { //javascript does not has # in its id
            
            var color = gradx.gx(id).css("backgroundColor");
            //but what happens if @color is not in RGB ? :(
            var rgb = this.get_rgb_obj(color);
            
            var left = gradx.gx(id).css("left");
            if(parseInt(left) > 120 && parseInt(left) < 272) {
                gradx.gx("#gradx_slider_info") //info element cached before
                .css("left",left)
                .show();
                     
            }else {
                if(parseInt(left) > 120) {
                    left = "272px";
                }else{
                    left = "120px";
                }
                
                gradx.gx("#gradx_slider_info") //info element cached before
                .css("left",left)
                .show();
                 
            }
            gradx.cp.setRgb(rgb);

        }
 
    },
                
                
    //add slider
    add_slider : function(obj) {
                            
                    
        var id,slider,k,position,value,delta;
                    
        if(typeof obj == "undefined") {
                
            if(typeof sliders == "undefined") {
                sliders =  [ //default sliders
                { 
                    color: gradx.get_random_rgb(),                
                    position: gradx.get_random_position() //x percent of gradient panel(400px)
                },
                {
                    color: gradx.get_random_rgb(),
                    position: gradx.get_random_position() 
                }
                ]

            }
                
            obj = sliders;
        }
        dgs = [];
                  
        for(k in obj) {
                        
            //convert % to px based on containers width
            delta = 6; //range: -32px tp 378px
            position = parseInt( (obj[k].position*this.container_width) / 100 ) + delta + "px";
                        
            id = "gradx_slider_"+(this.slider_index); //create an id for this slider
            this.sliders.push(                             
                [
                obj[k].color,
                obj[k].position
                ]
                );
                                
            this.slider_ids.push(id); //for reference wrt to id        

            slider = "<div class='gradx_slider' id='"+id+"'></div>";
            gradx.gx("#gradx_start_sliders_"+this.id).append(slider);
                
            gradx.gx('#'+id).css("backgroundColor",obj[k].color).css("left",position);
            this.slider_index++;
        }

        for(var i=0; i< this.slider_index;i++) {
            
            gradx.gx('#'+this.slider_ids[i]).draggable({
                containment:'parent',
                axis: 'x',
                
                start: function() {
                    if(gradx.jQ_present)
                    gradx.current_slider_id = "#"+gradx.gx(this).attr("id"); //got full jQuery power here !  
                },
                    
                drag: function() {
                                
                    gradx.update_style_array();
                    gradx.apply_style(gradx.panel, gradx.get_style_value());
                    var left = gradx.gx(gradx.current_slider_id).css("left");


                    if(parseInt(left) > 120 && parseInt(left) < 272) {
                        gradx.gx("#gradx_slider_info") //info element cached before
                        .css("left",left)
                        .show();
                     
                    }else {
                        if(parseInt(left) > 120) {
                            left = "272px";
                        }else{
                            left = "120px";
                        }
                
                        gradx.gx("#gradx_slider_info") //info element cached before
                        .css("left",left)
                        .show();
                 
                    }
                    var color = gradx.gx(gradx.current_slider_id).css("backgroundColor");
                    //but what happens if @color is not in RGB ? :(
                    var rgb = gradx.get_rgb_obj(color);
                    gradx.cp.setRgb(rgb);
                            
                }          
    
            }).click(function(){
                gradx.load_info(this);
                return false;
            });
        }
            
            
    },
            
    load_gradx : function(id) {
        this.check_jQ();
        this.me = gradx.gx(id);
        this.id = id.replace("#","");
        id = this.id;
        this.current_slider_id = false;
        var html = "<div class='gradX'><div id='gradx_add_slider' class='gradx_add_slider'>ADD</div>\n\
                                    <div class='gradx_container' id='gradx_"+id+"'>\n\
                                         \n\
                                        <div id='gradx_stop_sliders_"+id+"'></div>\n\
                                        <div class='gradx_panel' id='gradx_panel_"+id+"'></div>\n\
                                         <div class='gradx_start_sliders' id='gradx_start_sliders_"+id+"'>\n\
                                        <div class='cp-default' id='gradx_slider_info'></div> \n\
                                        </div>\n\
                                    </div></div>";
                
        this.me.append(html);

        //cache divs for fast reference
                    
        this.container = gradx.gx("#gradx_"+id);
        this.panel = gradx.gx("#gradx_panel_"+id);
        //.hide();
        //this.info.hide();
        this.container_width = 400 //HARDCODE;
        this.add_slider();


        gradx.add_event(document, 'click', function() {
            if(!gradx.jQ_present){
                if(!gradx.slider_hovered[id]){
                    gradx.gx("#gradx_slider_info").hide();
                    return false;
                    
                }
            }else{
                if (!gradx.me.is(':hover')) {
                    gradx.gx("#gradx_slider_info").hide();
                    return false;
                }
            }
        })
                                    


        gradx.gx('#gradx_add_slider').click(function() {
            gradx.add_slider([
            { 
                color: gradx.get_random_rgb(),
                position: gradx.get_random_position() //no % symbol
            }
            ]);
            gradx.update_style_array();
            gradx.apply_style(gradx.panel, gradx.get_style_value());//(where,style)

        });
              
        gradx.cp = ColorPicker(

            document.getElementById('gradx_slider_info'),

            function(hex, hsv, rgb) {
                if(gradx.current_slider_id != false) {
                    gradx.gx(gradx.current_slider_id).css('background-color',hex);
                    gradx.update_style_array();
                    gradx.apply_style(gradx.panel, gradx.get_style_value());
                }
            //console.log(hsv.h, hsv.s, hsv.v);         // [0-359], [0-1], [0-1]
            //console.log(rgb.r, rgb.g, rgb.b);         // [0-255], [0-255], [0-255]
            //document.body.style.backgroundColor = hex;        // #HEX
            });
            
        gradx.add_event(document.getElementById(id),'mouseout',function(){
            gradx.slider_hovered[id] = false;
        });
        gradx.add_event(document.getElementById(id),'mouseover',function(){
            gradx.slider_hovered[id] = true;

        });
            
    }
            



};



function  add_event(element, event, event_function) 
{       
    if(element.attachEvent) //Internet Explorer
        element.attachEvent("on" + event, function() {
            event_function.call(element);
        }); 
    else if(element.addEventListener) //Firefox & company
        element.addEventListener(event, event_function, false); //don't need the 'call' trick because in FF everything already works in the right way          
}; 


var gradX = function(id, sliders, target) {
    
        
    if(typeof target == "undefined") {
        target = false; //no target element
    }
    
    gradx.load_gradx(id);
    gradx.apply_default_styles();


};






