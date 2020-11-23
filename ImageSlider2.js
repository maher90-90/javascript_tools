class ImageSlider{
    constructor(parent_ele, options){
        this.options            = options                    || {};

        if( "string" === typeof this.images ){
            this.images = document.querySelectorAll( this.options.images );
        }else{
            this.images = this.options.images;
        }

        if( "string" === typeof parent_ele ){
            this.parent_ele = document.querySelector( parent_ele || "body" );
        }else{
            this.parent_ele = parent_ele;
        }

        this.image_width            = this.options.image_width  || 123;
        this.image_height           = this.options.image_height || 103;
        this.image_margin           = this.options.image_margin || 5;
        this.pics_per_row           = this.options.pics_per_row || 3;
        this.margin_x               = this.options.margin_x     || 25;
        this.prefix                 = this.options.prefix       || '';
        this.images_shift           = this.options.images_shift || 3;
        this.allowed_right          = ( this.image_width + ( this.image_margin * 2 ) ) * this.images.length;    
        this.keep_move_left         = this.current_left - this.move_piece > this.allowed_left;
        this.keep_move_right        = this.current_left + this.move_piece < this.allowed_right;
        this.move_piece             = (this.image_width + this.image_margin * 2) * this.images_shift;
        this.last_offset            = (this.image_width + this.image_margin * 2) * this.pics_per_row;
        this.last_image_index_per_shift = this.pics_per_row;
        this.allowed_left           = 0;
        this.outer_wrapper_width    = (this.image_width + this.image_margin * 2) * this.pics_per_row;
        this.move_left_val          = this.current_left + this.move_piece;
        this.current_left           = 0;
        this.current_index          = 0;

        this.next_callback          = this.options.next_callback || false;
        this.previous_callback      = this.options.previous_callback || false;
        this.image_click_callback   = this.options.image_click_callback || false;
        this.wrapper                = this.wrapper_element();
        this.innerWrapper           = this.inner_wrapper_element();
        this.outerWrapper           = this.outer_wrapper_element();
        this.nextBtn                = this.next_btn_element();
        this.previousBtn            = this.previous_btn_element();
        
    

    
        this.init();
    }

    init(){
        let _that = this;

        this.append_images();
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


    previous_btn_element(){
        let ele             = document.createElement( 'span' );
        let cssClass        = this.prefix + '_images_slider_prev_btn';
        ele.innerHTML       = '&#10092;'
        ele.classList.add( cssClass );
        return ele;
    }
    
    next_btn_element(){
        let ele                     = document.createElement( 'span' );
        let cssClass                = this.prefix + '_images_slider_next_btn';
        ele.innerHTML               = '&#10093;';
        ele.classList.add( cssClass );
        return ele;
    }

    wrapper_element(){
        let ele                     = document.createElement( 'div' );
        let cssClass                = this.prefix + '_image_slider_wrapper_element';
        ele.classList.add( cssClass );
        return ele;
    }
    outer_wrapper_element(){
        let ele                     = document.createElement( 'div' );
        let cssClass                = this.prefix + '_images_slider_outer_wrapper_element';
        ele.style.height            = this.image_height + 'px';
        ele.style.width             = this.outer_wrapper_width + 'px';
        ele.classList.add( cssClass );
        return ele;
    }

    inner_wrapper_element(){
        let ele                     = document.createElement( 'div' );
        let cssClass                = this.prefix + '_images_slider_inner_wrapper_element';
        ele.classList.add( cssClass );
        
        return ele;
    }
    append_images(){
        let _that = this;
        
        this.images.forEach(function(img, index){
            let img_clone = document.createElement('img');
            let cssClass = _that.prefix + '_image_slider_image_element' 
                img_clone.classList.add(cssClass)
                img_clone.src = img.src;
            img_clone.src = img.src;
            img_clone.style.margin   = '0px ' + _that.image_margin + 'px';
            img_clone.style.width     = _that.image_width + 'px';
            img_clone.style.height    = _that.image_height + 'px';
            img_clone.setAttribute('data-index', index);
            img_clone.addEventListener( 'click', function(){
                _that.current_index = this.getAttribute('data-index');
                if("function" === typeof _that.image_click_callback){
                    _that.image_click_callback.call(_that, index);
                }
                
            })
            _that.innerWrapper.append(img_clone);            
        })
    }

    update_image_shift(prev = false){
        let tempMovePiece = this.move_piece;
        let tempImageShift = this.images_shift;
        if(this.pics_per_row + tempImageShift > this.images.length){
                while(this.pics_per_row + tempImageShift  > this.images.length){
                    tempImageShift--;
                }

            tempMovePiece =  (this.image_width + this.image_margin * 2) * tempImageShift;
            
        }
        if(prev){
            if(this.pics_per_row - tempImageShift < 0){
                tempImageShift = 0;
            }
        }
        return tempMovePiece;        
    }
    move_left(){
        let _that = this;
        this.keep_move_left     = this.current_left - this.move_piece >= this.allowed_left;
        this.keep_move_left     = this.last_image_index_per_shift - this.images_shift > 0;
        if(!this.keep_move_left) return;
        this.current_left -= this.move_piece;
        this.last_image_index_per_shift -= this.images_shift;
        this.temp -= this.images_shift;
        this.innerWrapper.style.left = '-' + this.current_left + 'px';
    }

    move_right ()  {
        let _that = this;
        let temp_image_shift;
        let update_image_shift = false;

        this.current_left += this.update_image_shift();
        this.last_image_index_per_shift += this.images_shift;
        this.innerWrapper.style.left = '-' + this.current_left + 'px';
    }

}   