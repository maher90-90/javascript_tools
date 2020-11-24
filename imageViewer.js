class ImageViewer{

    constructor( images, options ){
        this.single_mode            = true;
        this.options                = options || {};
        this.prefix                 = this.options.prefix || "";
        this.parent_element         = this.options.parent_element || "body";
        this.current_index          = this.options.current_index || 0;
        this.loop                   = this.options.loop || false;
        if( "string" === typeof images ){
            this.images = document.querySelectorAll( images );
        }else{
            this.images = images;
        };

        if( this.images.length === 1 ){
            this.single_mode = true;
        }
        if( "string" === typeof this.parent_element ){
            this.parent_element = document.querySelector( this.parent_element );
        }
        this.outerWrapper           = this.outer_wrapper_element();
        this.innerWrapper           = this.inner_wrapper_element();
        this.footerElement          = this.footer_element();
        this.headerElement          = this.header_element();
        this.contentElement         = this.content_element();
        this.imagesWrapper          = this.images_wrapper_element();
        this.dotsWrapper            = this.dots_wrapper_element();
        this.closeBtn               = this.close_btn_element();
        this.nextBtn                = this.next_btn_element();
        this.prevBtn                = this.prev_btn_element();
        this.title                  = "";
        this.before_callback        = this.options.before_callback || false;
        if("function" === typeof this.before_callback){
            
            this.before_callback();
        }
        this.init();
    }

    init(){
        let _that = this;
        
        this.outerWrapper.append( this.closeBtn );
        this.closeBtn.addEventListener( 'click', function(){
            _that.outerWrapper.remove();
        } );

        this.images.forEach( function( imgEle, index ){
            let imgClone            = document.createElement('img');
            let imgCloneCssClass    = _that.prefix + '_image_viewer_image_element';
            let dotEle              = document.createElement( 'div' );
            let dotEleCssClass      = _that.prefix + '_image_viewer_dot_element';

            dotEle.classList.add(dotEleCssClass);
            dotEle.setAttribute('data-index', index);
            if(imgEle.getAttribute('data-title')){
                imgClone.setAttribute('data-title', imgEle.getAttribute('data-title'));
            }
            dotEle.addEventListener( 'click', function(){
                    _that.set_current_index.call( _that, this.getAttribute( 'data-index' ) );
                    _that.showSlide( _that.current_index );

            })
            _that.dotsWrapper.append( dotEle );
            imgClone.setAttribute( 'data-index', index );
            imgClone.classList.add( imgCloneCssClass );
            imgClone.src = imgEle.src;
            _that.imagesWrapper.append( imgClone );
            imgEle.style.cursor = 'pointer';
            /*
            imgEle.addEventListener( 'click', function(){
                _that.parent_element.append( _that.outerWrapper );
            });
            */            
        });
        this.images = this.imagesWrapper.children;
        if(this.options.single_mode){
            this.single_mode = this.options.single_mode;
        }
        if( this.images.length > 1 ) this.single_mode = false;
        this.contentElement.append( this.imagesWrapper )
        this.footerElement.append( this.prevBtn );
        this.footerElement.append( this.dotsWrapper );
        this.footerElement.append( this.nextBtn );
        this.innerWrapper.append( this.headerElement );
        this.innerWrapper.append( this.contentElement );
        if(!this.single_mode){
            this.innerWrapper.append( this.footerElement );
        }
        this.outerWrapper.append( this.innerWrapper );
        
        this.nextBtn.addEventListener( 'click', function(){
            _that.next_slide.call( _that );
        });
        this.prevBtn.addEventListener( 'click', function(){
            _that.prev_slide.call( _that );
        });
        this.showSlide( this.current_index );
        this.parent_element.append(this.outerWrapper);
    }


    
    set_current_index( val ){
        
        if( val > this.images.length -1 ){
            val = this.loop ? 0 : this.images.length - 1;
        }
        if( val < 0 ){
            val = this.loop ? this.images.length - 1 :  0;
        }

        this.current_index = val;
    }


    outer_wrapper_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_outer_wrapper';
        ele.classList.add( cssClass );
        return ele;
    }

    
    inner_wrapper_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_inner_wrapper';
        ele.classList.add( cssClass );
        return ele;
    }

    
    header_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_header';
        ele.classList.add( cssClass );
        return ele;
    }

    
    content_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_content';
        ele.classList.add( cssClass );
        return ele;
    }
    
    
    images_wrapper_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_images_wrapper';
        ele.classList.add( cssClass );
        return ele;
    }
    
    
    showSlide( n ){
        for( let i = 0 ; i < this.images.length; i++ ){
            this.images[i].style.display = 'none';
            this.dotsWrapper.children[i].classList.remove('active');
            
        }
        
        this.images[n].style.display = 'block';
        if(this.images[n].getAttribute('data-title')){
            this.title =  this.images[n].getAttribute('data-title');
            this.headerElement.innerHTML = this.title;
        }
        this.dotsWrapper.children[n].classList.add('active');
    }


    next_slide(){
        let index = ++this.current_index;
        this.set_current_index( index );
        this.showSlide( this.current_index );
    }


    prev_slide(){
        let index = --this.current_index;
        this.set_current_index( index );
        this.showSlide( this.current_index );
    }
    
    
    footer_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_footer';
        ele.classList.add( cssClass );
        return ele;
    }


    close_btn_element(){
        let ele = document.createElement( 'p' );
        let cssClass = this.prefix + '_image_viewer_close_btn';
        ele.classList.add( cssClass );
        ele.innerHTML = '&#10008;';
        return ele;
    }
    
    next_btn_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_next_btn';
        ele.innerHTML = '&#10093;';
        ele.classList.add( cssClass );
        return ele; 
    }


    prev_btn_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_prev_btn';
        ele.innerHTML = '&#10092;';
        ele.classList.add( cssClass );
        return ele; 
    }


    dots_wrapper_element(){
        let ele = document.createElement( 'div' );
        let cssClass = this.prefix + '_image_viewer_dots_wrapper';
        ele.classList.add( cssClass );
        return ele;
    }

        

}