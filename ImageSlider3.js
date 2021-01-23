class ElementSlider{
    constructor(parent_ele, options){
        this.options            = options                    || {};
        this.elements           = this.options.elements;
        this.customElement      = this.options.customElement || 'img';
        if( "string" === typeof this.elements ){
            this.elements = document.querySelectorAll( this.options.elements );
        }

        if( "string" === typeof parent_ele ){
            this.parent_ele = document.querySelector( parent_ele || "body" );
        }else{
            this.parent_ele = parent_ele;
        }

        this.element_width              = this.options.element_width    || 123;
        this.element_height             = this.options.element_height   || 103;
        this.element_margin             = this.options.element_margin   >= 0 ? this.options.element_margin : 5;
        this.element_per_row            = this.options.element_per_row  || 3;
        this.margin_x                   = this.options.margin_x         || 25;
        this.prefix                     = this.options.prefix           || '';
        this.elements_shift             = this.options.elements_shift   || this.element_per_row;

        try{
            this.elements_shift           = this.options.elements_shift || this.element_per_row;
            if(this.elements_shift > this.element_per_row){
                throw new RangeError('elements_shift must be smaller than or equal to element_per_row');
            }
        }catch(err){console.log(err)};


        this.allowed_right          = ( this.element_width + ( this.element_margin * 2 ) ) * this.elements.length;    
        this.keep_move_left         = this.current_left - this.move_piece > this.allowed_left;
        this.keep_move_right        = this.current_left + this.move_piece < this.allowed_right;
        this.move_piece             = (this.element_width + this.element_margin * 2) * this.elements_shift;
        this.last_offset            = (this.element_width + this.element_margin * 2) * this.element_per_row;
        this.last_element_index_per_shift = this.element_per_row;
        this.allowed_left           = 0;
        this.outer_wrapper_width    = (this.element_width + this.element_margin * 2) * this.element_per_row;
        this.move_left_val          = this.current_left + this.move_piece;
        this.current_left           = 0;
        this.current_index          = 0;

        this.next_callback          = this.options.next_callback || false;
        this.previous_callback      = this.options.previous_callback || false;
        this.element_click_callback   = this.options.element_click_callback || false;
        this.wrapper                = this.wrapper_element();
        this.innerWrapper           = this.inner_wrapper_element();
        this.outerWrapper           = this.outer_wrapper_element();
        this.nextBtn                = this.next_btn_element();
        this.previousBtn            = this.previous_btn_element();

    
        this.init();
    }

    init(){
        let _that = this;

        this.append_elements();
        this.outerWrapper.append( this.innerWrapper );
        this.wrapper.append( this.previousBtn );
        this.wrapper.append( this.outerWrapper );
        this.wrapper.append( this.nextBtn );
        this.nextBtn.addEventListener( 'click', function(){

            _that.move_right(); 
            
             if( "function" === typeof _that.next_callback){
                _that.next_callback.call(this, _that);
             }
             
        } );
        
        this.previousBtn.addEventListener( 'click',function(){
            
             _that.move_left();

             if( "function" === typeof _that.previous_callback ){
                _that.previous_callback.call( this, _that );
             }
             
         } );

        this.parent_ele.append( this.wrapper )
    }


    optimize_elements(){
        if(window && window.innerWidth){
            switch(window.innerWidth){
                case window.innerWidth < 450:
                    this.element_width = 97;
                    this.element_height = 87;
                    break;
            }
        }
    }
    previous_btn_element(){
        let ele             = document.createElement( 'span' );
        let cssClass        = this.prefix + '_elements_slider_prev_btn';
        ele.innerHTML       = '&#10092;'
        ele.classList.add( cssClass );
        return ele;
    }
    
    next_btn_element(){
        let ele                     = document.createElement( 'span' );
        let cssClass                = this.prefix + '_elements_slider_next_btn';
        ele.innerHTML               = '&#10093;';
        ele.classList.add( cssClass );
        return ele;
    }

    wrapper_element(){
        let ele                     = document.createElement( 'div' );
        let cssClass                = this.prefix + '_element_slider_wrapper_element';
        ele.classList.add( cssClass );
        return ele;
    }
    outer_wrapper_element(){
        let ele                     = document.createElement( 'div' );
        let cssClass                = this.prefix + '_elements_slider_outer_wrapper_element';
        ele.style.height            = this.element_height + 'px';
        ele.style.width             = this.outer_wrapper_width + 'px';
        ele.classList.add( cssClass );
        return ele;
    }

    inner_wrapper_element(){
        let ele                     = document.createElement( 'div' );
        let cssClass                = this.prefix + '_elements_slider_inner_wrapper_element';
        ele.classList.add( cssClass );
        
        return ele;
    }
    append_elements(){
        let _that = this;
   
        this.elements.forEach(function(element, index){
            let element_clone = element.cloneNode(true);
            let cssClass = _that.prefix + '_element_slider_element_element' 
            element_clone.classList.add(cssClass);
            element_clone.style.margin   = '0px ' + _that.element_margin + 'px';
            element_clone.style.width     = _that.element_width + 'px';
            element_clone.style.height    = _that.element_height + 'px';
            element_clone.setAttribute('data-index', index);
            element_clone.addEventListener( 'click', function(){
                _that.current_index = this.getAttribute('data-index');
                if("function" === typeof _that.element_click_callback){
                    _that.element_click_callback.call(_that, index);
                }
                
            })
            _that.innerWrapper.append(element_clone);
            element.remove();
        })
    }

     /**
      * @TODO muss irgendwann entfernt, Elemente muessen dynamisch erzeugt.
      */
    append_image_elements(){
        let _that = this;
        
        this.elements.forEach(function(element, index){
            let element_clone = document.createElement('img');
            let cssClass = _that.prefix + '_element_slider_element_element' 
                element_clone.classList.add(cssClass)
                element_clone.src = element.src;
            element_clone.src = element.src;
            element_clone.style.margin   = '0px ' + _that.element_margin + 'px';
            element_clone.style.width     = _that.element_width + 'px';
            element_clone.style.height    = _that.element_height + 'px';
            element_clone.setAttribute('data-index', index);
            if(element.getAttribute('data-title')){
                element_clone.setAttribute('data-title', element.getAttribute('data-title'));
            }
            element_clone.addEventListener( 'click', function(){
                _that.current_index = this.getAttribute('data-index');
                if("function" === typeof _that.element_click_callback){
                    _that.element_click_callback.call(_that, index);
                }
                
            })
            _that.innerWrapper.append(element_clone);            
        })
    }
    update_move_piece(prev = false){
        let temp_last = this.last_element_index_per_shift;
        let element_shift = this.elements_shift;
        let limit_reached;
        let move_piece = this.move_piece;
        if(!prev){
            limit_reached = false;
            if(temp_last + element_shift <= this.elements.length){
                this.last_element_index_per_shift = this.last_element_index_per_shift + this.elements_shift;
                move_piece = (this.element_width + this.element_margin * 2 ) * this.elements_shift;
    
            }else if(temp_last + element_shift > this.elements.length){
                while(temp_last + element_shift > this.elements.length){
                    element_shift--;
                }
                this.last_element_index_per_shift = this.last_element_index_per_shift + element_shift;
            }else if(temp_last + element_shift == this.elements.length){
                limit_reached = true;            
            }
            if(limit_reached ) return;        
            move_piece = (this.element_width + this.element_margin * 2 ) * element_shift;
        }else{
            if(temp_last - element_shift >= this.element_per_row){
                this.last_element_index_per_shift = this.last_element_index_per_shift - this.elements_shift;
                move_piece = (this.element_width + this.element_margin * 2) * this.elements_shift;
            }else if (temp_last - element_shift <= this.element_per_row){
                while(temp_last - element_shift < this.element_per_row){
                    element_shift--;
                }
                this.last_element_index_per_shift = this.element_per_row;
            }else if (temp_last - element_shift == this.element_per_row){
                limit_reached  = true;
            }
            if(limit_reached ) return;
            move_piece = (this.element_width + this.element_margin * 2 ) * element_shift;
        }

        return move_piece;
    }

    move_left(){
        this.current_left = this.current_left - this.update_move_piece(true);
        this.innerWrapper.style.left = '-' + this.current_left + 'px';
    }

    move_right() {
        this.current_left = this.current_left + this.update_move_piece();
        this.innerWrapper.style.left = '-' + this.current_left + 'px';
    }

}   