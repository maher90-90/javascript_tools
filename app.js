document.addEventListener("DOMContentLoaded", function(event) {
    let imgWrapper = document.querySelector('.imgwrapper');
    let images = [];
    fetch('https://picsum.photos/v2/list?limit=10')
    .then(res => res.json().then(data => {
        for(let obj of data){
            let img = document.createElement('img');
                img.src = obj.download_url;
                img.classList.add('img-item');
                images.push(img);
        }
        runfunc(images)
    }))

    .catch(err => {})
});

function runfunc(imgs){
    let iv = new ImageSlider('.imgviewerwrapper', {
        images: imgs,
        images_shift:2,
        pics_per_row: 5,
        prefix: 'vitavia',
        image_click_callback: function(index){
            return new ImageViewer(this.images, {
                current_index: index
            })
        }

    })
    /*
    let mm = new ImageViewer(iv.images, {

    })*/
}