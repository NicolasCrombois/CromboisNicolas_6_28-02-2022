function publicationFactory(data) {
    const { id, photographerId, title, image, video, likes, date, price} = data;

    //Format d'affichage de la publication dans la liste des publications (page du photographe)
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
        p.tabIndex = 0;
        p.id = id;

        if(image){
            const img = document.createElement( 'img' );
            img.setAttribute("src", `assets/photographers/${photographerId}/${image}`)
            img.alt = `Picture `+title
            img.tabIndex = 0;
            img.addEventListener("click",  function(){openView(id)});
            img.addEventListener("keyup",  event => {if(event.keyCode === 13){openView(id)}});
            article.appendChild(img)
        }else if(video){
            const movie = document.createElement( 'video' );
            const source = document.createElement( 'source' );
            source.setAttribute("src", `assets/photographers/${photographerId}/${video}`);
            source.setAttribute("type", `video/`+video.split(".").pop());
            movie.appendChild(source);
            movie.tabIndex = 0;
            movie.addEventListener("click",  function(){openView(id)});
            movie.addEventListener("keyup",  event => {if(event.keyCode === 13){openView(id)}});
            article.appendChild(movie)
        }

        p.appendChild(i);
    
        p.addEventListener("keypress", event => {if(event.keyCode === 13){clickLike(id)}})
        div.appendChild(h2);
        div.appendChild(p);
        article.appendChild(div);
        return (article);
    }
    //Format d'affichage des likes (utile lors de l'incrémentation)
    function getLikeDOM() {
        const p = document.createElement( 'p' );
        const i = document.createElement( 'i' );

        i.classList.add('fa-solid','fa-heart');
        i.ariaLabel = "likes";
        i.onclick = function(){clickLike(id)};
        
        p.tabIndex = 0;
        p.id = id;
        p.textContent = `${likes} `;
        p.addEventListener("keypress", event => {if(event.keyCode === 13){clickLike(id)}})

        p.appendChild(i);
        return (p);
    }
    //Format d'affichage de la publication pour la lightbox
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
            movie.title = title;
            const source = document.createElement( 'source' );
            source.setAttribute("src", `assets/photographers/${photographerId}/${video}`);
            source.setAttribute("type", `video/`+video.split(".").pop());
            source.tabIndex = 1;
            movie.appendChild(source);
            div.appendChild(movie);
        }
        h2.textContent = title;
        div.appendChild(h2)
        return div
    }
    return { getPublicationCardDOM, getLikeDOM, getImgDOM }
}