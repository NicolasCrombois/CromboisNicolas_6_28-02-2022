function publicationFactory(data) {
    const { id, photographerId, title, image, video, likes, date, price} = data;

    function getPublicationCardDOM() {
        const article = document.createElement( 'article' );
        const div = document.createElement( 'div' );
        const h2 = document.createElement( 'h2' );
        const p = document.createElement( 'p' );
        const i = document.createElement( 'i' );

        article.classList.add('publication');
        article.id = 'pub_'+id;
        i.classList.add('fa-solid','fa-heart');
        div.classList.add('information-publication');
        i.onclick = function(){clickLike(id)};
        i.ariaLabel = "likes";
        
        h2.textContent = title;
        p.textContent = `${likes} `;

        if(image){
            const img = document.createElement( 'img' );
            img.setAttribute("src", `assets/photographers/${photographerId}/${image}`)
            img.alt = title
            img.onclick = function(){openView(id)};
            article.appendChild(img)
        }else if(video){
            const movie = document.createElement( 'video' );
            const source = document.createElement( 'source' );
            source.setAttribute("src", `assets/photographers/${photographerId}/${video}`);
            source.setAttribute("type", `video/`+video.split(".").pop());
            movie.appendChild(source)
            movie.onclick = function(){openView(id)};
            article.appendChild(movie)
        }

        p.appendChild(i);
        div.appendChild(h2);
        div.appendChild(p);
        article.appendChild(div);
        return (article);
    }
    function getLikeDOM() {
        const p = document.createElement( 'p' );
        const i = document.createElement( 'i' );

        i.classList.add('fa-solid','fa-heart');
        i.ariaLabel = "likes";
        i.onclick = function(){clickLike(id)};
        
        p.textContent = `${likes} `;


        p.appendChild(i);
        return (p);
    }
    function getImgDOM() {
        const div = document.createElement( 'div' );
        div.ariaLabel = "Image Closeup View"
        const h2 = document.createElement( 'h2' );
        if(image){
            const img = document.createElement( 'img' );
            img.setAttribute("src", `assets/photographers/${photographerId}/${image}`);
            img.alt = title;
            div.appendChild(img);
        }else if(video){
            const movie = document.createElement( 'video' );
            movie.controls = true;
            const source = document.createElement( 'source' );
            source.setAttribute("src", `assets/photographers/${photographerId}/${video}`);
            source.setAttribute("type", `video/`+video.split(".").pop());
            movie.appendChild(source);
            div.appendChild(movie);
        }
        h2.textContent = title;
        div.appendChild(h2)
        return div
    }
    
    return { getPublicationCardDOM, getLikeDOM, getImgDOM }
}